/**
 * Created by Administrator on 14-1-23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name : { type: String},
    loginname : { type: String},
    pass : { type: String},
    email : { type: String},
    active: { type: Boolean, default: true },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
},{collection : 'users'});

UserSchema.index({name: 1});
UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User',UserSchema);
