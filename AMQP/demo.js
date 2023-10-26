const container = require('rhea');
const crypto = require('crypto');

//建立连接。
var connection = container.connect({
  //接入域名，请参见AMQP客户端接入说明文档。
  'host': '1271593308715674.iot-amqp.cn-shanghai.aliyuncs.com',
  'port': 5671,
  'transport':'tls',
  'reconnect':true,
  'idle_time_out':60000,
  //userName组装方法，请参见AMQP客户端接入说明文档。其中的iotInstanceId，购买的实例请填写实例ID，公共实例请填空字符串""。
  'username':'dasdas|authMode=aksign,signMethod=hmacsha1,timestamp='+new Date().getTime()+',authId=LTAI4G9DABhgUvBhVdcFWMB6,iotInstanceId="",consumerGroupId=DEFAULT_GROUP|',
  //计算签名，password组装方法，请参见AMQP客户端接入说明文档。
  'password': hmacSha1('kkLy4l7edBlhqBU2vLZQsLXgaZyDq4', 'authId=LTAI4G9DABhgUvBhVdcFWMB6&timestamp='+new Date().getTime()),
});

//创建Receiver-Link。
console.log(3);
var receiver = connection.open_receiver();
console.log(4);

//接收云端推送消息的回调函数。
container.on('message', function (context) {
  console.log(5, context);
  var msg = context.message;
  var messageId = msg.message_id;
  var topic = msg.application_properties.topic;
  var content = Buffer.from(msg.body.content).toString();
  console.log(content, '===========打印的 ------ ');
  
  //发送ack，注意不要在回调函数有耗时逻辑。
  context.delivery.accept();
});

//计算password签名。
function hmacSha1(key, context) {
  return Buffer.from(crypto.createHmac('sha1', key).update(context).digest())
    .toString('base64');
}
