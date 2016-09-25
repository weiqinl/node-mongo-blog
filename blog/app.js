var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
//导入配置文件
var settings = require('./settings');
//支持会话信息
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//flash 是一个在 session 中用于存储信息的特定区域
var flash = require('connect-flash');

//生成一个express实例app
var app = express();

//设置views文件夹为存放视图文件的目录，即存放模版文件的地方
//__dirname为全局变量，存储当前正在执行的脚本所在的目录。
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置视图模版引擎为jade
app.set('view engine', 'jade');
//信息写入flash，下次显示完毕后即被清除
// app.use(flash());
app.use(express.session());

// uncomment after placing your favicon in /public
// 设置/public/favicon.ico为favicon图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
//加载解析urlencoded请求体中的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
// 设置public文件夹为存放静态文件的目录.
app.use(express.static(path.join(__dirname, 'public')));

//路由控制器
app.use('/', routes);
app.use('/users', users);

//捕获404错误，并转发到错误处理器.
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//错误处理器
// error handlers

//开发环境下的错误处理器，
// 将错误信息渲染到error模版并显示到浏览器中（打印堆栈信息）.
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//生产环境下的错误处理器
//将错误信息渲染到error模版并显示到浏览器中（不打印堆栈信息）
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(session({
  resave:false,//resave ——重新保存：强制会话保存即使是未修改的，默认为true
  saveUninitialized: true,//强制保存未初始化的会话到存储器  
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.prot
  })
}));


//导出app实例供其他模块调用。
module.exports = app;
