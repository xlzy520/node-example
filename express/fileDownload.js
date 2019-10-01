const express = require('express');
const fs=require("fs");

const app = express();
app.get('/img', function (req, res, next) {
  const { fileName } = req.query
  const path=`../static/img/${fileName}`;
  const f = fs.createReadStream(path);
  f.pipe(res);
});

app.listen(3000);
