/**
 * Created by qun.su on 2014-6-8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var AccountsSchema = new Schema({
    date : { type: String },//消费日期
    kind : {
        code_no:{type: String},
        code_value:{type: String}
    },                     //收支类型
    type : {
        code_no:{type: String},
        code_value:{type: String}
    },                     //账目分类
    cash : { type: Number, default: 0},//金额（元）
    account : {
        code_no:{type: String},
        code_value:{type: String}
    },                     //资金账户
    remark : { type: String},//备注
    user_id : { type: ObjectId },//添加人
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }//是否有效
},{collection : 'accounts'});

AccountsSchema.index({create_at: 1});

mongoose.model('Accounts',AccountsSchema);



