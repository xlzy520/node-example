const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: 'LTAIUVqGhhJkpW23',
  accessKeySecret: 'w8JTHC5vwgDdBNXxuajXsHd0nJm18d',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

const templateParam = JSON.stringify({
  code: 1234
})

var params = {
  phoneNumbers: '13588043792',
  signName: '洁雅康',
  templateCode: 'SMS_217436891',
  templateParam,
}

var requestOption = {
  method: 'POST'
};

client.request('SendSms', params, requestOption).then((result) => {
  console.log(JSON.stringify(result));
}, (ex) => {
  console.log(ex);
})
