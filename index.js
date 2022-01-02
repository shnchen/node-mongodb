// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
// var cors = require('cors');
// const app = express();
// app.use(cors());
// app.listen(9999, "localhost", () => {
//   console.log("已经监听9999端口");
// });

// let objMulter = multer({ dest: "./public" }); //实例化multer，传递的参数对象，dest表示上传文件的存储路径
// app.use(objMulter.any()); //any表示任意类型的文件
// // app.use(objMulter.image())//仅允许上传图片类型

// app.use(express.static("./public"));
// app.post("/upload", (req, res) => {
//   console.log(req.body.name);
//   let oldName = req.body.name;
//   let newName = '/public/' + req.body.name; 
//   fs.renameSync(req.body.name, newName);
//   res.send({
//     err: 0,
//     url:
//       "http://localhost:9999/upload/" +
//       req.body.name
//   });
// });


var express = require('express');
var app = express();
var fs = require("fs");
 
var bodyParser = require('body-parser');
var multer  = require('multer');
var cors = require('cors')
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './public/'}).array('image'));
// app.use(cors);
app.post('/file_upload', function (req, res) {
 
   console.log(req.files[0]);  // 上传的文件信息
 
  //  var des_file = __dirname + "/public/" + req.files[0].originalname;
  //  fs.readFile( req.files[0].path, function (err, data) {
  //       fs.writeFile(des_file, data, function (err) {
  //        if( err ){
  //             console.log( err )
  //        }else{
  //              response = {
  //                  message:'File uploaded successfully', 
  //                  filename:req.files[0].originalname
  //             };
  //         }
  //         console.log( response );
  //         res.end( JSON.stringify( response ) );
  //      });
  //  });
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
 
})