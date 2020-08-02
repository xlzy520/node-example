var express = require('express');
var app = express();
var fs = require("fs");

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
  next();
});

var bodyParser = require('body-parser');
var multer  = require('multer');

let getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || '';
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
const storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹需要手动创建！！！
  destination: function (req, file, cb) {
    cb(null, './dist')
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
app.use(multer({
  storage
}).array('file'));

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "uploadTest.html" );
})
app.get('/fire', function (req, res) {
  res.sendFile( __dirname + "/" + "A-Cool-Flame-Fire-Effect-Using-Particles.html" );
})
app.get('/ip', function (req, res) {
  console.log(req.ip);
  res.sendFile( __dirname + "/" + "ip.txt" );
})

app.post('/addClient', function (req, res) {
  const {client, width, height } = req.body;
  let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
  ip = ip ? ip.join('.') : null;
  fs.appendFileSync('ip.txt', `${new Date().toLocaleString()} ${ip} ${width} ${height} ${client}\r`)
  res.send({
    success: true
  })
})

app.post('/file_upload', function (req, res) {
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  console.log(req.files[0]);  // 上传的文件信息
  console.log(JSON.stringify(req.body));  // 附带的额外数据
  
  // var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile( req.files[0].path, function (err, data) {
    if (!err) {
      response = {
        message:'文件上传成功',
        filename:req.files[0].originalname,
        success: false
      };
      console.log( response );
      res.end( JSON.stringify( response ) );
    }
  });
})

var server = app.listen(8081, function () {
  
  var host = server.address().address
  var port = server.address().port
  
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})
