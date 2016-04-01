/**
 * 
 */
var express = require('express');
var app = express();
var logger = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ldx = require('./ludo');

app.use(logger('dev'));
app.use('/', express.static(__dirname + '/views'));


app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});



io.on('connection', function(socket){
    ldx.initGame(io, socket);
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 
http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
});
