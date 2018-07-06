/**
 * 思路：
 * 我们需要一个HTTP服务器
 * 对于不同的请求，根据请求的URL，我们的服务器需要给予不同的响应，因此我们需要一个路由，用于把请求对应到请求处理程序（request handler）
 * 当请求被服务器接收并通过路由传递之后，需要可以对其进行处理，因此我们需要最终的请求处理程序
 * 我们需要从html文件里提取数据以及展示服务器传入的数据，因此需要将html和服务器结合起来
 */
var fs = require('fs');
var http = require('http');
var url = require('url');
/**
 * 路由
 * @param {Function} handle 请求处理程序
 * @param {String} pathname 路径
 * @param {Object} response 响应数据
 * @param {Object} postData 请求参数
 */
function route(handle, pathname, response, postData) {
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }
}
/**
 * 服务器
 * @param {Function} route 路由
 * @param {Function} handle 请求处理程序
 */
function start(route, handle) {
  function onRequest(request, response) {
    var postData = '';
    var pathname = url.parse(request.url).pathname;
    switch (request.method) {
      case 'GET':
        postData += url.parse(request.url).query;
        request.setEncoding('utf8');
        route(handle, pathname, response, postData);
        break;
      case 'POST':
        request.addListener('data', function (postDateChunk) {
          postData += postDateChunk;
        });
        request.addListener('end', function () {
          route(handle, pathname, response, postData);
        });
        break;
    };
  }

  http.createServer(onRequest).listen(8080);
  console.log('Server has started');
}
// 请求处理程序
var handle = {
  // index 页面
  '/public/index.html': function (response, postData) {
    var pathname = __dirname + '/public/index.html';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // 1 页面
  '/public/1.html': function (response, postData) {
    var pathname = __dirname + '/public/1.html';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // download 接口
  '/download': function (response, postData) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(JSON.stringify({
      code: 200,
      data: {
        'time': new Date().toLocaleString("en-US")
      }
    }));
    response.end();
  },
  // upload 接口
  '/upload': function (response, postData) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('You have sent: ' + JSON.parse(postData).value);
    response.end();
  }
};

// 启动服务器 = 路由处理 + 接口处理
start(route, handle);