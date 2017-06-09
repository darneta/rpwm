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
    data = JSON.parse(body);

    if (!data.hasOwnProperty('token') || data.token !== hooktoken) {
      res.status(401);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ error: 'Invalid token' }));

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
           res.end(body);
           console.log(resp.statusCode);
           if (200 !== resp.statusCode) {
    			console.log(body);
           }
      });
    }
  });
}).listen(port);
