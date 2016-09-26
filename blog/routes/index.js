var express = require('express');
var router = express.Router();

var crypto = require('crypto');// 用它来生成散列值来加密密码
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '这是主页' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login', { title: '登录'});
});

/* POST 登录 login */
router.post('/login', function(req, res, next) {
	res.render('index', { title: '主页' });
});

/* GET 注册页面 */
router.get('/reg', function(req, res, next) {
	res.render('reg', { title: '注册'});
});

/* POST 注册页面 */
router.post('/reg', function(req, res, next) {
	
	var name = req.body.name;
	var password = req.body.password;
	var password_re = req.body['password-repeat'];
	//检验用户两次输入的密码是否一致
	if (password_re != password) {
		// req.flash('error', '两次输入的密码不一致！');
		return res.redirect('/reg');//重定向功能。返回注册页
	}
	//生成密码的md5值
	var md5 = crypto.createHash('md5');
	var newPassword = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: name,
		password: newPassword,
		email: req.body.email,
		time: new Date()
	});
	//检查用户名是否已经存在
	User.get(newUser.name, function(err, user) {
		if(err) {
			// req.flash('error', err);
			return res.redirect('/');
		}
		if (user) {
			// req.flash('error', '用户名已经存在!');
			return res.redirect('/reg');//返回注册页面;
		}
		//如果不存在则新增用户
		newUser.save(function(err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');//注册失败返回注册页面
			}
			// 我们把用户信息存储在了 session 里，以后就可以通过 req.session.user 读取用户信息
			// req.session.user = newUser;//用户信息存入session
			// req.flash('success', '注册成功!');
			res.redirect('/'); //注册成功后返回主页
		});
	});		
});

/* GET 发表页面,获取所有的文章列表 */
router.get('/post', function(req, res, next) {
	res.render('postlist', { title: '发表的文章' });
});

/* POST 发表页面 */
router.post('/post', function(req, res, next) {
	res.render('post', { title: '发表' });
});

/* GET 登出 */
router.get('/logout', function(req, res, next) {
	res.render('index', { title: '主页' });
});

/* post 登出 */
router.post('/logout', function(req, res, next) {
	res.render('index', { title: '主页' });
});

module.exports = router;
