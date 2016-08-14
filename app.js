/**
 * 
 */


var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var smtpTransport = nodemailer.createTransport(smtpTransport({
	host : "smtp.ipage.com",
	secureConnection : false,
	port: 587,
	auth : {
		
	},
	tls: {rejectUnauthorized: false},
	debug:true
}));

passport.use(new Strategy(
		function(username, password, cb) {
			db.users.findByUsername(username, function(err, user) {
				if (err) { return cb(err); }
				if (!user) { return cb(null, false); }
				if (user.password != password) { return cb(null, false); }
				return cb(null, user);
			});
		}));


passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});


var app = express();
var compression = require('compression');
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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


app.use('/phaser-input', express.static(path.join(__dirname, 'node_modules/phaser-input/build/')));
app.use('/underscore', express.static(path.join(__dirname, 'node_modules/underscore/')));
app.use('/phaser-nineslice', express.static(path.join(__dirname, 'node_modules/phaser-nineslice/build/')));
app.use('/angular-ui-router', express.static(path.join(__dirname, 'node_modules/angular-ui-router/release/')));
app.use('/angular', express.static(path.join(__dirname, 'node_modules/angular/')));
app.use('/', express.static(path.join(__dirname, '/views')));

//Initialize Passport and restore authentication state, if any, from the
//session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/ludo', function(req, res){
	res.sendFile(__dirname + '/views/ludo.html');
});

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
		function(req, res) {
	res.redirect('/admin');
});

app.get('/logout',
		function(req, res){
	req.logout();
	res.redirect('/login');
});

app.get('/setup', function(req, res){
	res.sendFile(__dirname + '/views/setup.html');
});

app.get('/admin', require('connect-ensure-login').ensureLoggedIn(),
		function(req, res){
	res.sendFile(__dirname + '/views/admin.html');
});

app.get('/fetch', function(req, res){

	getGameData(function(data){
		res.send(data);
	});

});

app.get('/load', function(req, res){

	loadTwoPlayerMultiplayerGame(function(data){
		res.send(data);
	});

});


app.post('/download', function(req, res){
	var gameId = req.body.gameCode;
	if (gameId){
		downloadGameData(gameId, function(data){
			res.send(data);
		});

	}else{
		res.send({ok : false, message : "Game Code Error! Please check and try again"});
	}

});

app.post('/loaddata', function(req, res){
	var data = JSON.stringify(req.body);
	var gameData = JSON.parse(data);
	loadTwoPlayerMultiplayerGame(gameData, function(msg){
		res.send(msg);
	});

});


app.post('/delete', function(req, res) {
	var gameId = req.body.gameCode;
	if (gameId){
		deleteGameData(gameId, function(message){
			res.send(message);
		});

	}else{
		res.send({message : "Game Code Error! Please check and try again"});
	}
});

app.post('/sendmessage', function(req, res) {
	var message = req.body.message;
	if (message){
		sendMessage(message, function(reply){
			res.send(reply);
		});

	}else{
		res.send("Message is invalid");
	}
});

app.post('/report', function(req, res) {
	var report = req.body;
	if (report){
		sendAnonymousReport(report, function(message){
			if (message.ok){
				var messageBody = JSON.stringify(message.gameData);
				console.log("Message is ok");
				var mailOptions={
						from : "ludo@efizzypoint.com",
						to : "ludo@efizzypoint.com",
						subject : "Bug reported by: " + report.playerName,
						text : messageBody,
						html : "<html> <body> <p>" + report.message + "</p> <p>" + messageBody + "</p> </body> </html>"
				};
				smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
						console.log(error);
					}else{
						console.log(response.response.toString());
						console.log("Message was sent successfully");

					}
				});
			}
			res.send(message.message);


		});

	}else{
		res.send("A Great error has occurred");
	}
});


app.post('/contact', function(req, res) {
	var contactinfo = req.body;
	if (contactinfo){

		var mailOptions={
				from : contactinfo.email,
				to : "ludo@efizzypoint.com",
				subject : contactinfo.subject,
				text : '',
				html : "<html> <body> <p>" + contactinfo.subject + "</p> <p>" + contactinfo.message + "</p> </body> </html>"
		};
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.send("Error!!! Message NOT sent!");
			}else{
				console.log(response.response.toString());
				res.send("Message was sent successfully ");
			}
		});

		

	}else{
		res.send("A Great error has occurred");
	}
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

function getGameData(callback){

	var data = { data: [] };

	ldx.getGameData(function(games){
		if (games){

			for (var key in games){
				var game = games[key];
				var isEmpty = game.isEmpty();
				data.data.push([ key, game.gameMode, game.screenNames,  game.gameInProgress,  isEmpty, game.date]);
			}
		}

		callback(data);
	});
}


function deleteGameData(gameId, callback){

	ldx.deleteGameData(gameId, function(message){
		callback(message);
	});

}

function loadTwoPlayerMultiplayerGame(gameData, callback){

	ldx.loadTwoPlayerMultiplayerGame(gameData, function(message){
		callback(message);
	});

}

function downloadGameData(gameId, callback){
	ldx.downloadGameData(gameId, function(data){
		callback(data);
	});
}

function sendMessage(message, callback){
	ldx.sendMessageToAllPlayers(message, function(reply){
		callback(reply);
	});
}

function sendAnonymousReport(report, callback){

	ldx.onReport(report, function(message){
		callback(message);
	});

}