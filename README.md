# node-mongo-blog
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