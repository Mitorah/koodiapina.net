var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'text/html' });
    res.writeHead(req.url);
    res.end();
}).listen(8080);