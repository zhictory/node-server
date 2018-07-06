# 用 Node.js 搭建简单的本地服务器

[教程](https://zhictory.github.io/blog/2018/04/20/node-server.html)

***

启动服务器：

```shell
node server.1.js
```

然后通过 [http://localhost:8080/index.html](http://localhost:8080/index.html) 访问页面。

如果要调试跨域，就启动另一个服务器：

```shell
node server.2.js
```

然后通过 [http://localhost:4000/index.html](http://localhost:8080/index.html) 访问页面。