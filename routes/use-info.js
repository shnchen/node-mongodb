var express = require('express');
// var cors = require('cors');
const {find,findOne,addOne,updateOne,deleteOne} = require('../model/db');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';
// var http = require('http');
var router = express.Router();
// var app = express();
// var path = require('path');
// var fs = require('fs');
// var multer = require('multer');
// var formidable = require('formidable');
// var bodyParser = require('body-parser');
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(cors());

//获取列表
router.get('/user-list',function(req,res,) {
  find('test','site',req.query,(data)=>{res.send(data)})
})
//新增用户
router.post('/add-user',function(req,res) {
  addOne('test','site',req.body,(data)=>{res.send(data)})
})
//获取详情
router.get('/user-detail',function(req,res){
  findOne('test','site',req.query,(data)=>{res.send(data)})
})

//更新数据

router.put('/update-user',function(req,res) {
  updateOne('test','site',req.body,(data)=>{res.send(data)})
})

//删除用户
router.delete('/del-user',function(req,res){
  deleteOne('test','site',req.body.id,(data)=>{res.send(data)})
})

router.get('/users',function(req,res,next) {
  find('test','site',req.body,(data)=>{res.send(data)})
  console.log(111);
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db) {
      var dbase = db.db('test');
      if(err){
        throw err;
      }
      dbase.collection('site').find({
        $and:[
          {age:{$gte:0,$lte:9}},
          {password:{$nin:['123','123456']}}
        ]
        // age:{$gte:2,$lte:9}
      },{ projection: { name: 0 } }).limit(10).sort({age:1}).toArray(function(err,ret) {
        if(err){
          res.send({
            status:500,
            message:'未知错误'
          })
        }
        var data = {list:ret}
        resolve(data)
        db.close();
      })
    })
  }).then(function(data) {
      res.send({
        status:200,
        data:data,
        message:'请求成功'
      })
  })
})
module.exports = router;