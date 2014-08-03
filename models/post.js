/**
 * Created by qun.su on 2014-8-3.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
    head : {type: String},
    title : {type: String},
    tags : {type: String},
    post : {type: String},
    name : { type: String },//添加人
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }//是否有效
},{collection : 'posts'});

PostSchema.index({create_at: 1});

mongoose.model('Post',PostSchema);



