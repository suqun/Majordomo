/**
 * Created by Larry on 14-6-12.
 */
var models = require('../models');
var SysCode = models.SysCode;

/**
 * 根据代码类型编码获取编码
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} qry 代码类型编码
 * @param {Function} callback 回调函数
 */
exports.getCodesByTypeNo = function (qry, callback) {
    SysCode.find({code_type_no: qry}, callback);
};
