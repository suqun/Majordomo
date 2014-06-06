/**
 * Created by Administrator on 14-5-26.
 */
var settings = require('../settings');
var mongoose = require('mongoose');

mongoose.connect(settings.uri, function (err) {
    if (err) {
        console.error('connect to %s error: ', settings.db, err.message);
        process.exit(1);
    }
});

// models
require('./user');
require('./member');

exports.User = mongoose.model('User');
exports.Member = mongoose.model('Member');
