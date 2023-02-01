const MongoClient = require('mongodb').MongoClient;
const dbUrl = require('./setting.js').dbUrl;
const ObjectId = require('mongodb').ObjectId;
const _connectDB = (callback)=>{

  MongoClient.connect(dbUrl,(err,db)=>{
    if(err){
      throw err;
    }
    callback(err,db)
  })
}

exports.find = (database,collectionName,query,callback)=>{
  let {pageSize,pageNum,sortBy} = query;
  sortBy = sortBy?JSON.parse(sortBy):{}
  let total;
  const offset = +pageSize*(+pageNum-1)||0;
  _connectDB((err,db)=>{
    if(err){
      callback({
        status:500,
        message:'service error',
        data:err
      })
    }
    const dbase = db.db(database);
    dbase.collection(collectionName).count(function (err,num) {
      if(err){
        callback({
          status:500,
          message:'service error',
          data:err
        })
      }
      total = num;
    })
    dbase.collection(collectionName).find().skip(+offset).limit(+pageSize || 0).sort(sortBy).toArray((err,data)=>{
      if(err){
        callback({
          status:500,
          message:'service error',
          data:err
        })
        db.close();
        return
      }
      callback({
        status:200,
        data:{
          list:data,
          total
        },
        message:'请求成功'
      })
      db.close();
    });
  })
}

exports.findOne = (database,collectionName,query,callback)=>{
  _connectDB((err,db)=>{
    if(err){
      callback({
        status:500,
        message:'service error',
        data:err
      })
    };
    const dbase = db.db(database);
    if(query._id){
      query._id= ObjectId(query._id)
    }
    dbase.collection(collectionName).findOne(query,(err,res)=>{
      const data = err?{
        status:500,
        message:'service error',
        data:err
      }:{
        status:200,
        data:res,
        message:'请求成功！'
      }
      callback(data);
      db.close();
    })
  })
}

exports.addOne = (database,collectionName,body,callback) =>{
  _connectDB((err,db)=>{
    if(err){
      callback({
        status:500,
        message:'service error',
        data:err
      })
    }
    const dbase = db.db(database);
    dbase.collection(collectionName).insertOne(body,((err,res)=>{
       const data = err?{
        status:500,
        message:'service error',
        data:err
       }:{
        status:200,
        message:'添加成功',
        data:res
       }
       callback(data);
       db.close();
    }))
  })
}

exports.updateOne = (database,collectionName,body,callback)=>{
  _connectDB((err,db)=>{
    if(err){
      callback({
        status:500,
        message:'service error',
        data:err
      })
    }
    const dbase = db.db(database);
    let obj={}
    for(let key in body){
      if(key!=='_id'){
        obj[key]=body[key]
      }
    }
    dbase.collection(collectionName).updateOne({_id:ObjectId(body._id)},{$set:obj},(err,res)=>{
      let data = err?{
        status:500,
        data:err,
        message:'service error'
      }:{
        status:200,
        data:res,
        message:'更新成功！'
      }
      callback(data);
      db.close();
    })
  })
}

exports.deleteOne = (database,collectionName,id,callback)=>{
  _connectDB((err,db)=>{
    if(err){
      callback({
        status:500,
        data:err,
        message:'service err'
      })
    }
    const dbase = db.db(database);
    dbase.collection(collectionName).deleteOne({_id:ObjectId(id)},(err,res)=>{
      const data = err?{
        status:500,
        data:err,
        message:'service error'
      }:{
        status:200,
        data:res,
        message:'删除成功！'
      }
      callback(data);
      db.close();
    })
  })
}