const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');
const config = require('./smsConfig')
const fs = require('fs')

const url = 'http://www.jjwxc.net/onebook.php?novelid=1939548'

fs.readFile('character', 'utf-8',(err,data)=>{
  if(err){
    console.log("error");
  }else{
    fetchNovel(data)
  }
});


function fetchNovel(preCharacter){
  request({
    url,
    gzip: true,
    encoding: null
  }, function (err, response, body) {
    body = iconv.decode(body, 'gb2312')
    $ = cheerio.load(body)
    let latest = $(".cytable tr[itemprop='chapter newestChapter']>td:first-child").text()
    latest = Number(latest)
    console.log(`最新:${latest}, 上一章:${preCharacter}`);
    if (latest > preCharacter) {
      preCharacter = latest
      shortMessage(latest)
      fs.writeFile('character', latest,(err,data)=>{
        if(err){
          console.error("write file error");
        }
      });
    }
  });
}

function shortMessage(latest) {
  const SMSClient = require('@alicloud/sms-sdk')
  const accessKeyId = config? config.accessKeyId : process.argv[3]
  const secretAccessKey = config ? config.secretAccessKey: process.argv[4]
  let smsClient = new SMSClient({accessKeyId, secretAccessKey})
  smsClient.sendSMS({
    PhoneNumbers: '17852098440',
    SignName: '洁雅康',
    TemplateCode: 'SMS_185241056',
    TemplateParam: `{"novelName":"督公千岁-第${latest}章"}`
  }).then(function (res) {
    console.log('发送短信成功')
  }, function (err) {
    console.log(err)
  })
}
