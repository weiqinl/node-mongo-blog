# Using a OS
# FROM ubuntu

# MAINTAINER weiqinl <https://github.com/weiqinl>
# 从DockerHub拉取一个Node.js的官方Docker镜像,作为我们环境的基础镜像
FROM node:4.2.2
MAINTAINER weiqinl <https://github.com/weiqinl>
#创建一个位于弄起内部的代码运行文件夹，并将代码复制进去，且通过npm来安装依赖包
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --registry=https://registry.npm.taobao.org 
COPY . /usr/src/app

# 端口暴露
EXPOSE 80

# ENTRYPOINT指令，让Node.js程序作为该Docker镜像的主运行入口，并将其运行起来。
ENTRYPOINT ["node", "bin/www"]

