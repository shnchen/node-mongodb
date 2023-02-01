const express = require('express');
const router = express.Router();
const {addOne,findOne} = require('../model/db')
const token = require('./token');


//新增用户
router.post('/registry',function(req,res) {
  addOne('test','site',req.body,(data)=>{res.send(data)})
})

//获取详情

router.get('/login',function(req,res){
  findOne('test','site',req.query,(data)=>{
    res.send({...data,token:token.createToken(req.query,7200)})
  })
})

module.exports = router;