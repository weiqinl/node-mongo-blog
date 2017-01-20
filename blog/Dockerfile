# Using a OS
# FROM ubuntu

# MAINTAINER weiqinl <https://github.com/weiqinl>
# 从DockerHub拉取一个Node.js的官方Docker镜像,作为我们环境的基础镜像
FROM node:4.2.2

#创建一个位于弄起内部的代码运行文件夹，并将代码复制进去，且通过npm来安装依赖包
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install 
COPY . /usr/src/app

