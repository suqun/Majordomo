/**
 * Created by SnipeV5 on 14-5-26.
 */
var models = require('../models');
var User = models.User;

/**
 * 根据用户名，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {Function} callback 回调函数
 */
exports.getUserByName = function (name, callback) {
    User.findOne({name: name}, callback);
};

/**
 * 根据登录名，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginname 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginname, callback) {
    User.findOne({loginname: loginname}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

/**
 * 添加用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name
 * @param {String} loginname
 * @param {String} pass
 * @param {String} email
 * @param {Function} callback
 */
exports.newAndSave = function (name, loginname, pass, email, callback) {
    var user = new User();
    user.name = name;
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.active = false;
    user.save(callback);
};