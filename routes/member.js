/**
 * Created by SnipeV5 on 14-5-26.
 */
var express = require('express');
var router = express.Router();
var Member = require('../proxy').Member;
var moment = require('moment');
var EventProxy = require('eventproxy');
var settings = require('../settings');

/**
 * 成员信息主页
 */
router.get('/index', function (req, res, next) {
    var current_page = parseInt(req.query.current_page, 10) || 1;
    var limit = settings.number_of_pages;

    var proxy = EventProxy.create('members','page',
        function (members, page) {
            res.render('./member/member_index', {
                members: members,
                page: page// 总记录数
            });
        });
    proxy.fail(next);

    // 取成员 col为查询出的字段
    var col = {_id:1,name:1,title:1,birthday:1,stature:1,weight:1,circumference:1,
        waistline:1,shoeSize:1,comments:1,create_at:1};
    var options = {skip: (current_page - 1) * limit, limit: limit, sort: '-create_at',col:col};

    Member.getMembersByQuery({}, options, proxy.done('members', function (members) {
        //日期格式化 有空再看看如何查询数据库的时候进行格式化，省掉循环
        for(var i=0; i<members.length;i++){
            var member = members[i];
            member.create_at_str = new moment(members[i].create_at).format('YYYY/MM/DD');
        }
        return members;
    }));

    // 取分页数据
    Member.getCountByQuery({}, proxy.done(function (all_members_count) {
        var total_pages = Math.ceil(all_members_count / limit);
        var page = {};
        page.current_page = current_page;
        page.number_of_pages = limit;
        page.total_pages = total_pages;

        proxy.emit('page', page);
    }));
});

/**
 * 跳转到成员修改页面
 */
router.get('/modify_page', function (req, res, next) {
    var current_page = parseInt(req.query.current_page, 10) || 1;
    var limit = settings.number_of_pages;

    var proxy = EventProxy.create('members','page','member',
        function (members, page,member) {
            res.render('./member/member_index', {
                members: members,
                page: page,// 总记录数
                member:member
            });
        });
    proxy.fail(next);

    // 取成员 col为查询出的字段
    var col = {_id:1,name:1,title:1,birthday:1,stature:1,weight:1,circumference:1,
        waistline:1,shoeSize:1,comments:1,create_at:1};
    var options = {skip: (current_page - 1) * limit, limit: limit, sort: '-create_at',col:col};

    Member.getMembersByQuery({}, options, proxy.done('members', function (members) {
        //日期格式化 有空再看看如何查询数据库的时候进行格式化，省掉循环
        for(var i=0; i<members.length;i++){
            var member = members[i];
            member.create_at_str = new moment(members[i].create_at).format('YYYY/MM/DD');
        }
        return members;
    }));

    // 取分页数据
    Member.getCountByQuery({}, proxy.done(function (all_members_count) {
        var total_pages = Math.ceil(all_members_count / limit);
        var page = {};
        page.current_page = current_page;
        page.number_of_pages = limit;
        page.total_pages = total_pages;

        proxy.emit('page', page);
    }));

    //根据_id获取成员信息
    Member.getMemberById(req.query._id, proxy.done(function (member) {
        proxy.emit('member', member);
    }));

});

/**
 * 添加成员
 */
router.post('/add',function(req, res){
    //成员可以重复添加
    Member.newAndSave(req.body.name, req.body.title, req.body.birthday,req.body.stature ,
        req.body.weight,req.body.circumference,req.body.waistline,req.body.shoeSize,
        req.body.comments,req.session.user.name, function (err, member) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/member/list');
        }
        req.flash('success', '成员加入成功');
        res.redirect('/member/index');
    });

});

/**
 * 成员信息列表--index方法代替

router.get('/list', function (req, res) {
    //查询当前用户下的成员信息
    Member.getMembersByQuery({"create_un": req.session.user.name}, {}, function (err, members) {
        if (err) {
            return next(err);
        }
        //日期格式化
        for(var i=0; i<members.length;i++){
            var member = members[i];
            member.create_at_str = new moment(members[i].create_at).format('YYYY/MM/DD');
        }
        res.render('./member/member', {
            members: members
        });
    });
});*/

module.exports = router;