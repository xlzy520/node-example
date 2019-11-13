const express = require('express')
const app = express()
const fs = require('fs')
const Mock = require('mockjs')
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
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + "picGo.html");
})

app.post('/excel/login', (req, res) => {
  res.send(result({
    appToken: 'sdasdasdas'
  }))
})
app.post('/excel/info', (req, res) => {
  res.send(result({
    username: 'zhibi',
    roleCode: 'admin'
  }))
})

// user
app.post('/excel/user/list', (req, res) => {
  const data = Mock.mock({
    'list|15': [{
      username: '@cname',
      school: '@county() ' + '第' + '@cword("零一二三四五六七八九十")' + '学校',
      phone: /^1[3456789]\d{9}$/,
      grade: '@pick(["0", "1", "2", "3", "4"])',
      modifyDate: '2019-11-10',
      createDate: '2019-11-01'
    }],
    total: 20,
  })
  res.send(result(data))
})
app.post('/excel/user/add', (req, res) => {
  res.send(result({}, true, '添加成功'))
})
app.post('/excel/user/delete', (req, res) => {
  res.send(result({}, true, '删除成功'))
})
app.post('/excel/user/update', (req, res) => {
  res.send(result({}, true, '更新成功'))
})
app.post('/excel/user/changePassword', (req, res) => {
  res.send(result({}, true, '更新成功'))
})

// template
app.post('/excel/template/list', (req, res) => {
  const data = Mock.mock({
    'list|5': [{
      id: '@id',
      name:  '2019-11-10' + '@pick(["幼儿园", "小学", "初中", "中职", "高中"])'+'xx项目',
      grade: '@pick(["0", "1", "2", "3", "4"])',
      url: 'http://localhost:3000/1.xlsx',
      modifyDate: '2019-11-10',
      createDate: '2019-11-01',
      'total|50-300': 50
    }],
    total: 5,
  })
  res.send(result(data))
})
app.post('/excel/template/add', (req, res) => {
  res.send(result({}, true, '添加成功'))
})
app.post('/excel/template/delete', (req, res) => {
  res.send(result({}, true, '删除成功'))
})
app.post('/excel/template/update', (req, res) => {
  res.send(result({}, true, '更新成功'))
})

// counting
app.post('/excel/counting/list', (req, res) => {
  const data = Mock.mock({
    'list|5': [{
      school: '@county() ' + '第' + '@cword("零一二三四五六七八九十")' + '学校',
      modifyDate: '2019-11-10',
      createDate: '2019-11-01',
      'total|50-300': 50
    }],
    total: 5,
  })
  res.send(result(data))
})

// students
app.post('/excel/students/list', (req, res) => {
  const data = Mock.mock({
    'list|5': [{
      school: '@county() ' + '第' + '@cword("零一二三四五六七八九十")' + '学校',
      modifyDate: '2019-11-10',
      createDate: '2019-11-01',
      'total|50-300': 50
    }],
    total: 5,
  })
  res.send(result(data))
})
app.post('/excel/students/add', (req, res) => {
  res.send(result({}, true, '添加成功'))
})


// upload file
app.post('/excel/upload', (req, res) => {
  console.log(req.file);  // 上传的文件信息
  console.log(JSON.stringify(req.body));  // 附带的额外数据
  const { grade } = req.body
  const des_file = __dirname + "/static/" + req.file.originalname;
  fs.readFile(req.file.path, function (err, data) {
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
            url: '/static/' + req.file.originalname,
          },
          success: true
        };
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
