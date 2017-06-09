var request = require('request');
var http = require('http');

var user = process.env.PACKAGIST_USER;
var token = process.env.PACKAGIST_TOKEN;
var url = process.env.PACKAGIST_URL || 'https://packagist.org';
var port = process.env.APP_PORT || 80;
var hooktoken = process.env.WEBHOOK_TOKEN;

http.createServer(function (req, res) {
  var body = '';

  req.on('data', function (data) {
    body += data;

    if (body.length > 1e6) {
        req.connection.destroy();
    }
  });

  req.on('end', function () {
    var data = [];
    data = body ? JSON.parse(body) : [];

    if (!data.hasOwnProperty('token') || data.token !== hooktoken) {
      res.writeHead(401, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({ error: 'Invalid token' }));
	  res.end();
      console.log('Invalid token!');
    } else {
      request({
        url: url + '/api/update-package?username=' + encodeURIComponent(user) + '&apiToken=' + encodeURIComponent(token),
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        json: {"repository":{"url":data.event.repo.url}}
      }, function (error, resp, body) {
		   res.writeHead(resp.statusCode, resp.headers);
           resp.on('data', function (chunk) {
               res.write(chunk);
           });
           resp.on('end', function (chunk) {
               res.end();
           });
           console.log(resp.statusCode);
           if (202 !== resp.statusCode || 200 !== resp.statusCode) {
    			console.log(body);
           }
      });
    }
  });
}).listen(port);
