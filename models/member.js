/**
 * Created by qun.su on 2014-5-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MemberSchema = new Schema({
    name : { type: String },                     //姓名
    title : { type: String },                    //称谓
    birthday : { type: String },                 //生日
    stature : { type: Number, default: 0 },      //身高
    weight : { type: Number, default: 0 },       //体重
    circumference : { type: Number, default: 0 },//胸围
    waistline : { type: Number, default: 0 },    //腰围
    shoeSize : { type: Number, default: 0 },     //鞋码
    comments : { type: String },                 //简述，记录爱好口味性格等
    create_un : { type: String },                //添加人
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
},{collection : 'member'});

MemberSchema.index({name: 1});

mongoose.model('Member',MemberSchema);



