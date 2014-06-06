var express = require('express');
var router = express.Router();
var User = require('../proxy').User;
var crypto = require('crypto');

/* 用户注册 */
router.get('/reg', function (req, res) {
    res.render('./user/reg', {
        title: '用户注册'
    });
});

router.post('/reg', function (req, res) {
    //检验用户两次输入的口令是否一致
    if (req.body['pass_repeat'] != req.body.pass) {
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/users/reg');
    }
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.pass).digest('base64');

    //检查用户名是否已经存在
    User.getUserByName(req.body.name, function (err, user) {
        if (!user) {
        } else {
            req.flash('error', '用户已存在');
            return res.redirect('/users/reg');
        }
        //如果不存在则新增用户
        User.newAndSave(req.body.name, req.body.loginname, password, req.body.email, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/users/reg');
            }
            req.session.user = user;
            req.flash('success', '恭喜您成为家庭成员');
            res.redirect('/');
        });
    });
});

/* 用户登入 */
router.get('/login', function (req, res) {
    res.render('./user/login', {
        title: '用户登入'
    });
});

router.post('/login', function (req, res) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var pass = md5.update(req.body.pass).digest('base64');
    User.getUserByLoginName(req.body.loginname, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在。');
            return res.redirect('/users/login');
        }
        if (user.pass != pass) {
            req.flash('error', '用户口令错误');
            return res.redirect('/users/login');
        }
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
    });
});

/* 用户退出 */
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '退出成功');
    res.redirect('/');
});

module.exports = router;
