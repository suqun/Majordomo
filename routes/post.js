/**
 * Created by Larry on 2014/8/3.
 */
var express = require('express');
var router = express.Router();
var Post = require('../proxy').Post;
var moment = require('moment');
var markdown = require('markdown').markdown;

/**
 * 博客首页
 */
router.get('/index', function (req, res, next) {
    //var qry = {user_id:mongoose.Types.ObjectId(req.session.user._id)};
    var qry = {};
    Post.getPostsByQuery(qry,function(err,posts){
        if (err) {
            return next(err);
        }
        posts.forEach(function(p){
            p.post = markdown.toHTML(p.post);
            p.create_at_str = new moment(p.create_at).format('YYYY-MM-DD HH:mm:ss');
        });
        res.render('./post/home', {
            posts : posts
        });
    });
});


/**
 * 添加博客
 */
router.post('/add',function(req, res){
    Post.newAndSave(req.body.head,req.body.title,req.body.tags, req.body.post,req.session.user.loginname, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/post/post');
            }
            res.redirect('/post/index');
        });

});

/**
 * 记账明细删除
 */
router.get('/deleteAccounts',function(req, res){
    //根据_id获取成员信息
    var query = { _id: req.query._id };

    Accounts.deleteAccounts(query,function(err){
        if (err) {
            req.flash('error', err);
            return res.redirect('/member/index');
        }
        req.flash('success', '记账删除成功');
        res.redirect('/accounts/detail');
    });
});


/**
 * 记账修改
 */
router.post('/modify',function(req, res){
    //根据_id获取成员信息
    var query = { _id: req.body._id };

    var set = {
        date: req.body.date,
        kind: {
            code_no: req.body.kind,
            code_value: req.body.kind_value
        },
        type: {
            code_no: req.body.type,
            code_value: req.body.type_value
        },
        cash: req.body.cash,
        account: {
            code_no: req.body.account,
            code_value: req.body.account_value
        },
        remark: req.body.remark,
        update_at: new Date()
    };

    Accounts.modifyAccount(query,set,function(err,account){
        if (err) {
            req.flash('error', err);
            return res.redirect('/accounts/detail');
        }
        req.flash('success', '记账修改成功');
        res.redirect('/accounts/detail');
    });
});

/**
 * 添加博客页面
 */
router.get('/add', function (req, res, next) {
    res.render('./post/post', {
        user:req.session.user
    });
});

module.exports = router;