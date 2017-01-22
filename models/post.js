var mongodb = require('./db');

//定义一个实体模型
function Post(name, title, post, time) {
	this.name = name;
	this.title = title;
	this.post = post;

	// if (time) {
	// 	this.time = time;
	// } else {
	// 	this.time = new Date();
	// }
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
			// 为name属性添加索引
			collection.ensureIndex('name');
			//将文档插入posts集合
			collection.insert(post, {
				safe: true
			}, function (err, post) {			
				mongodb.close();
				callback(err, post);				
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
			// 查找name属性为name的文档，如果name是null则匹配全部
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
				// 封装posts为Post对象
				// var posts = [];
				// docs.forEach(function(doc, index) {
				// 	var post = new Post(doc.name, doc.post, doc.time, doc.title);
				// 	posts.push(post);
				// });
				// callback(null, posts);
				callback(null, docs);//成功！以数组形式返回查询的结果
			});
		});
	});
};