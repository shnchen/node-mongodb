const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';
const router = express.Router();
const token = require('./token');
const {findOne} = require('../model/db')
//新建首页配置

router.post('/update',function(req,res){
 new Promise(function(resolve,reject){
   MongoClient.connect(url,function(err,db){
     if(err){
       throw err;
     }
     const dbase = db.db('test');
     dbase.collection('home').insertOne(req.body,function(err,ret){
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
   console.log(data);
   res.send({
     status:200,
     message:'添加成功'
   })
 })
})
router.put('/update',function(req,res) {
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db){
      if(err){
        throw err;
      }
      const dbase = db.db('test');
      dbase.collection('home').updateOne({_id:require('mongodb').ObjectId('61ea3c69e708af60c4eaf0d4')},
      {$set:req.body},
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

router.get('/detail',function(req,res){
  console.log(token.decodeToken(req.headers.authorization));
  if(!token.checkToken(req.headers.authorization)){
    res.send({
      status:403,
      message:'登录过期！请重新登录！'
    })
    return;
  }
  findOne('test','home',{_id:'61ea3c69e708af60c4eaf0d4'},(data)=>{res.send(data)})
})
router.head('/get-head',function(req,res){
  new Promise(function(resolve,reject){
    MongoClient.connect(url,function(err,db){
      if(err){
        throw err
      }
      const dbase = db.db('test');
      dbase.collection('home').findOne({_id:require('mongodb').ObjectId('61ea3c69e708af60c4eaf0d1')},function(err,ret){
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
      status:200
    })
  })
})
module.exports = router;
