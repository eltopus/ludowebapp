/**
 * http://usejsdoc.org/
 */

var sockId = null;
var game = null;
var gameio = null;
var inBackground = false;

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
		if (!inBackground){
			game.selectPieceEmissionById(pieceId);
		}


	});

	gameio.on('diceRoll', function(diceObject){
		if (!inBackground){
			game.rollDiceEmission(diceObject);
		}


	});

	gameio.on('diceSelection', function(diceObject){
		if (!inBackground){
			game.setSelectedDieById(diceObject);
		}


	});

	gameio.on('diceUnSelection', function(diceObject){
		if (!inBackground){
			game.setUnSelectedDieById(diceObject);
		}


	});

	gameio.on('piecePosition', function(pieceObject){


	});

	gameio.on('play', function(playObject){
		if (!inBackground){
			game.playDiceEmission(playObject.playerName);
		}


	});

	gameio.on('releaseGame', function(data){
		if (!inBackground){
			game.restartEmission();
		}

	});

	gameio.on('updatePlayerInBackground', function(status){
		if (inBackground){
			inBackground = false;
			game.restartEmission();
		}


	});

	gameio.on('nextTurn', function(nextPlayer){

		game.updateGame(nextPlayer);
		if (!inBackground){
		}

	});

	gameio.on('updateGame', function(gameData){
		//game.updateGame(gameData);
	});
	
	
	gameio.on('onMessage', function(message){
		$('#chatLog').append(message);
		var chatLogDiv = document.getElementById("chatLog");
		chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
	});


	gameio.on('playerReconnected', function(screenName){
		if (!inBackground){
			if (screenName !== null){
				alertMessage(screenName + " has reconnected", "Reconnection",  false);
				game.connectionNotificationAlert(screenName, true);
			}

		}

	});

	gameio.on('disconnected', function(screenName){
		if (!inBackground){
			game.connectionNotificationAlert(screenName, false);
		}

	});
	
	gameio.on('connect', function(){
		alertMessage("You have been reconnected", "Reconnection",  false);
	});


	if (game.isMobile)
	{
		var gameId = game.gameId;
		var playerName = game.playerName;
		window.addEventListener("focus", function(evt){
			if (inBackground){
				game.controller.consumeDice();
				game.consumeCurrentPlayerDice();
			}
		}, false);

		window.addEventListener("blur", function(evt){
			if (!game.myTurn){
				inBackground = true;
				gameio.emit('browserInBackground', {gameId: gameId, playerName : playerName}, function(status){

				});
			}
		}, false);
	}
	
	
	
	
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

	});
};

Socket.prototype.updateGameOnDisconnection = function(updateGameData){
	//gameio.emit('updateGameOnDisconnection', updateGameData, function(status){

	//});
};



