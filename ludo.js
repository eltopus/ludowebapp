/**
 * 
 */
var io;
var gameSocket;
var redisIsReady = false;
var games = [];
var socketIds = [];

var redis = require('redis');
var fs = require('fs');
var ludoGameInstance = require('./LudoGameInstance');
var _ = require('underscore');

/*
var client = redis.createClient("6379", "192.168.198.141"); 
client.on("error", function (err) {
    console.log(err);
});
client.on('connect', function() {
    console.log('connected to redis server');
});
client.on('ready', function() {
	redisIsReady = true;
    console.log('redis is running');
});
 */



var io = null;
var sok = null;
exports.initGame = function(gameio, socket){
	io = gameio;
	sok = gameio;
	gameSocket = socket;
	gameSocket.emit('connected', 'You are connected!');
	gameSocket.on('saveNewGame', saveNewGame);
	gameSocket.on('pieceSelection', pieceSelection);
	gameSocket.on('diceRoll', diceRoll);
	gameSocket.on('diceSelection', diceSelection);
	gameSocket.on('diceUnSelection', diceUnSelection);
	gameSocket.on('piecePosition', piecePosition);
	gameSocket.on('play', emitPlay);
	gameSocket.on('endOfGame', endOfGame);
	gameSocket.on('createTwoPlayerMultiplayerGame', createTwoPlayerMultiplayerGame);
	gameSocket.on('createFourPlayerMultiplayerGame', createFourPlayerMultiplayerGame);
	gameSocket.on('connectMultiplayerGame', connectMultiplayerGame);
	gameSocket.on('startGame', startGame);
	gameSocket.on('awaitingStartGame', awaitingStartGame);
	gameSocket.on('nextTurn', nextTurn);
	gameSocket.on('emitNextPlayer', emitNextPlayer);
	gameSocket.on('releaseGame', releaseGame);
	gameSocket.on('disconnect', disconnected);
	gameSocket.on('updateGame', updateGame);
	gameSocket.on('playerReconnected', playerReconnected);
	gameSocket.on('browserInBackground', browserInBackground);
	gameSocket.on('updatePieceInfo', updatePieceInfo);
	gameSocket.on('diceIsPlayed', diceIsPlayed);
	gameSocket.on('onMessage', sendMessage);
	gameSocket.on('restartGameRequest', restartGameRequest);
	gameSocket.on('restartGameResponse', restartGameResponse);
	gameSocket.on('sendMessageFromAdmin', sendMessageFromAdmin);
	
};


exports.getGameData = function(callback){
	callback(games);
};

exports.deleteGameData = function(gameId, callback){

	deleteGame(gameId, function(message){
		callback(message);
	});

};

exports.downloadGameData = function(gameId, callback){
	var game = games[gameId];
	if (game){
		
		game.gameData.screenNameFromGame = [];
		game.gameData.indexFromGame = [];
		
		for (var key in game.ludoPlayers)
		{
			game.gameData.screenNameFromGame.push(game.ludoPlayers[key].screenName);
			game.gameData.indexFromGame.push(game.ludoPlayers[key].index);
			
		}
		
		game.gameData.numOfPlayers =  game.numOfPlayers;
		game.gameData.inBackground = game.inBackground;
		game.gameData.playerWentInBackground = game.playerWentInBackground;
		game.gameData.screenNameFromGame = game.screenNames;
		game.gameData.disconnectedPlayers = JSON.stringify(game.disconnectedPlayers);
		game.gameData.currentPlayerName = game.currentPlayerName;
		
		callback({ok : true, message : "Game Id " + gameId + " does not exist!", gameData : game.gameData});
	}
	else{
		callback({ok : false, message : "Game Id " + gameId + " does not exist!", gameData : {}});
	}

};

