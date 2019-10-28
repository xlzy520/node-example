const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=demo.mdb;');

// 不带返回的执行
// connection
//   .execute('INSERT INTO Users(UserName, UserSex, UserAge) VALUES ("Newton", "Male", 25)')
//   .then(data => {
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch(error => {
//     console.error(error);
//   });

// 带返回标识的执行
// connection
//   .execute('INSERT INTO Users(UserName, UserSex, UserAge) VALUES ("Newton", "Male", 25)', 'SELECT @@Identity AS id')
//   .then(data => {
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch(error => {
//     console.error(error);
//   });

// 带返回的查询
connection
  .query('SELECT * FROM webset')
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error(error);
  });

// 带字段描述的查询
// connection
//   .schema(20)
//   .then(schema => {
//     console.log(JSON.stringify(schema, null, 2));
//   })
//   .catch(error => {
//     console.error(error);
//   });
