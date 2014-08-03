/**
 * Created by Larry on 14-5-26.
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

    var qry = {create_un:req.session.user.name};
    Member.getMembersByQuery(qry, options, proxy.done('members', function (members) {
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
 * 添加成员
 */
router.post('/add',function(req, res){
    //成员可以重复添加
    Member.newAndSave(req.body.name, req.body.title, req.body.birthday,req.body.stature ,
        req.body.weight,req.body.circumference,req.body.waistline,req.body.shoeSize,
        req.body.comments,req.session.user.name, function (err, member) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/member/index');
            }
            req.flash('success', '成员加入成功');
            res.redirect('/member/index');
        });

});

/**
 * 跳转到成员修改页面
 */
router.get('/modifyPage', function (req, res, next) {
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

    var qry = {create_un:req.session.user.name};

    Member.getMembersByQuery(qry, options, proxy.done('members', function (members) {
        //日期格式化 有空再看看如何查询数据库的时候进行格式化，省掉循环
        members.forEach(function(member){
            member.create_at_str = new moment(members[i].create_at).format('YYYY/MM/DD');
        });
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
 * 成员修改
 */
router.post('/modify',function(req, res){
    //根据_id获取成员信息
    var query = { _id: req.body._id };
    var set = {
        name:req.body.name,
        title:req.body.title,
        birthday:req.body.birthday,
        stature:req.body.stature,
        weight:req.body.weight,
        circumference:req.body.circumference,
        waistline:req.body.waistline,
        shoeSize:req.body.shoeSize,
        comments:req.body.comments
    };

    Member.modifyMember(query,set,function(err,member){
        if (err) {
            req.flash('error', err);
            return res.redirect('/member/index');
        }
        req.flash('success', '成员修改成功');
        res.redirect('/member/index');
    });
});

/**
 * 成员删除
 */
router.get('/deleteMember',function(req, res){
    //根据_id获取成员信息
    var query = { _id: req.query._id };

    Member.deleteMember(query,function(err){
        if (err) {
            req.flash('error', err);
            return res.redirect('/member/index');
        }
        req.flash('success', '成员删除成功');
        res.redirect('/member/index');
    });
});


module.exports = router;