exports.loadTwoPlayerMultiplayerGame = function(preparedDataL, callback){

	var gameId = preparedDataL.gameId;
	console.log("GameId: " + gameId);
	preparedDataL.complete = false;
	preparedDataL.setSessionTurn = false;

	new ludoGameInstance(gameId, null, null, preparedDataL, null, false, function(gameInstance){
		
		games[gameId] = gameInstance;
		
	});
	
	callback(true);


};

exports.onReport = function(report, callback){
	var game = games[report.gameId];
	if (game){
		game.getUpdatedGameData(function(updatedGame){
			//console.log("On Update : " + JSON.stringify(updatedGame) + " PlayerName: " + report.playerName);
			callback({ok : true, message : "Report sent successfully!", gameData : updatedGame.gameData});
		});
	}else{
		callback({ok : false, message : "Error occured while sending report..."});
	}
};

exports.sendMessageToAllPlayers = function(message, callback){
	sendMessageFromAdmin(message, function(reply){
		callback(reply);
	});

};

function sendMessageFromAdmin(message, callback){
	var sock = this;
	io.sockets.emit('messagefromadmin', message);
	return callback("Message sent to all players");
}

function deleteGame(gameId, callback){

	var game = games[gameId];
	if (game)
	{
		if (game.isEmpty()){
			delete games[gameId];
			callback({ok : true, message :  gameId + " was deleted sucessfully"});
		}else{
			callback({ok : false, message : "Error!!! " + gameId + " is NOT empty"});
		}
	}else{
		callback({ok : false, message : "Error!!! " + gameId + " does NOT exist"});
	}
}

function sendMessage(player, callback){
	var sock = this;
	sock.broadcast.to(player.gameId).emit('onMessage', player.message);
	callback(player.message);
}

function browserInBackground(player, callback){
	var sock = this;
	var game = games[player.gameId];
	if (game){
		game.addPlayerinBackground(player.playerName, function(status){
			callback(true);
		});
	}
}

function playerReconnected(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('playerReconnected', data.screenName);

}

function updateGame(gameId, callback){
	var game = games[gameId];
	if (game){
		game.getUpdatedGameData(function(updatedGame){
			//console.log("On Update : " + JSON.stringify(games[gameId].gameData));
			callback(updatedGame);
		});
	}else{
		callback(null);
	}

}


function releaseGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('releaseGame', data);
}


function nextTurn(data, callback){
	var sock = this;
	callback(true);
}

function emitNextPlayer(data, callback)
{
	var sock = this;
	processNextTurn(data, sock.id, function(nextPlayer){

		if (nextPlayer.gameData){
			data.newId = nextPlayer.socketId;
			io.sockets.in(data.gameId).emit('nextTurn', nextPlayer);
			if (nextPlayer.playerWentInBackground){
				games[data.gameId].resetInBackground();
				io.sockets.in(data.gameId).emit('updatePlayerInBackground', nextPlayer);
			}
			return callback(data);
		}else{
			return callback(null);
		}

	});
}

function processNextTurn(data, id, callback){

	if (socketIds[id] && games[data.gameId])
	{
		var screenName = socketIds[id].screenName;
		//console.log("Data ScreenName: " + screenName);
		games[data.gameId].getNextSocketId(data, function(nextPlayer){
			callback(nextPlayer);
		});
	}

}

function restartGameRequest(data, callback){
	var sock = this;
	var game = games[data.gameId];
	if (game){
		
		if (game.restartRequests === 0){
			game.updateRestartRequests(function(status){
				//console.log("Game restart: " + data.gameId + " was requested by " + data.playerName + " at" + new Date());
				sock.broadcast.to(data.gameId).emit('restartGameRequest', data);
				return callback("Restart Request Sent to All Players...");
			}); 
			
		}else{
			
			return callback("One Restart Request is active");
		}
		
		
		
		
	}else{
		callback("Restart Request Cannnot Be Completed!!!");
	}

}

