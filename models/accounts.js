/**
 * Created by qun.su on 2014-6-8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var AccountsSchema = new Schema({
    kind : { type: String },                     //类型
    type : { type: String },                     //账目分类
    cash : { type: String },                     //金额（元）
    account : { type: Number, default: 0 },      //资金账户
    remark : { type: String},                    //备注
    user_id : { type: ObjectId },                //添加人
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }     //是否有效
},{collection : 'accounts'});

AccountsSchema.index({create_at: 1});

mongoose.model('Accounts',AccountsSchema);



