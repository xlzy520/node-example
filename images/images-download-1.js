var path = require('path');
var fs = require('fs');
var request = require('request');
var Bagpipe = require('bagpipe');
var bagpipe = new Bagpipe(100);

function downloadFile(imgPath,callback){
  console.log(imgPath);
  let fileName = path.basename(imgPath);
  let fileDownloadPath = './image'+fileName;
  let exist = fs.existsSync(fileDownloadPath);
  if(!exist){
    let writeStream = fs.createWriteStream(fileDownloadPath);
    let readStream = request(imgPath);
    readStream.pipe(writeStream);
    readStream.on('end', function () {
      readStream.end();
      callback(null, 'success');
      // console.log(`文件下载成功${fileDownloadPath}`);
    });
    readStream.on('error', function (error) {
      writeStream.end();
      fs.unlinkSync(fileDownloadPath);
      // console.log(`错误信息:${error}`);
      // 下载失败的，重新下载TODO
      readStream.end();
      callback(null, 'fail');
      setTimeout(() => {
        bagpipe.push(downloadFile, imgPath, function (err,data) {
        });
      }, 5000);
    })
    writeStream.on("finish", function () {
        readStream.end();
        writeStream.end();
      })
      .on('error',function(err){
        readStream.end();
        writeStream.end();
        // console.log(`文件写入失败}`);
      });
  }else{
    console.log('this file is existed');
  }
}



let imgList = ['https://i.loli.net/2018/10/06/5bb8615aa1e81.png','https://i.loli.net/2019/04/23/5cbf136fe0333.jpg'];
imgList.forEach(path => {
  bagpipe.push(downloadFile, path, function (err, data) {
    // console.log(data);
  });
});