function restartGameResponse(data, callback){
	var sock = this;
	var game = games[data.gameId];
	if (game){
		if (data.accept){
			sock.broadcast.to(data.gameId).emit('restartGameResponse', {accept : data.accept, message : data.playerName + " accepted request"});
			game.updateRestartRequests(function(gameData){
				if (gameData === null){
					return callback(data.playerName + " accepted request");
				}else{
					//console.log("Game restart: " + JSON.stringify(gameData));
					io.sockets.in(data.gameId).emit('restartGame', gameData);
					return callback(data.playerName + " accepted request");
				}
			}); 
			
		}else{
			game.restartRequests = 0;
			sock.broadcast.to(data.gameId).emit('restartGameResponse', {accept : data.accept, message : data.playerName + " declined request"});
			callback(data.playerName + " declined request");
		}
		
	}
	else{
		callback("Restart response by " + data.playerName + " cannot be completed");
	}
	

}

function endOfGame(data){
	var sock = this;
	if (games[data.gameId]){
		console.log("Game: " + data.gameId + " ended at " + new Date() + " Game will be deleted");
		//delete games[data.gameId];
	}

}


function awaitingStartGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('awaitingStartGame', data);

}

function startGame(gameId, callback){

	var sock = this;
	var gameInstance = games[gameId];
	if (gameInstance){
		gameInstance.updateStartGame(function(gameData){
			sock.broadcast.to(gameId).emit('startGame', gameData);
			callback(gameData);
		});
	}
}


function createTwoPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim().toUpperCase();
	getTwoPlayerGame(function(twoPlayer){
		twoPlayer.ok = true;
		twoPlayer.message = 'OK';
		twoPlayer.complete = false;
		twoPlayer.inprogress = false;
		twoPlayer.setSessionTurn = true;
		twoPlayer.gameId = gameId;
		new ludoGameInstance(gameId, sock.id, screenName, twoPlayer, preparedData.colors, true, function (ludoInstance){
			games[gameId] = ludoInstance;
			socketIds[sock.id] = {gameId : gameId, screenName : screenName, owner : true};
			ludoInstance.gameData.sockId = sock.id;
			ludoInstance.gameData.screenName = screenName;
			console.log("Two-PlayerGame Created by: " + screenName + " with game ID: " + gameId + " on " + new Date());
			callback(ludoInstance.gameData);
			io.sockets.in(gameId).emit('onMessage', screenName + ' joined the game');
			sock.join(gameId.toString());
		});

	});

}


function createFourPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim().toUpperCase();

	getFourPlayerGame(function(fourPlayer){
		fourPlayer.ok = true;
		fourPlayer.message = 'OK';
		fourPlayer.complete = false;
		fourPlayer.inprogress = false;
		fourPlayer.setSessionTurn = true;
		fourPlayer.gameId = gameId;
		new ludoGameInstance(gameId, sock.id, screenName, fourPlayer, preparedData.colors, true, function (ludoInstance){
			games[gameId] = ludoInstance;
			socketIds[sock.id] = {gameId : gameId, screenName : screenName, owner : true};
			ludoInstance.gameData.sockId = sock.id;
			ludoInstance.gameData.screenName = screenName;
			console.log("Four-PlayerGame Created by: " + screenName + " with game ID: " + gameId + " on " + new Date());
			ludoInstance.gameData.screenName = screenName;
			callback(ludoInstance.gameData);
			io.sockets.in(gameId).emit('onMessage', screenName + ' joined the game');
			sock.join(gameId.toString());

		});

	});

}


