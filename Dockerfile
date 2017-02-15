# 从DockerHub拉取一个Node.js的官方Docker镜像,作为我们环境的基础镜像
FROM node

#介绍个人联系信息
MAINTAINER weiqinl <https://github.com/weiqinl>

#文档的最后更新时间，修改可以清除缓存
ENV REFRESHED_AT 2017-02-14

#创建一个文件夹，并将代码复制进去，且通过npm来安装依赖包
RUN mkdir -p /var/www/html/website

COPY . /var/www/html/website

WORKDIR /var/www/html/website/blog

RUN npm install --registry=https://registry.npm.taobao.org 


ADD nginx/global.conf /etc/nginx/conf.d/
ADD nginx/nginx.conf /etc/nginx/


# 端口暴露
EXPOSE 3000

# ENTRYPOINT指令，让Node.js程序作为该Docker镜像的主运行入口，并将其运行起来。
ENTRYPOINT ["supervisor", "bin/www"]

