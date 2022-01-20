var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));
var userInfo = require('./routes/use-info');
var login = require('./routes/login');
app.use('/users',userInfo);
app.use('/login',login);




http.createServer(app).listen(9999,function(res) {
  console.log('服务启动成功');
});