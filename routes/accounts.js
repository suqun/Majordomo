/**
 * Created by Larry on 14-5-26.
 */
var express = require('express');
var router = express.Router();
var Accounts = require('../proxy').Accounts;
var SysCode = require('../proxy').SysCode;
var EventProxy = require('eventproxy');
var settings = require('../settings');

/**
 * 账本首页
 */
router.get('/index', function (req, res, next) {
    Accounts.getAccountSumByMonth(function (err,docs) {
        if (err) {
            return next(err);
        }
        var payoutTotal = 0;
        var incomeTotal = 0;
        for(var i = 0 ; i < docs.length ; i++){
            if(docs[i]._id === "payout") {
                payoutTotal = docs[i].total.toFixed(2);
            }
            if(docs[i]._id === "income") {
                incomeTotal = docs[i].total.toFixed(2);
            }
        }
        res.render('./accounts/accounts_index', {
            user : req.session.user,
            payoutTotal : payoutTotal,
            incomeTotal : incomeTotal
        });
    });
});


/**
 * 记账
 */
router.post('/add',function(req, res){
    Accounts.newAndSave(req.body.date,req.body.kind,req.body.kind_value, req.body.type,req.body.type_value, req.body.cash,req.body.account ,
        req.body.account_value,req.body.remark,req.session.user._id, function (err, accounts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/accounts/detail');
            }
            req.flash('success', '记账成功');
            res.redirect('/accounts/detail');
        });

});

/**
 * 账本明细查询
 */
router.get('/detail', function (req, res, next) {
    var current_page = parseInt(req.query.current_page, 10) || 1;
    var limit = settings.number_of_pages;

    var proxy = EventProxy.create('accounts','page',
        function (accounts, page) {
            res.render('./accounts/accounts_detail', {
                accounts: accounts,
                page: page// 总记录数
            });
        });
    proxy.fail(next);

    // 取成员 col为查询出的字段
    var col = {_id:1,date:1,kind:1,type:1,cash:1,account:1,remark:1};
    var options = {skip: (current_page - 1) * limit, limit: limit, sort: '-date',col:col};

    Accounts.getAccountsByQuery({}, options, proxy.done('accounts', function (accounts) {

        return accounts;
    }));

    // 取分页数据
    Accounts.getCountByQuery({}, proxy.done(function (all_accounts_count) {
        var total_pages = Math.ceil(all_accounts_count / limit);
        var page = {};
        page.current_page = current_page;
        page.number_of_pages = limit;
        page.total_pages = total_pages;

        proxy.emit('page', page);
    }));
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
 * 跳转到成员修改页面
 */
router.get('/getAccountById', function (req, res, next) {
    Accounts.getAccountById(req.query._id, function (err,account) {
        if (err) {
            return next(err);
        }
        res.send({account : account});
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
 * 月度统计
 */
router.get('/monthly', function (req, res, next) {
    res.render('./accounts/accounts_monthly', {
        user:req.session.user
    });
});

/**
 * 记账
 */
router.get('/add', function (req, res, next) {
    res.render('./accounts/accounts_add', {
        user:req.session.user
    });
});

/**
 * 获取SysCode
 */
router.get('/getSysCode', function (req, res, next) {
    var qry = {code_type_no:req.query.codeTypeNo};
    SysCode.getCodesByQuery(qry,function(err,codes){
        if (err) {
            return next(err);
        }
        res.send({codes : codes});
    })
});

module.exports = router;