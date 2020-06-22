# 小卖部管理系统
这是一个做小卖部后台的管理系统
基于 vue + element-ui 做的项目

## 最先开始要安装各种插件
如 sass 需要安装 node-sass sass-loader
element-ui 需要安装 vue-cli-plugin-element


## 运行步骤，
1. 首先电脑需要有 node.js 及 mysql，没有则需要安装 node.js 
	- 网址：[http://nodejs.cn/](http://nodejs.cn/ "node官网")
  		+ 傻瓜式一键安装即可
	- mysql 自行安装
2. 接着需要导入 .sql 文件到 你的MySQL中
	- .sql文件在 store_server/db 目录下
	- 可以根据电脑 mysql 的账号密码自行修改配置
    	+ 文件在 store_server/untils/dbConfig.js， 修改其中的 数据配置即可
3. 接着需要在 根目录 下运行命令 `node ./app.js` 运行网站
  - 然后根据提示，在浏览器中输入 [http:127.0.0.1:19999](http:127.0.0.1:19999)网址
4. 接着，进入 store_server 目录，输入命令 `node ./app.js` 开启后台功能
5. 接下来就可以随心所欲了
> 注意：如果是用 cmd 运行的命令，不要关闭cmd。