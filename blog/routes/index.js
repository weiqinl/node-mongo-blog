var express = require('express');
var router = express.Router();

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
	res.render('index', { title: '主页'});
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
