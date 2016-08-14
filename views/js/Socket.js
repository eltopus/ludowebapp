/**
 * http://usejsdoc.org/
 */

var sockId = null;
var game = null;
var gameio = null;
var inBackground = false;
var inFocus = true;

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

	gameio.on('updatePlayerInBackground', function(nextPlayer){
		if (inBackground){
			game.updateGame(nextPlayer, function(status){
				//console.log("Update from background finished...");
				inBackground = false;
				game.prepareForBackgroundUpdate();
				//if you are not in focus and it is not your turn
				if (!inFocus && !game.myTurn){
					
					inBackground = false;
					game.controller.consumeDice();
					game.consumeCurrentPlayerDice();
					gameio.emit('browserInBackground', {gameId: gameId, playerName : playerName}, function(status){
						console.log("I have updated but it is not my turn");
						inBackground = true;
					});
				}
			});
			
		}
	});

	gameio.on('nextTurn', function(nextPlayer){

		if (!inBackground){
			game.updateGame(nextPlayer, function(status){
				//console.log("Update finished...");
			});
		}

	});

	gameio.on('restartGame', function(gameData){
		game.resetPlayer(gameData);

	});

	gameio.on('messagefromadmin', function(message){
		alertMessage(message, "Message from ADMIN",  false);
	});

	gameio.on('onMessage', function(message){
		$('#chatLog').append(message);
		var chatLogDiv = document.getElementById("chatLog");
		chatLogDiv.scrollTop = chatLogDiv.scrollHeight;
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

	gameio.on('connect', function(){
		alertMessage("You have been reconnected", "Reconnection",  false);
	});
	
	gameio.on('restartGameRequest', function(data){
		
		bootbox.dialog({
			message: data.playerName + ' has requested a restart of the game',
			title: "Do you want to restart game?",
			buttons: {
				danger: {
					label: "DECLINE",
					className: "btn-danger",
					callback: function() {	
						gameio.emit('restartGameResponse', {gameId : game.gameId, playerName : game.playerName, accept : false}, function(msg){
							Example.show(msg);
						});
					}
				},
				success: {
					label: "ACCEPT",
					className: "btn-success",
					callback: function() {
						gameio.emit('restartGameResponse', {gameId : game.gameId, playerName : game.playerName, accept : true}, function(msg){
							Example.show(msg);
						});
					} 
				}
			}
		});
	});
	
	gameio.on('restartGameResponse', function(data){
		
		if (data.accept){
			Example.show(data.message);
		}else{
			alertMessage(data.message, "Restart Declined",  false);
		}
		
	});


	
	if (game.isMobile)
	{
		var gameId = game.gameId;
		var playerName = game.playerName;
		
		window.addEventListener("focus", function(evt){
			
			if (!game.myTurn && !inFocus){
				inFocus = true;
				Example.show("Live updates will be restored on next player turn.");
			}
			
			
		}, false);

		window.addEventListener("blur", function(evt){
			if (!game.myTurn){
				inBackground = true;
				inFocus = false;
				game.controller.consumeDice();
				game.consumeCurrentPlayerDice();
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



