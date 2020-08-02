/* Created by iflytek on 2020/03/01.
 *
 * 运行前：请先填写 appId、secretKey、filePath
 *
 * 语音转写 WebAPI 接口调用示例
 * 此demo只是一个简单的调用示例，不适合用到实际生产环境中
 *
 * 语音转写 WebAPI 接口调用示例 接口文档（必看）：https://www.xfyun.cn/doc/asr/lfasr/API.html
 * 错误码链接：
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 *
 */

const CryptoJS = require('crypto-js')
var rp = require('request-promise')
var log = require('log4node')
var fs = require('fs')
var path = require('path')
var express = require('express');
var app = express();
var multer  = require('multer');
var request = require('request')
var url = require('url');

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
  next();
});

app.use(express.static('public'));
const storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹需要手动创建！！！
  destination: function (req, file, cb) {
    cb(null, './dist')
  },
});
app.use(multer({
  storage
}).array('file'));

// 系统配置
const config = {
  // 请求地址
  hostUrl: "http://raasr.xfyun.cn/api/",
  // 在控制台-我的应用-语音转写获取
  appId: "5f15b3fd",
  // 在控制台-我的应用-语音转写获取
  secretKey: "2db0049ceaf02d78b2643ec06c94c0d1",
  // 音频文件地址
  filePath: "./test.mp3"
}

// 请求的接口名
const api = {
  prepare: 'prepare',
  upload: 'upload',
  merge: 'merge',
  getProgress: 'getProgress',
  getResult: 'getResult'
}

// 文件分片大小 10M
const FILE_PIECE_SICE = 10485760

// ——————————————————转写可配置参数————————————————
// 参数可在官网界面（https://doc.xfyun.cn/rest_api/%E8%AF%AD%E9%9F%B3%E8%BD%AC%E5%86%99.html）查看，根据需求可自行在gene_params方法里添加修改
// 转写类型
let lfasr_type = 0
// 是否开启分词
let has_participle = 'false'
let has_seperate = 'true'
// 多候选词个数
let max_alternatives = 0

// 鉴权签名
function getSigna(ts) {
  let md5 = CryptoJS.MD5(config.appId + ts).toString()
  let sha1 = CryptoJS.HmacSHA1(md5, config.secretKey)
  let signa = CryptoJS.enc.Base64.stringify(sha1)
  return signa
}

// slice_id 生成器
class SliceIdGenerator {
  constructor() {
    this.__ch = 'aaaaaaaaa`'
  }
  
  getNextSliceId() {
    let ch = this.__ch
    let i = ch.length - 1
    while (i >= 0) {
      let ci = ch[i]
      if (ci !== 'z') {
        ch = ch.slice(0, i) + String.fromCharCode(ci.charCodeAt(0) + 1) + ch.slice(i + 1)
        break
      } else {
        ch = ch.slice(0, i) + 'a' + ch.slice(i + 1)
        i--
      }
    }
    this.__ch = ch
    return this.__ch
  }
}

class RequestApi {
  constructor({appId, filePath}) {
    this.appId = appId
    this.filePath = filePath
    this.fileLen = fs.statSync(this.filePath).size
    this.fileName = path.basename(this.filePath)
  }
  
  geneParams(apiName, taskId, sliceId) {
    // 获取当前时间戳
    let ts = parseInt(new Date().getTime() / 1000)
    
    let {appId, fileLen, fileName} = this,
      signa = getSigna(ts),
      paramDict = {
        app_id: appId,
        signa,
        ts
      }
    
    switch (apiName) {
      case api.prepare:
        let sliceNum = Math.ceil(fileLen / FILE_PIECE_SICE)
        paramDict.file_len = fileLen
        paramDict.file_name = fileName
        paramDict.slice_num = sliceNum
        paramDict.has_sensitive = true
        paramDict.sensitive_type = 1
        paramDict.language = 'cn'
        const map = {
          '零': 0,
          '一': 1,
          '二': 2,
          '三': 3,
          '四': 4,
          '五': 5,
          '六': 6,
          '七': 7,
          '八': 8,
          '九': 9,
        }
        paramDict.keywords = '1,2,3,4,5,6,7,8,9,0,'+Object.keys(map).join(',')
        break
      case api.upload:
        paramDict.task_id = taskId
        paramDict.slice_id = sliceId
        break
      case api.merge:
        paramDict.task_id = taskId
        paramDict.file_name = fileName
        break
      case api.getProgress:
      case api.getResult:
        paramDict.task_id = taskId
    }
    
    return paramDict
  }
  
