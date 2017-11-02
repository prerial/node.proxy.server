var port = 3000;
var proxyPort = 5000;
var express  = require('express');
var app      = express();
var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');

//
// Create a proxy server with custom application logic
//
var apiProxy = httpProxy.createProxyServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  console.log("##### PROXY: NEW REQUEST #####");

  //
  // Buffer the request so that `data` and `end` events
  // are not lost during async operation(s).
  //
  var buffer = httpProxy.buffer(req);

  /**
   * In a callback function the target server never receives a request and client keeps on "pending"
   */
  fs.readdir(__dirname, function(err, files)
  {
    console.dir(proxy);
    proxy.proxyRequest(req, res, {
        host: 'localhost',
        port: port,
        buffer: buffer
    });
  });
}).listen(proxyPort);
/*
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied: ' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
  res.end();

  console.log("##### TARGET: REQUEST RECEIVED #####");
}).listen(3000);
*/
app.use(express.static(__dirname + '/node.web-server'));

var pythonAPI = 'http://localhost:5000/';


app.all("/dmc/v1.0/schemas/schema_id", function(req, res) {
    console.log('redirecting to schema_id');
    apiProxy.web(req, res, {target: pythonAPI});
});

app.listen(port, function(){
    console.log('Server started on ' + port);
});

console.log("---\nProxy listens on port "+port+" and routes anything to port "+ proxyPort);