var express = require('express');
var router = express.Router();

/* GET home page. */ 
router.get('/', function(req, res) {
  res.render('index', {
    title: '首页'
  });
});

/**
 * 测试用
 */
router.get('/test',function(req, res){
    //成员可以重复添加
    res.render('test', {
        titles: "测试"
    });

});

module.exports = router;
