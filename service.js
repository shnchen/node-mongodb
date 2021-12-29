var express = require('express');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';
var http = require('http');
var router = express.Router();
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
http.createServer(app).listen(9999,function(res) {
  console.log('服务启动成功');
});
//获取列表
app.get('/user-list',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db) {
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').find().toArray(function(err,ret) {
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
  }).then(function(data) {
      res.send({
        status:200,
        list:data,
        message:'请求成功'
      })
  })
})

//新增用户
app.post('/add-user',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db){
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').insert(req.body,function (err,ret) {
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
      message:'添加成功！'
    })
  })
})

//获取详情

app.get('/user-detail',function(req,res){
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db) {
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').findOne({_id:require('mongodb').ObjectId(req.query._id)},function(err,ret) {
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

//更新数据

app.put('/update-user',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db){
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').updateOne({_id:require('mongodb').ObjectId(req.body._id)},
      {$set:{name:req.body.name,
        gender:req.body.gender,
        age:req.body.age,
        registryTime:req.body.registryTime}},
      function(err,ret){
        if(err){
          res.send({
            status:500,
            message:'未知错误'
          })
        }
        resolve(ret);
        db.close()
      })
    })
  }).then(function(data){
    res.send({
      status:200,
      data:data,
      message:'更新成功'
    })
  })
  
})

//删除用户
app.delete('/del-user',function(req,res){
  new Promise(function (resolve,reject) {
    MongoClient.connect(url,function (err,db) {
      
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      dbase.collection('site').deleteOne({_id:require('mongodb').ObjectId(req.body.id)},function (err,ret) {
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
      message:'删除成功'
    })
  })
})