  async geneRequest(apiName, data, file) {
    let options
    if (file) {
      options = {
        method: 'POST',
        uri: config.hostUrl + apiName,
        formData: {
          ...data,
          content: file
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
    } else {
      options = {
        method: 'POST',
        uri: config.hostUrl + apiName,
        form: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    }
    
    try {
      let res = await rp(options)
      res = JSON.parse(res)
      
      if (res.ok == 0) {
        log.info(apiName + ' success ' + JSON.stringify(res))
      } else {
        log.error(apiName + ' error ' + JSON.stringify(res))
      }
      
      return res
    } catch (err) {
      log.error(apiName + ' error' + err)
    }
  }
  
  prepareRequest() {
    return this.geneRequest(api.prepare, this.geneParams(api.prepare))
  }
  
  uploadRequest(taskId, filePath, fileLen) {
    let self = this
    
    return new Promise((resolve, reject) => {
      let index = 1,
        start = 0,
        sig = new SliceIdGenerator()
      
      async function loopUpload() {
        let len = fileLen < FILE_PIECE_SICE ? fileLen : FILE_PIECE_SICE,
          end = start + len - 1
        
        // fs.createReadStream() 读取字节时，start 和 end 都包含在内
        let fileFragment = fs.createReadStream(filePath, {
          start,
          end
        })
        
        let res = await self.geneRequest(api.upload,
          self.geneParams(api.upload, taskId, sig.getNextSliceId()),
          fileFragment)
        
        if (res.ok == 0) {
          log.info('upload slice ' + index + ' success')
          index++
          start = end + 1
          fileLen -= len
          
          if (fileLen > 0) {
            loopUpload()
          } else {
            resolve()
          }
        }
      }
      
      loopUpload()
    })
  }
  
  mergeRequest(taskId) {
    return this.geneRequest(api.merge, this.geneParams(api.merge, taskId))
  }
  
  getProgressRequest(taskId) {
    let self = this
    
    return new Promise((resolve, reject) => {
      function sleep(time) {
        return new Promise((resolve) => {
          setTimeout(resolve, time)
        });
      }
      
      async function loopGetProgress() {
        let res = await self.geneRequest(api.getProgress, self.geneParams(api.getProgress, taskId))
        
        let data = JSON.parse(res.data)
        let taskStatus = data.status
        log.info('task ' + taskId + ' is in processing, task status ' + taskStatus)
        if (taskStatus == 9) {
          log.info('task ' + taskId + ' finished')
          resolve()
        } else {
          sleep(2000).then(() => loopGetProgress())
        }
      }
      
      loopGetProgress()
    })
  }
  
  async getResultRequest(taskId) {
    let res = await this.geneRequest(api.getResult, this.geneParams(api.getResult, taskId))
    
    let data = JSON.parse(res.data),
      result = ''
    // data.forEach(val => {
    //   result += val.onebest
    // })
    return data
    // log.info(result)
  }
  
  async allApiRequest() {
    let prepare = await this.prepareRequest()
    let taskId = prepare.data
    await this.uploadRequest(taskId, this.filePath, this.fileLen)
    await this.mergeRequest(taskId)
    await this.getProgressRequest(taskId)
    const res = this.getResultRequest(taskId)
    return res
  }
}

async function downloadUrl(urlAudio) {
  const arg = url.parse(urlAudio);
  const fileName = arg.pathname.split('/').slice(-1)[0];
  const download_dstpath =  './' + fileName
  request(urlAudio).pipe(fs.createWriteStream(download_dstpath))
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve()
    }, 500)
  })
}

function transform(arr = []){
  arr = JSON.parse(arr)
  console.error(arr);
  console.error(typeof arr);
  if (arr.length > 2) {
    arr.shift()
  }
  const map = {
    '零': 0,
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '七': 7,
    '八': 8,
    '九': 9,
    '酒': 9,
    'LEO': 6,
    'Leo': 6,
  }
  return arr.map(v=> {
    console.error(v.onebest);
    v.onebest = v.onebest.replace('。', '').toString()
    const keys = Object.keys(map)
    const index = keys.findIndex(value =>v.onebest.includes(value))
    if (map[v.onebest] || index > -1) {
      return map[keys[index]] || map[v.onebest].toString()
    }
    return v.onebest
  }).join('')
  
}

app.get('/url', async function (req, res) {
  const url = req.query.url
  console.log(url);
  downloadUrl(url).then(async ()=>{
    config.filePath = './'+ url.split('zh/')[1]
    let ra = new RequestApi(config)
    const result = await ra.allApiRequest()
    const arr = transform(result.audio_result)
    console.error(arr, 2232);
    res.send({
      data: arr,
      success: true
    })
  })
})

var server = app.listen(8088, function () {
  
  var host = server.address().address
  var port = server.address().port
  
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})