function connectMultiplayerGame(newPlayer, callback){
	
	var sock = this;
	var screenName = newPlayer.screenName.toString().trim().toUpperCase();
	var gameId = newPlayer.gameId.toString().trim().toLowerCase();
	var game = games[gameId];
	
	if (game)
	{
		if (screenName === 'ADMIN'){
			if (!game.gameInProgress){
				callback({ok : false, message : "Game ID: " + gameId + " is NOT in progress!" });
			}else{
				game.addAdminPlayer(screenName, function(gameData){
					sock.join(gameId.toString());
					callback(gameData);
				});
			}
			

		}else{

			games[gameId].addPlayer(gameId, sock.id, screenName, false, function(data){

				if (data === null){
					callback({ok : false, message : "Game ID: " + gameId + " seems to be full."});
				}else{

					if (!data.ok)
					{
						var screenNames = [];
						for (var i = 0; i <  data.availableScreenNames.length; ++i){
							//console.log("Names: " + data.availableScreenNames[i].screenName);
							screenNames.push(data.availableScreenNames[i].screenName);
						}
						callback({ok : false, message : "Disconnected ScreenNames are: " + screenNames});

					}else{

						var gameData = data.gameData;
						socketIds[sock.id] = {gameId : gameId, screenName : data.screenName, owner : false};
						gameData.sockId = sock.id;
						gameData.screenName = data.screenName;
						sock.broadcast.to(gameId).emit('awaitingStartGame', gameData);
						sock.join(gameId.toString());
						console.log("Game: " + gameId + " was joined by " + screenName + " on " + new Date());
						callback(gameData);
					}
				}

			});

		}

	}else{
		callback({ok : false, message : "Game ID: " + newPlayer.gameId + " does not exist!" });
	}
}

function pieceSelection(pieceSelectionObject){
	var sock = this;
	var gameInstance = games[pieceSelectionObject.gameId];
	if (gameInstance){
		gameInstance.updatePlayerPieceSelection(pieceSelectionObject, function(status){
			if (status){
				//console.log("Final Piece Selection: " + JSON.stringify(games[pieceSelectionObject.gameId].gameData));
			}

		});
	}
	sock.broadcast.to(pieceSelectionObject.gameId).emit('pieceSelection', pieceSelectionObject.uniqueId);
}

function diceSelection(diceObject){
	var sock = this;
	var gameInstance = games[diceObject.gameId];
	if (gameInstance){
		gameInstance.updateDiceSelection(diceObject, function(status){
			if (status){
				//console.log("Final: " + JSON.stringify(games[diceObject.gameId].gameData));
			}

		});
	}
	sock.broadcast.to(diceObject.gameId).emit('diceSelection', diceObject);

}

function piecePosition(pieceObject){
	var sock = this;
	//console.log('Piece: ' + pieceObject.uniqueId + ' x: ' + pieceObject.x + ' y: ' + pieceObject.y);
	sock.broadcast.emit('piecePosition', pieceObject);

}

function diceUnSelection(diceObject){
	var sock = this;
	var gameInstance = games[diceObject.gameId];
	if (gameInstance){
		gameInstance.updateDiceUnSelection(diceObject, function(status){
			if (status){
				//console.log("Final: " + JSON.stringify(games[diceObject.gameId].gameData));
			}

		});
	}
	sock.broadcast.to(diceObject.gameId).emit('diceUnSelection', diceObject);
}


function diceRoll(diceObject){
	var sock = this;
	var gameInstance = games[diceObject.gameId];
	if (gameInstance){
		gameInstance.updateDiceRoll(diceObject, function(status){
			if (status){
				//console.log("Final After Roll : " + JSON.stringify(games[diceObject.gameId].gameData));
			}

		});
	}
	sock.broadcast.to(diceObject.gameId).emit('diceRoll', diceObject);
}

function updatePieceInfo(pieceInfo){

	var gameInstance = games[pieceInfo.gameId];
	if (gameInstance){
		gameInstance.updatePieceInfo(pieceInfo, function(status){
			if (status){
				//console.log("Final Piece Info : " + JSON.stringify(gameInstance.gameData));
			}else{
				//console.log("Final Piece Info...");
			}

		});
	}
}

