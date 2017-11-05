var express  = require('express');
var app      = express();
var fs       = require("fs");
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();

var postingAPI = 'http://localhost:5000/app1/*',
    realtimeAPI = 'http://localhost:5000/app2/*',
    onemoreAPI = 'http://localhost:5000/',
onemoreAPI1 = 'http://localhost:5000/';

app.all("/app1/*", function(req, res) {
    console.log('redirecting to APP1');
    apiProxy.web(req, res, {target: postingAPI});
});

app.all("/app2/*", function(req, res) {
    console.log('redirecting to APP2');
    apiProxy.web(req, res, {target: realtimeAPI});
});

app.all("/app3/schemas", function(req, res) {
    console.log('redirecting to APP4');
    apiProxy.web(req, res, {target: onemoreAPI});
});
app.all("/dmc/v1.0/schemas/schema_id", function(req, res) {
    console.log('redirecting to APP3');
    apiProxy.web(req, res, {target: onemoreAPI});
});
app.all("/dmc/v1.0/schemas/schema_id1", function(req, res) {
    console.log('redirecting to APP5');
    apiProxy.web(req, res, {target: onemoreAPI});
});

app.listen(3000, function(){
    console.log('Server started on 3000');
});
