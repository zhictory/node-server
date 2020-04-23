/**
 * 思路：
 * 我们需要一个HTTP服务器
 * 对于不同的请求，根据请求的URL，我们的服务器需要给予不同的响应，因此我们需要一个路由，用于把请求对应到请求处理程序（request handler）
 * 当请求被服务器接收并通过路由传递之后，需要可以对其进行处理，因此我们需要最终的请求处理程序
 * 我们需要从html文件里提取数据以及展示服务器传入的数据，因此需要将html和服务器结合起来
 */
const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const getUrlParam = require('rdf-snippet/script/getUrlParam');
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
    let postData = '';
    const pathname = url.parse(request.url).pathname;
    switch (request.method) {
      case 'GET':
        postData += `?${url.parse(request.url).query}`;
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

  http.createServer(onRequest).listen(8090);
  console.log('Server has started');
}
// 请求处理程序
const handle = {
  // index 页面
  '/public/index.html': function (response, postData) {
    const pathname = __dirname + '/public/index.html';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // 1 页面
  '/public/1.html': function (response, postData) {
    const pathname = __dirname + '/public/1.html';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // 2 页面
  '/public/2.html': function (response, postData) {
    const pathname = __dirname + '/public/2.html';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // 同步方式的下载
  '/file/test.xlsx': function (response, postData) {
    const pathname = __dirname + '/file/test.xlsx';
    fs.readFile(pathname, function (err, data) {
      response.end(data);
    });
  },
  // download 接口
  '/download': function (response, postData) {
    const dir = getUrlParam(postData, 'dir').replace(/\\/g, '/');
    const fileName = getUrlParam(postData, 'filename');
    const file = __dirname + dir + fileName;
    fs.access(file, fs.constants.F_OK, (err) => {
      console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
      if (err) {
        response.writeHead(404, { "content-type": "text/html" });
        response.write(JSON.stringify({
          code: 404,
          data: {
            'msg': 'file does not exist!'
          }
        }));
        response.end();
      } else {
        stats = fs.statSync(file);
        response.writeHead(200, {
          "Access-Control-Expose-Headers": "Content-Disposition",
          "Access-Control-Allow-Origin": "*",
          "Content-Description": "File Transfer",
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment;filename=" + encodeURI(fileName),
          'Content-Length': stats.size
        });
        // 两种方式返回二进制流（Node 层只能返回二进制流）
        // 第一种
        fs.createReadStream(file).pipe(response);
        // 第二种
        // fs.readFile(file, function (err, data) {
        //   response.end(data);
        // });
      }
    });
  },
  // upload 接口
  '/upload': function (response, postData) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('You have sent: ' + JSON.parse(postData).value);
    response.end();
  },
  '/reverse_geocoding': (response, postData) => {
    http.get('http://api.map.baidu.com/reverse_geocoding/v3/?ak=qRfBzSccDs1SuPLPYnSTBo8mrMNOPG1y&output=json&coordtype=wgs84ll&location=-6.210647,106.845236', (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data));
        console.log(JSON.parse(data).result.formatted_address);
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
};

// 启动服务器 = 路由处理 + 接口处理
start(route, handle);