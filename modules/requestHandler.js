var fs = require('fs');
var queryString = require('querystring');

function start(response, postData) {
  console.log('Request handler "start" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify({
    code: 200,
    data: {
      'time': '2015/4/5',
      'name': 'apple',
      'age': '45'
    }
  }));
  response.end();
}

function upload(response, postData) {
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(queryString.parse(postData).value);
  response.write('You have sent: ' + queryString.parse(postData).value);
  response.end();
}

function init(response, postData) {
  var pathname = __dirname + '/public/index.html';
  fs.readFile(pathname, function(err, data){
    response.end(data);
  });
}

exports.start = start;
exports.upload = upload;
exports.init = init;
