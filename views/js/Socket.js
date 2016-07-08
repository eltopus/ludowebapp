/**
 * http://usejsdoc.org/
 */

var sockId = null;
var game = null;
var gameio = null;
Socket = function(ludogame){

	game = ludogame;
	gameio = game.socket;
	var dice = game.controller.dice;
	var players = game.ludo;
	this.queue = new Queue();
	sockId = game.sockId;


	for (var i = 0; i < players.length; ++i){
		players[i].setGameIO(this);
	}

	for (i = 0; i < dice.length; ++i){
		dice[i].setGameIO(this);
	}


	gameio.on('pieceSelection', function(pieceId){
		game.selectPieceEmissionById(pieceId);

	});

	gameio.on('diceRoll', function(diceObject){
		game.rollDiceEmission(diceObject);

	});

	gameio.on('diceSelection', function(diceObject){
		game.setSelectedDieById(diceObject);

	});

	gameio.on('diceUnSelection', function(diceObject){
		game.setUnSelectedDieById(diceObject);

	});

	gameio.on('piecePosition', function(pieceObject){
		console.log('Id: ' + pieceObject.uniqueId + ' x: ' + pieceObject.x + ' y: ' + pieceObject.y);

	});

	gameio.on('play', function(playObject){
		game.playDiceEmission(playObject.playerName);

	});

	gameio.on('releaseGame', function(data){
		game.restartEmission();
	});

	gameio.on('nextTurn', function(nextPlayer){


		if (game.playerName == nextPlayer.screenName)
		{
			game.myTurn = true;
			game.playDing();
			game.updateGame(nextPlayer.gameData);
			//game.saveGame(nextPlayer.gameData);
			//console.log("I am unlocked! " + nextPlayer.screenName);
		}else{
			game.myTurn = false;
			game.playDong();
			game.updateGame(nextPlayer.gameData);
			//game.saveGame(nextPlayer.gameData);
			//console.log("I am locked! " + nextPlayer.screenName);
		}
	});

	gameio.on('updateGame', function(gameData){
		//game.updateGame(gameData);
	});


	gameio.on('playerReconnected', function(screenName){
		if (screenName !== null){
			alertMessage(screenName + " has reconnected", "Reconnection",  false);
			game.connectionNotificationAlert(screenName, true);
		}
	});

	gameio.on('disconnected', function(screenName){
		game.connectionNotificationAlert(screenName, false);
	});


};

Socket.prototype.emitDiceIsPlayed = function(diceInfo){
	gameio.emit('diceIsPlayed', diceInfo);
};

Socket.prototype.emitUpdatePieceInfo = function(pieceInfo){
	gameio.emit('updatePieceInfo', pieceInfo);
};


Socket.prototype.emitPieceSelection = function(pieceSelectionObject){
	gameio.emit('pieceSelection', pieceSelectionObject);
};

Socket.prototype.emitDiceRoll = function(diceObject){
	gameio.emit('diceRoll', diceObject);
};

Socket.prototype.emitDiceRollCompleted = function(diceObject){
	gameio.emit('diceRollCompleted', diceObject);
};

Socket.prototype.emitDiceSelection = function(diceObject){
	gameio.emit('diceSelection', diceObject);
};

Socket.prototype.emitDiceUnSelection = function(diceObject){
	gameio.emit('diceUnSelection', diceObject);
};

Socket.prototype.emitPiecePosition = function(pieceObject){
	gameio.emit('piecePosition', pieceObject);
};

Socket.prototype.emitPlay = function(playObject){
	gameio.emit('play', playObject);
};

Socket.prototype.emitNextPlayer = function(nextPlayerObject){
	gameio.emit('emitNextPlayer', nextPlayerObject, function(data){
		//var newSockId = data.newId;
		//console.log("I am locked! " + sockId + " does not equals " + newSockId);
		//game.myTurn = false;
	});
};

Socket.prototype.updateGameOnDisconnection = function(updateGameData){
	gameio.emit('updateGameOnDisconnection', updateGameData, function(status){
		//console.log("Status! " + status);
	});
};



