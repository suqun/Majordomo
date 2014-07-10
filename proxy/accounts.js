/**
 * Created by Larry on 14-6-10.
 */
var models = require('../models');
var Accounts = models.Accounts;

/**
 * 根据关键词，获取记账列表
 * Callback:
 * - err, 数据库错误
 * - count, 成员列表
 * @param {String} qry 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getAccountsByQuery = function (qry, opt, callback) {
    var query = Accounts.find(qry, opt.col).sort(opt.sort).skip(opt.skip).limit(opt.limit);

    query.exec(function (err, accounts) {
        if (err) {
            return callback(err);
        }
        return callback(null, accounts);
    });
};


/**
 * 获取关键词能搜索到的成员数量
 * Callback:
 * - err, 数据库错误
 * - count, 成员数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
    Accounts.count(query, callback);
};

/**
 * 根据成员ID获取一条记账信息
 * Callback:
 * - err, 数据库错误
 * - member, 成员
 * @param {String} id 记账ID
 * @param {Function} callback 回调函数
 */
exports.getAccountById = function (id, callback) {
    Accounts.findOne({_id: id}, function (err, member) {
        if (err) {
            return callback(err);
        }
        return callback(null, member);
    });
};

/**
 * 根据条件修改成员
 * Callback:
 * - err, 数据库错误
 * - member, 成员
 * @param {JSON} qry 查询条件
 * @param {JSON} set 查询条件
 * @param {Function} callback 回调函数
 */
exports.modifyMember = function (qry, set, callback) {
    Member.update(qry, set, [], function (err, member) {
        if (err) {
            return callback(err);
        }
        return callback(null, member);
    });
};

/**
 * 根据条件修改成员
 * Callback:
 * - err, 数据库错误
 * - member, 成员
 * @param {JSON} qry 查询条件
 * @param {Function} callback 回调函数
 */
exports.deleteAccounts = function (qry, callback) {
    Accounts.remove(qry, function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};

/**
 * 添加账单
 * Callback:
 * - err, 数据库异常
 * - accounts, 账单
 * @param {String} date
 * @param {String} kind
 * @param {String} kind_value
 * @param {String} type
 * @param {String} type_value
 * @param {Number} cash
 * @param {String} account
 * @param {String} account_value
 * @param {String} remark
 * @param {String} user_id
 * @param {Function} callback
 */
exports.newAndSave = function (date, kind, kind_value, type, type_value, cash, account, account_value, remark, user_id, callback) {
    var accounts = new Accounts();
    accounts.date = date;
    accounts.kind.code_no = kind;
    accounts.kind.code_value = kind_value;
    accounts.type.code_no = type;
    accounts.type.code_value = type_value;
    accounts.cash = cash;
    accounts.account.code_no = account;
    accounts.account.code_value = account_value;
    accounts.remark = remark;
    accounts.user_id = user_id;
    accounts.active = true;
    accounts.save(callback);

};