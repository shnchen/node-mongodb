var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var fs = require('fs');
var multer = require('multer');


//图片上传
app.use(path.join(__dirname,'../public'), express.static('public'));
var upload = multer({
  dest :path.join(__dirname,'../public')
})
router.post('/',upload.single('file'),function(req,res){
  var file = req.file;
  var des_file = path.join(__dirname,'../public/')+file.originalname;
  fs.readFile(file.path,function(err,data) {
    fs.writeFile(des_file,data,function(err){
      if(err){
        res.send({
          status:500,
          message:'图片上传失败'
        })
      }else{
        file.status = 200;
        file.message = '上传成功'
        file.url = 'http://127.0.0.1:9999/public/'+file.originalname;
        res.send(file);
      }
    })
  })
})

module.exports = router;