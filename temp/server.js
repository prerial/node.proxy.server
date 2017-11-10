var express  = require('express');
var app      = express();
var httpProxy = require('./client.webserver/libs/http-proxy');
var apiProxy = httpProxy.createProxyServer();
apiProxy.on('error', function(e) {
    console.log('Error: ' + e);
});
app.use(express.static(__dirname + '/client.webserver'));

var pythonAPI = 'http://localhost:5000/';

app.all("/dmc/v1.0/schemas", function(req, res) {
    console.log('redirecting to schemas');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/schema_id", function(req, res) {
    console.log('redirecting to schema_id');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/denorm", function(req, res) {
    console.log('redirecting to denorm');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/getdatasource", function(req, res) {
    console.log('redirecting to getdatasource');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/getdatabases", function(req, res) {
    console.log('redirecting to getdatabases');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/getconnections", function(req, res) {
    console.log('Proxy redirecting to getconnections');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/saveconnection", function(req, res) {
    console.log('Proxy redirecting to saveconnection');
    apiProxy.web(req, res, {target: pythonAPI});
});
app.all("/dmc/v1.0/schemas/deleteconnection", function(req, res) {
    console.log('Proxy redirecting to deleteconnection');
    apiProxy.web(req, res, {target: pythonAPI});
});

app.listen(3000, function(){
    console.log('Server started on 3000');
});
