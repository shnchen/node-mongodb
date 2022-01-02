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


//获取列表
app.get('/user-list',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db) {
      if(err){
        throw err;
      }
      var dbase = db.db('test');
      var pageSize = +req.query.pageSize;
      var offset = +pageSize*(req.query.pageNum-1);
      var total=0;
      dbase.collection('site').count(function (err,num) {
        if(err){
          throw err;
        }
        total = num;
      })
      dbase.collection('site').find().skip(offset).limit(pageSize).sort({registryTime:1}).toArray(function(err,ret) {
        if(err){
          res.send({
            status:500,
            message:'未知错误'
          })
        }
        var data = {list:ret,total:total}
        resolve(data);
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

//新增用户
app.post('/add-user',function(req,res) {
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
      {$set:{
        name:req.body.name,
        gender:req.body.gender,
        age:req.body.age,
        registryTime:req.body.registryTime,
        headUrl:req.body.headUrl
      }},
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
    MongoClient.connect(url,function (err,db){
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

//图片上传
app.use('/public', express.static('public'));
var upload = multer({
  dest :path.join(__dirname,'public')
})
app.post('/upload',upload.single('file'),function(req,res){
  var file = req.file;
  console.log(file);
  var des_file = __dirname+'/public/'+file.originalname;
  fs.readFile(file.path,function(err,data) {
    fs.writeFile(des_file,data,function(err){
      if(err){
        res.send({
          status:500,
          message:'图片上传失败'
        })
      }
      file.status = 200;
      file.message = '上传成功'
      file.url = 'http://127.0.0.1:9999/public/'+file.originalname;
      res.send(file);
    })
  })
  
})
http.createServer(app).listen(9999,function(res) {
  console.log('服务启动成功');
});