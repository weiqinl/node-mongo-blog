## 下载本案例，并运行顺序  
0：下载地址：https://github.com/weiqinl/node-mongo-blog  
1：在根目录（/blog/）创建文件credentials.js，在里面输入

	module.exports = {
		cookieSecret: '你的密钥信息'
	}  

2: 执行依赖包安装命令：npm install  
3：执行启动程序命令：supervisor bin/www  
4: 在浏览器中运行：http://localhost:3000/  



# node-mongo-blog 简介
使用express  (Express 基于Node.js 平台,快速、开放、极简的 web 开发框架),mongodb开发的博客

## 初始化项目
`npm install -g express-generator` 初始化一个express项目  

`express blog` 创建一个命名为blog的应用（默认模版引擎jade【已经改名为pug，但是有些坑没填好，所以还是用jade】）。


## supervisor 
注意：每次我们更新代码后，都需要手动停止并重启应用，使用 supervisor 模块可以解决这个问题，每当我们保存修改的文件时，supervisor 都会自动帮我们重启应用。通过：

$ npm install -g supervisor
安装 supervisor 。使用 supervisor 命令启动 app.js：

本案例，启动的项目是bin/www
$ supervisor bin/www



## 项目工程结构介绍
app.js：启动文件，或者说入口文件  
package.json：存储着工程的信息及模块依赖，当在 dependencies 中添加依赖的模块时，运行 npm install，npm   会检查当前目录下的 package.json，并自动安装所有指定的模块  
node_modules：存放 package.json 中安装的模块，当你在 package.json 添加依赖的模块并安装后，存放在这个文件夹下  
public：存放 image、css、js 等文件  
routes：存放路由文件  
views：存放视图文件或者说模版文件  
bin：存放可执行文件  


## 参考案例：  
1：http://nodejs.cn/doc/node/   
2：http://www.expressjs.com.cn/  
3：https://github.com/nswbmw/N-blog.git  

## 本案例地址
https://github.com/weiqinl/node-mongo-blog  
git@github.com:weiqinl/node-mongo-blog.git