function diceIsPlayed(diceInfo){
	var gameInstance = games[diceInfo.gameId];
	if (gameInstance){
		gameInstance.updateDiceInfo(diceInfo, function(status){
			if (status){

			}else{
				//console.log("Final Dice Info...");
			}
		});
	}
}


function emitPlay(playerObject){
	var sock = this;
	sock.broadcast.to(playerObject.gameId).emit('play', playerObject);
}


function disconnected(data){
	var sock = this;

	if (socketIds[sock.id]){
		var gameId = socketIds[sock.id].gameId;
		var screenName = socketIds[sock.id].screenName;
		var owner = socketIds[sock.id].owner;

		if (gameId){
			var game = games[gameId];
			if (game){
				game.removePlayer(screenName, owner);
				console.log("Player: " + screenName + " was removed from game " + gameId + " on " + new Date());
				delete socketIds[sock.id];
				if (game.isEmpty()){
					if (game.gameInProgress){
						console.log('Game is empty. Persisting ' + gameId);
					}else{
						console.log('Game is empty. Deleting ' + gameId);
						delete games[gameId];
					}
					//_.without(games, gameId);
					//delete games[gameId];

				}else{
					sock.broadcast.to(gameId).emit('disconnected', screenName);
				}
			}else{
				console.log('Game does not exist');
			}
		}else{
			console.log('GameID does not exist');
		}

	}else{
		console.log('Disconnecton Error!!!');
	}

}


function saveNewGame(data, callback){
	var sock = this;
	if  (games[data.gameId]){
		var gameData = games[data.gameId].gameData;
		data.complete = gameData.complete;
		data.ok = gameData.ok;
		data.message = gameData.message;
		data.gameMode = gameData.gameMode;
		data.inprogress = true;
		games[data.gameId].gameData = data;

	}else{

	}
	callback("Game ID: " + data.gameId + " saved");

}

function randomString(length) {
	return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



function getTwoPlayerGame(callback) {
	var twoPlayerGame = {gameId: null, gameMode : 2, setSessionTurn : false, owner : false, howManyPlayersJoined : 0, gameEnded : false,
			diceIds:[{ uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a", value: 0 }, {uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0}],
			players :[{ piecesNames :["red","blue"], playerName : null, hasRolled :false, index : 0, playerMode : 2, endOfPlay : 0, playerIndex : 1, creator : true, 
				pieces:[],
				        diceObject :[{uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a",value : 0, playerName : null, selected : false},{uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        { piecesNames :["yellow","green"], playerName : null, hasRolled :false, index :1, playerMode :2, endOfPlay :0, playerIndex : 2, creator : false,
				        	pieces :[],
				        	         diceObject :[{uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a",value : 0, playerName : null, selected : false},{uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(twoPlayerGame);
}

function getFourPlayerGame(callback){
	var fourPlayerGame = {gameId :null, gameMode : 4, setSessionTurn : false, owner : false, howManyPlayersJoined : 0, gameEnded : false,
			diceIds :[{ uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f", value :0},{ uniqueId :"8c89ca63-6a54-4088-8957-9280732b957d", value :0}],
			players :[{ piecesNames :["red"], playerName : null, hasRolled :false, index :0, playerMode :4, endOfPlay :0, playerIndex : 1, creator : true,
				pieces :[],
				         diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				         { piecesNames :["blue"], playerName : null, hasRolled :false, index :1, playerMode :4, endOfPlay :0, playerIndex : 2, creator : false,
				        	 pieces :[],
				        	          diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        	          { piecesNames :["yellow"], playerName : null, hasRolled :false, index :2, playerMode :4, endOfPlay :0, playerIndex : 3, creator : false,
				        	        	  pieces:[],
				        	        	          diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        	        	          { piecesNames :["green"], playerName : null, hasRolled :false, index :3, playerMode :4, endOfPlay :0, playerIndex : 4, creator : false,
				        	        	        	  pieces :[],
				        	        	        	           diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(fourPlayerGame);
}