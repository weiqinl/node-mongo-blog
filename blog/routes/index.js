var express = require('express');
var router = express.Router();
var debug = require('debug')('router');
var util = require('util');


var crypto = require('crypto');// 用它来生成散列值来加密密码
var User = require('../models/user.js');
var Post = require('../models/post.js');

// router.helpers({
// 	inspect:function (obj) {
// 		return util.inspect(obj, true);
// 	}
// });

// router.dynamicHelpers({
// 	headers: function (req, res) {
// 		return req.headers;
// 	}
// });

router.get('/helper', function (req, res) {
	res.render('helper', {
		title: 'Helpers'
	});
});

/* GET home page. */
router.get('/', function(req, res) {
	debug('Hello, %s', 'world! DEBUG ');//测试DEBUG模块
	Post.get(null, function (err, posts) {
		if (err) {
			posts = [];
		}
		res.render('index', {
				title: '这是主页',
		  	user: req.session.user,
		  	posts: posts,
		  	success: req.flash('success').toString(),
		  	error: req.flash('error').toString()
		  });
	});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login', {
		title: '登录',
		user: req.session.user,
		success:  req.flash('success').toString(),
		error: req.flash('error').toString()
		});
});
router.post('/login', checkNotLogin);
function checkLogin(req, res, next) {
	if(!req.session.user) {
		req.session.flash = {
			type: 'error',//错误类型
			intro: 'login error', //简介
			message: '未登录!',
		};
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if(req.session.user) {
		req.session.flash = {
			type: 'error',//错误类型
			intro: 'login error', //简介
			message: '已经登录！',
		};
		res.redirect('back');//返回之前的页面
	}
	next();
}



/* POST 登录 login */
router.post('/login', function(req, res, next) {
	//生成密码的md5值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	//检查用户是否存在
	User.get(req.body.name, function(err, user) {
		if (!user) {
			req.session.flash = {
				message: '用户不存在!'
			};
			return res.redirect('/login');//用户不存在则跳转到登录页面
		}		
		//检查密码是否一致
		if (user.password != password) {
			req.session.flash = {
				type: 'error',//错误类型
				intro: 'input error', //简介
				message: '输入的密码错误！123',
			};
			return res.redirect('/login');//密码错误则跳转到登录页
		}
		//用户名和密码都匹配后，将信息存入 session
		req.session.user = user;
		req.session.flash = {message: '登录成功!'};
		res.redirect('/');//登录成功后跳转到主页
	}); 
});


/**
 * 先检查是否登录,还没有验证功能
 */
router.get('/reg', checkNotLogin);

/* GET 注册页面 */
router.get('/reg', function(req, res, next) {
	res.render('reg',{ 
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/reg', checkNotLogin);
/* POST 注册页面 */
router.post('/reg', function(req, res, next) {	
	var name = req.body.name;
	var password = req.body.password;
	var password_re = req.body['password-repeat'];
	//检验用户两次输入的密码是否一致
	if (password_re != password) {		
		req.session.flash = {
			type: 'error',//错误类型
			intro: 'input error', //简介
			message: '两次输入的密码不一致！123',
		};
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
			req.session.flash = {
				type: 'error',//错误类型
				intro: 'err', //简介
				message: '检查用户名是否已经存在失败',
			};
			return res.redirect('/');
		}
		if (user) {
			req.session.flash = {
				type: 'error',//错误类型
				intro: 'err repeat username', //简介
				message: '用户名已经存在',
			};
			return res.redirect('/reg');//返回注册页面;
		}
		//如果不存在则新增用户
		newUser.save(function(err, user) {
			if (err) {
				req.session.flash = {
					type: 'error',//错误类型
					intro: 'err', //简介
					message: '注册失败',
				};
				return res.redirect('/reg');//注册失败返回注册页面
			}
			// 我们把用户信息存储在了 session 里，以后就可以通过 req.session.user 读取用户信息
			req.session.user = newUser;//用户信息存入session
		
			req.session.flash = {
				type: 'success',//错误类型
				intro: 'register success', //简介
				message: '注册成功!',
			};
			res.redirect('/'); //注册成功后返回主页
		});
	});		
});



/* GET 发表页面,获取某用户发表的所有文章列表 */
router.get('/post/:user', function(req, res) {
	var currentUser = req.session.user;
	Post.get(currentUser.name, function(err, posts) {
		if (err) {
			posts = [];
		}	
		res.render('postlist', { 
			title: '发表的文章',
			user: req.session.user,
			posts: posts,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	})
});

/* GET 发表页面,获取所有的文章列表 */
router.get('/post', function(req, res) {
	var currentUser = req.session.user;
	debug('currentUser: ' + currentUser.name);
	res.render('post', { 
		title: '写文章',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString() 
	});
});

/* POST 发表页面 */
router.post('/post', function(req, res) {
	var currentUser = req.session.user;
	debug(currentUser.name);
	var post = new Post(currentUser.name, req.body.title, req.body.post);
	post.save(function (err) {
		if (err) {
			req.session.flash = {
				type: 'error',
				intro: 'post arts error',
				message: '发表文章失败!'
			};
			res.redirect('/post');//发表失败，停留在发表页面
		}
		req.session.flash = {
				type: 'success',
				intro: 'post arts success',
				message: '成功发表文章!'
		};
		res.redirect('/');	
	});
});

/* GET 登出 */
router.get('/logout', function(req, res, next) {
	
	req.session.user = null;
	req.session.flash = {
		type: 'success',//错误类型
		intro: 'register success', //简介
		message: "登出成功!"
	};
	res.redirect('/'); //登出后返回主页
});


module.exports = router;
