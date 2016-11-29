var mongodb = require('./db');

//定义一个实体模型
function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}

//导出实例，用于require()加载
module.exports = Post;

//存储一篇文章及相关信息
Post.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
	var time = {
		date: date,
		year: date.getFullYear(),
		 month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};
	//要存入数据库的文档
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	};
	//打开数据库
	mongodb.open(function (err, db) {
		if(err)	{
			return callback(err);
		}
		//读取posts集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//将文档插入posts集合
			collection.insert(post, {
				safe: true
			}, function (err, post) {			
				mongodb.close();
				callback(null);				
			});
		});
	});
};

//读取文章，及其相关信息
Post.get = function (name, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取posts集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			console.log(query);
			//根据query 对象查询文章
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);//失败！返回null
				}
				callback(null, docs);//成功！以数组形式返回查询的结果
			});
		});
	});
};