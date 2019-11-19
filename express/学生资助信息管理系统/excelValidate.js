const fs = require('fs')
const dayjs = require('dayjs')

// lowdb
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db._.mixin(lodashId)

db.defaults({ template: [], user: [], count: [], file:[],students:{} }).write()

// server
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const multer  = require('multer');
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
app.use(express.static(__dirname + '/static'));
app.use(multer({ dest: '/static/'}).single('file'));


const absPath = __dirname + '\\'

const result = (data, success = true, msg = '') => {
  return {
    msg: msg,
    data: data,
    success: success
  }
}
const resultFail = (msg = '',data = {}) => {
  return {
    msg: msg,
    data: data,
    success: false
  }
}
const resultPage = (data,total, success = true, msg = '') => {
  return {
    msg: msg,
    data: {
      list: data,
      total: total
    },
    success: success
  }
}
const initObj = obj => {
  return {
    ...obj,
    modifyDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    saveDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    isDeleted: false
  }
}
const resultSend = (res, obj, msg)=>{
  return res.send(result({}, !!obj, `${msg}${!!obj?'成功': '失败'}`))
}

app.post('/excel/login', (req, res) => {
  const data = db.get('user').find({...req.body, isDeleted: false}).value()
  if (data) {
    res.setHeader('Set-Cookie',`appToken=${data.username};path=/;httponly`)
    res.send(result({
      appToken: data.username
    }))
  } else {
    res.send(resultFail('用户名或密码不正确'))
  }
  
})
app.post('/excel/info', (req, res) => {
  const cookieStr=req.headers.cookie;
  const cookieObj = getCookieObj(cookieStr)
  const appToken = cookieObj.appToken
  const data = db.get('user').find({username: appToken}).value()
  const { password, ...rest } = data
  res.send(result(rest))
})
app.post('/excel/logout', (req, res) => {
  res.send(result({}))
})

// user
app.post('/excel/user/list', (req, res) => {
  const user = db.get('user').filter({roleCode: 'user', isDeleted: false})
  const total = user.size().value()
  user.map(v => delete v.password)
  res.send(resultPage(user,total))
})
app.post('/excel/user/add', (req, res) => {
  const user = db.get('user').insert(initObj({...req.body, roleCode: 'user'})).write()
  resultSend(res, user, '添加')
})
app.post('/excel/user/delete', (req, res) => {
  const user = db.get('user').find({ id: req.body.id }).assign({isDeleted: true}).write()
  resultSend(res, user, '删除')
})
app.post('/excel/user/update', (req, res) => {
  const user = db.get('user').find({ id: req.body.id }).assign(req.body).write()
  resultSend(res, user, '更新')
})
app.post('/excel/user/updatePassword', (req, res) => {
  const { password, newPassword } = req.body
  const user = db.get('user').find({password: password}).assign({password: newPassword}).write()
  resultSend(res, user, '更新密码')
})

// template
app.post('/excel/template/list', (req, res) => {
  const template = db.get('template').filter({isDeleted: false});
  res.send(resultPage(template,template.length))
})
app.post('/excel/template/add', (req, res) => {
  const template = db.get('template').insert({...initObj(req.body), peopleCount: 0}).write()
  resultSend(res, template, '添加')
})
app.post('/excel/template/delete', (req, res) => {
  const template = db.get('template').find({ id: req.body.id }).assign({isDeleted: true}).write()
  resultSend(res, template, '删除')
})
app.post('/excel/template/update', (req, res) => {
  const template = db.get('template').find({ id: req.body.id }).assign(req.body).write()
  resultSend(res, template, '更新')
})

// counting
app.post('/excel/counting/list', (req, res) => {
  const { templateId } = req.body
  const studentsDB = db.get('students.'+ templateId).filter().value()
  let school = {}
  studentsDB.map(v=>{
    if (!school[v.username]) {
      school[v.username] = 1
    } else {
      school[v.username] ++
    }
  })
  const keys = Object.keys(school)
  let resultData = []
  keys.map(v=>{
    resultData.push({ school: v, peopleCount: school[v] })
  })
  res.send(result({list: resultData, total: resultData.length}))
})

// students
app.post('/excel/students/list', (req, res) => {
  const data = {}
  res.send(result(data))
})
app.post('/excel/students/add', (req, res) => {
  const { data, templateId, username } = req.body
  const templateIsExist = db.get('students.'+ templateId).value()
  if (!templateIsExist) {
    db.set('students.'+ templateId, []).write()
  }
  const studentsDB = db.get('students.'+ templateId)
  const flag = data.every(v=>{
    const isDul = studentsDB.find({'身份证号': v.身份证号}).value()
    if (isDul) {
      v.error = true
    }
    return !isDul;
  })
  if (flag) {
   data.map(v=>{
     studentsDB.insert({...initObj(v),username: username}).write()
    })
    const peopleCount = studentsDB.size()
    db.get('template').find({id: templateId}).assign({peopleCount: peopleCount}).write()
    resultSend(res, true, '添加')
  } else {
    const repeatData = data.filter(v=>v.error = true)
    res.send(resultFail('添加失败，存在重复的身份证号', repeatData))
  }
})


// upload file
app.post('/excel/upload', (req, res) => {
  // console.log(req.file);  // 上传的文件信息
  // console.log(JSON.stringify(req.body));  // 附带的额外数据
  const { mimetype, originalname, path } = req.file
  if (mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    res.send(resultFail('文件类型不为Excel'))
  }
  const file = db.get('file').find({ fileName: originalname }).value()
  if (file) {
    res.send(result(file, true, '上传成功'))
    return;
  }
  const des_file = __dirname + "/static/" + originalname;
  fs.readFile(path, function (err, data) {
    fs.writeFile( des_file, data, function (err) {
      let response;
      if (err) {
        response = {
          data: null,
          msg: '上传失败' + err,
          success: false
        }
        console.log(err);
      } else {
        response = {
          msg: '文件上传成功',
          data: {
            fileUrl: originalname
          },
          success: true
        };
        db.get('file').insert({fileName: originalname, fileUrl: originalname}).write();
      }
      res.send(result(response.data, response.success, response.msg))
    });
  });
})



app.get('/picGoConfig/download', (req, res) => {
  if (fileExists) {
    res.sendFile(configPath)
  } else {
    const response = {
      message: '配置文件不存在',
      success: false
    }
    res.send(response)
  }
})

const server = app.listen(3000, function () {
  // const host = server.address().address
  const host = 'localhost'
  const port = server.address().port
  
  console.log('应用实例，访问地址为 http://%s:%s', host, port)
})


const getCookieObj = str=>{
  let cookie={};
  str.split(';').forEach(item=>{
    if(!item)return
    const arr=item.split('=')
    const key=arr[0]
    const val =arr[1]
    cookie[key]=val
  })
  return cookie
}
