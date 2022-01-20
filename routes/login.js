var express = require('express');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';
var http = require('http');
var router = express.Router();
var app = express();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var formidable = require('formidable');
var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());



//新增用户
router.post('/registry',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db){
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').insertOne(req.body,function (err,ret) {
          if(err){
            res.send({
              status:500,
              message:'未知错误'
            })
          }
          resolve(ret);
          db.close();
      })
    })
  }).then(function(data){
    res.send({
      status:200,
      message:'注册成功！'
    })
  })
})

//获取详情

router.get('/login',function(req,res){
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db) {
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').findOne(req.query,function(err,ret) {
        if(err){
          res.send({
            status:500,
            message:'未知错误'
          })
        }
        resolve(ret);
        db.close();
      })
    })
  }).then(function(data){
    res.send({
      status:200,
      data:data,
      message:'请求成功'
    })
  })
  
})

module.exports = router;