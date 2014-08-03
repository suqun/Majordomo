/**
 * Created by Larry on 14-8-3.
 */
var models = require('../models');
var Post = models.Post;

/**
 * 根据关键词，获取post
 * Callback:
 * - err, 数据库错误
 * - count, 博客列表
 * @param {String} qry 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getPostsByQuery = function (qry, callback) {
    var query = Post.find(qry);

    query.exec(function (err, accounts) {
        if (err) {
            return callback(err);
        }
        return callback(null, accounts);
    });
};

/**
 * 添加博客
 * Callback:
 * - err, 数据库异常
 * - accounts, 账单
 * @param {String} head
 * @param {String} title
 * @param {String} tags
 * @param {String} post
 * @param {String} name
 * @param {Function} callback
 */
exports.newAndSave = function (head, title, tags, post, name, callback) {
    var posts = new Post();
    posts.head = head;
    posts.title = title;
    posts.tags = tags;
    posts.post = post;
    posts.name = name;
    posts.active = true;
    posts.save(callback);
};