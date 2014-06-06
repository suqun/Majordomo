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
/*
function User(user){
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
};
module.exports = User;

User.prototype.save = function save(callback){
    // 存入Mongodb 的文档
    var user = {
        email : this.email,
        name : this.name,
        password : this.password
    };

    var newUser = new userModel(user);

    newUser.save(function (err,user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

User.get = function get (username,callback){
     var user = {
        email : this.email,
        name : this.name,
        password : this.password
    };
 
    userModel.findOne({name:username},function(err,user){
        if(user){
            callback(null,user);
        } else {
            return callback(err);
        }
    });
     
}
    */