/**
 * 
 */

var compression = require('compression');
var express = require('express');
var app = express();
var logger = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ldx = require('./ludo');
var debug = require('debug');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');


//app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookieParser());




app.use('/phaser-input', express.static(path.join(__dirname, 'node_modules/phaser-input/build/')));
app.use('/underscore', express.static(path.join(__dirname, 'node_modules/underscore/')));
app.use('/phaser-nineslice', express.static(path.join(__dirname, 'node_modules/phaser-nineslice/build/')));
app.use('/angular-ui-router', express.static(path.join(__dirname, 'node_modules/angular-ui-router/release/')));
app.use('/angular', express.static(path.join(__dirname, 'node_modules/angular/')));
app.use('/', express.static(path.join(__dirname, '/views')));


app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/views/register.html');
});

app.get('/setup', function(req, res){
    res.sendFile(__dirname + '/views/setup.html');
});

app.post('/ludo', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});




io.on('connection', function(socket){
	debug('Listening on ' + socket.id);
    ldx.initGame(io, socket);
});

//var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
//var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

http.listen(port);
http.on('listening', onListening);

function onListening() {
	  var addr = http.address();
	  var bind = typeof addr === 'string'
	    ? 'pipe ' + addr
	    : 'port ' + addr.port;
	  debug('Listening on ' + bind);
	  console.log( "Listening on server_port: " + addr.port);
	}


function normalizePort(val) {
	  var port = parseInt(val, 10);

	  if (isNaN(port)) {
	    // named pipe
	    return val;
	  }

	  if (port >= 0) {
	    // port number
	    return port;
	  }

	  return false;
	}
 
/*
http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
});
*/
