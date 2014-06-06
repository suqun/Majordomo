/**
 * Created by SnipeV5 on 14-5-26.
 */
var models = require('../models');
var Member = models.Member;

/**
 * 根据关键词，获取成员列表
 * Callback:
 * - err, 数据库错误
 * - count, 成员列表
 * @param {String} qry 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getMembersByQuery = function (qry, opt, callback) {
    var query = Member.find(qry,opt.col).sort(opt.sort).skip(opt.skip).limit(opt.limit);

    query.exec(function(err, members) {
        if (err) {
            return callback(err);
        }
        return callback(null, members);
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
    Member.count(query, callback);
};

/**
 * 根据成员ID获取成员
 * Callback:
 * - err, 数据库错误
 * - member, 成员
 * @param {String} id 成员ID
 * @param {Function} callback 回调函数
 */
exports.getMemberById = function (id, callback) {
    Member.findOne({_id:id},function (err, member) {
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
exports.modifyMember = function (qry,set, callback) {
    Member.update(qry, set, [], function (err, member) {
        if (err) {
            return callback(err);
        }
        return callback(null, member);
    });
};

/**
 * 添加成员
 * Callback:
 * - err, 数据库异常
 * - member, 成员
 * @param {String} name
 * @param {String} title
 * @param {String} birthday
 * @param {String} comments
 * @param {String} create_un
 * @param {Date} create_at
 * @param {Function} callback
 */
exports.newAndSave = function (name, title, birthday,stature,weight,circumference,waistline,shoeSize, comments, create_un, callback) {
    var member = new Member();
    member.name = name;
    member.title = title;
    member.birthday = birthday;
    member.stature = stature;
    member.weight = weight;
    member.circumference = circumference;
    member.waistline = waistline;
    member.shoeSize = shoeSize;
    member.comments = comments;
    member.create_un = create_un;
    member.save(callback);

};