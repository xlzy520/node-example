const fs = require('fs')

console.log('hello world');
const aa = fs.existsSync('polldata.json', () => {
  console.log(2);
})

console.log(aa);
