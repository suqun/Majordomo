/**
 * Created by Larry on 14-5-26.
 */
var express = require('express');
var router = express.Router();
var Accounts = require('../proxy').Accounts;
var moment = require('moment');
var EventProxy = require('eventproxy');
var settings = require('../settings');

/**
 * 账本首页
 */
router.get('/index', function (req, res, next) {
    res.render('./accounts/accounts_index', {
        user:req.session.user
    });
});

/**
 * 记账页面
 */
router.get('/keep', function (req, res, next) {
    res.render('./accounts/accounts_keep', {
        user:req.session.user
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
    var col = {_id:1,create_at:1,kind:1,type:1,cash:1,account:1,remark:1};
    var options = {skip: (current_page - 1) * limit, limit: limit, sort: '-create_at',col:col};

    Accounts.getAccountsByQuery({}, options, proxy.done('accounts', function (accounts) {
        //日期格式化 有空再看看如何查询数据库的时候进行格式化，省掉循环
        for(var i=0; i<accounts.length;i++){
            var account = accounts[i];
            account.create_at_str = new moment(accounts[i].create_at).format('YYYY/MM/DD');
        }
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
 * 月度统计
 */
router.get('/monthly', function (req, res, next) {
    res.render('./accounts/accounts_monthly', {
        user:req.session.user
    });
});

module.exports = router;