var settings = require('./settings');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var member = require('./routes/member');
var accounts = require('./routes/accounts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(flash());
app.use(session({
    secret: settings.cookie_secret,
    store: new MongoStore({
        db: settings.db
    })
}));

app.use(function (req, res, next) {
    //console.log("访问地址："+req.originalUrl);
    var url = req.originalUrl;

    //简单地定义一个登录拦截器,正则表达式拦截路径/memmber/,/accounts/,/health/,/plan/,/diary/
    var regexp = new RegExp("\/member\/|\/accounts\/|\/health\/|\/plan\/|\/diary\/", "g");
    if (regexp.test(url) && !req.session.user) {
        console.log("尚未登录");
        return res.redirect("/users/login");
        //return res.send(403, 'forbidden!');
    }

    res.locals.user = req.session.user;
    res.locals.url = url;

    var error = req.flash('error');
    var success = req.flash('success');
    res.locals.error = error.length ? error : null;
    res.locals.success = success.length ? success : null;

    res.locals.session = req.session;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

//路由
app.use('/', index);
app.use('/users', users);
app.use('/member', member);
app.use('/accounts', accounts);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
