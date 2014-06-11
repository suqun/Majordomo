/**
 * Created by Larry on 14-6-12.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SysCodeSchema = new Schema({
    code_type_no : { type: String },              //代码类型编码
    code_order : { type: String },                //代码序号
    code_no : { type: String },                   //代码编码
    code_value : { type: String },                //代码值
    code_notes : { type: Number, default: 0 },    //代码说明
    active: { type: Boolean, default: true }      //是否有效

},{collection : 'sys_code'});

SysCodeSchema.index({code_type_no: 1});

mongoose.model('SysCode',SysCodeSchema);