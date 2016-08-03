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
exports.initGame = function(gameio, socket){
	io = gameio;

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
	//gameSocket.on('loadGame', loadTwoPlayerMultiplayerGame);
	gameSocket.on('updatePieceInfo', updatePieceInfo);
	gameSocket.on('diceIsPlayed', diceIsPlayed);
	gameSocket.on('onMessage', sendMessage);
	//gameSocket.on('onReport', onReport);
	

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
			if (!nextPlayer.playerWentInBackground){
				data.newId = nextPlayer.socketId;
				io.sockets.in(data.gameId).emit('nextTurn', nextPlayer);
				callback(data);
			}else{
				games[data.gameId].resetInBackground();
				io.sockets.in(data.gameId).emit('updatePlayerInBackground', true);
				callback(null);
			}
		}else{
			callback(null);
		}

	});
}

function processNextTurn(data, id, callback){

	if (socketIds[id] && games[data.gameId])
	{
		var screenName = socketIds[id].screenName;
		//console.log("Data ScreenName: " + screenName);
		games[data.gameId].getNextSocketId(data.screenName, function(nextPlayer){
			callback(nextPlayer);
		});
	}

}

function endOfGame(data){
	var sock = this;
	if (games[data.gameId]){
		console.log("Game: " + data.gameId + " ended at " + new Date() + " Game will be deleted");
		delete games[data.gameId];
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
			game.addAdminPlayer(screenName, function(gameData){
				sock.join(gameId.toString());
				callback(gameData);
			});

		}else{

			games[gameId].addPlayer(gameId, sock.id, screenName, false, function(data){

				if (data === null){
					callback({ok : false, message : "Game ID: " + gameId + " seems to be full."});
				}else{

					if (data.index < 1)
					{
						var screenNames = [];
						for (var i = 0; i <  data.availableScreenNames.length; ++i){
							//console.log("Names: " + data.availableScreenNames[i].screenName)
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
					console.log('Game is empty. Persisting ' + gameId);
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
				pieces:[{piece :"red", state : 0, index : 1, x :118, y:72, x_home:118, y_home:72, imageId:"red_piece", uniqueId :"8d4329e4-bb84-4ef5-97ec-593669ff197c", homeIndex:1 },
				        {piece:"red",state:0,index:1,x:72,y:118,x_home :72,y_home :118, imageId :"red_piece",uniqueId :"4324a6e0-b3b5-4c36-832a-d9eed25842dc",homeIndex :1 },
				        {piece:"red",state:0, index:1, x:168, y:118, x_home:168, y_home:118,imageId : "red_piece",uniqueId :"e9833aec-d612-479f-836a-f33a62ee369a", homeIndex :1},
				        {piece :"red", state :0, index :1, x :120, y :168, x_home :120, y_home :168, imageId :"red_piece", uniqueId :"b4e8d1af-6c0e-4604-93da-7ba37c002906", homeIndex :1},
				        {piece:"blue", state :0, index :14, x :552, y :72, x_home :552, y_home :72, imageId :"blue_piece", uniqueId : "a9e1bda1-4122-45bf-b44a-aed5e480c9fd", homeIndex :14},
				        {piece:"blue", state :0, index : 14, x :503, y :118, x_home :503, y_home :118, imageId :"blue_piece", uniqueId :"d082c0f2-7fda-44b3-9409-e08acc1575a0", homeIndex :14},
				        {piece :"blue", state :0, index :14, x :600, y :118, x_home :600, y_home :118, imageId :"blue_piece", uniqueId :"f461039d-4fce-40b7-9ffe-941edf65275b", homeIndex :14},
				        {piece : "blue" , state :0, index :14, x :552, y :168, x_home :552, y_home :168, imageId :"blue_piece", uniqueId :"db947c8e-c8b4-4f8c-80bd-3698d0f8dfbf", homeIndex :14}],
				        diceObject :[{uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a",value : 0, playerName : null, selected : false},{uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        { piecesNames :["yellow","green"], playerName : null, hasRolled :false, index :1, playerMode :2, endOfPlay :0, playerIndex : 2, creator : false,
				        	pieces :[{ piece :"yellow", state :0, index :27, x :552, y :503, x_home :552, y_home :503, imageId :"yellow_piece", uniqueId :"2753916e-d3d6-4546-8edd-e52a9f67ca69", homeIndex:27},
				        	         { piece :"yellow", state :0, index :27, x :503, y :552, x_home :503, y_home :552, imageId :"yellow_piece", uniqueId :"7c22843d-7255-4672-b691-9a8db162d5ab", homeIndex :27},
				        	         { piece :"yellow", state :0, index :27, x :600, y :552, x_home :600, y_home :552, imageId :"yellow_piece", uniqueId :"38934697-64df-4c41-8431-55de32e11361", homeIndex :27},
				        	         { piece :"yellow", state :0, index :27, x :552, y :600, x_home :552, y_home :600, imageId :"yellow_piece", uniqueId :"7afc3d33-f2e2-4a3e-81e5-be11831250b6", homeIndex :27},
				        	         { piece :"green", state :0, index :40, x :118, y :503, x_home :118, y_home :503, imageId :"green_piece", uniqueId :"4ba566af-e1e8-4fa7-8492-51d89bc491d3", homeIndex :40},
				        	         { piece :"green", state :0, index :40, x :72, y :552, x_home :72, y_home :552, imageId :"green_piece", uniqueId :"dbfb79bf-30c6-433a-a2f4-d0dc059d08ec", homeIndex :40},
				        	         { piece :"green", state :0, index :40, x :168, y :552, x_home :168, y_home :552, imageId :"green_piece", uniqueId :"0cdbdbd8-dbbb-42aa-b723-69eea1ebbe86", homeIndex :40},
				        	         { piece :"green", state :0, index :40, x :118,  y :600, x_home :118, y_home :600, imageId :"green_piece", uniqueId :"313f6444-cc96-45b4-ae9f-3c9dfddff8a8", homeIndex :40}],
				        	         diceObject :[{uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a",value : 0, playerName : null, selected : false},{uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(twoPlayerGame);
}

function getFourPlayerGame(callback){
	var fourPlayerGame = {gameId :null, gameMode : 4, setSessionTurn : false, owner : false, howManyPlayersJoined : 0, gameEnded : false,
			diceIds :[{ uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f", value :0},{ uniqueId :"8c89ca63-6a54-4088-8957-9280732b957d", value :0}],
			players :[{ piecesNames :["red"], playerName : null, hasRolled :false, index :0, playerMode :4, endOfPlay :0, playerIndex : 1, creator : true,
				pieces :[{ piece :"red", state :0, index :1, x :118, y :72, x_home :118, y_home :72, imageId :"red_piece", uniqueId :"8fa049ea-336a-4211-8248-ced65b8fe3f0", homeIndex :1},
				         { piece :"red", state :0, index :1, x :72, y :118, x_home :72, y_home :118, imageId :"red_piece",uniqueId :"062258e6-dec1-459e-8484-c9f442195093", homeIndex :1},
				         { piece :"red", state :0, index :1, x :168, y :118, x_home :168, y_home :118, imageId :"red_piece", uniqueId :"a8ceb866-611f-4adc-9e74-0cc76a06ba9e", homeIndex :1},
				         { piece :"red", state :0, index :1, x :120, y :168, x_home :120, y_home :168, imageId :"red_piece", uniqueId :"305206ff-efb8-4abf-9b92-dc2425056270", homeIndex :1}],
				         diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				         { piecesNames :["blue"], playerName : null, hasRolled :false, index :1, playerMode :4, endOfPlay :0, playerIndex : 2, creator : false,
				        	 pieces :[{ piece :"blue", state :0, index :14, x :552, y :72, x_home :552, y_home :72, imageId :"blue_piece", uniqueId :"e4e6af75-b9ea-42b4-970a-d648d249fceb", homeIndex :14},
				        	          { piece :"blue", state :0, index :14, x :503, y :118, x_home :503, y_home :118, imageId :"blue_piece", uniqueId :"80eb50f3-1fec-45bb-9174-ad6f2522eda9", homeIndex :14},
				        	          { piece :"blue", state :0, index :14, x :600, y :118, x_home :600, y_home :118, imageId :"blue_piece", uniqueId :"92861a29-b37a-42b0-afc1-afe048182498", homeIndex :14},
				        	          { piece :"blue", state :0, index :14, x :552, y :168, x_home :552, y_home :168, imageId :"blue_piece", uniqueId :"38c6c1f9-6d04-4117-8434-aad907d49aa5", homeIndex :14}],
				        	          diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        	          { piecesNames :["yellow"], playerName : null, hasRolled :false, index :2, playerMode :4, endOfPlay :0, playerIndex : 3, creator : false,
				        	        	  pieces:[{ piece :"yellow", state :0, index :27, x :552, y :503, x_home :552, y_home :503, imageId :"yellow_piece", uniqueId :"659bb79b-7d05-48c6-80ec-c7129d96ac9c", homeIndex :27},
				        	        	          { piece :"yellow", state :0, index :27, x :503, y :552, x_home :503, y_home :552, imageId :"yellow_piece", uniqueId :"502bf906-49d4-4933-88ee-232076748573", homeIndex :27},
				        	        	          { piece :"yellow", state :0, index :27, x :600, y :552, x_home :600, y_home :552, imageId :"yellow_piece", uniqueId :"9dd7de72-4033-429c-9b70-9e7d00fd254d", homeIndex :27},
				        	        	          { piece :"yellow", state :0, index :27, x :552, y :600, x_home :552, y_home :600, imageId :"yellow_piece", uniqueId :"6924e88b-a7e3-4872-855a-746b0bbaa1f6", homeIndex :27}],
				        	        	          diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				        	        	          { piecesNames :["green"], playerName : null, hasRolled :false, index :3, playerMode :4, endOfPlay :0, playerIndex : 4, creator : false,
				        	        	        	  pieces :[{ piece :"green", state :0, index :40, x :118, y :503, x_home :118, y_home :503, imageId :"green_piece", uniqueId :"07f17e29-609b-4058-8f25-e07977e7dccf", homeIndex :40},
				        	        	        	           { piece :"green", state :0, index :40, x :72, y :552, x_home :72, y_home :552, imageId :"green_piece", uniqueId :"0a6d7022-2b7a-44da-b77e-781e59df61a0", homeIndex :40},
				        	        	        	           { piece :"green", state :0, index :40, x :168, y :552, x_home :168, y_home :552, imageId :"green_piece", uniqueId :"2a41f4b8-775e-4ab7-84c8-e4bbfa98eebf", homeIndex :40},
				        	        	        	           { piece :"green", state :0, index :40, x :118, y :600, x_home :118, y_home :600, imageId :"green_piece", uniqueId :"8730a218-f1dc-453b-9c5f-02b0d062358b", homeIndex :40}],
				        	        	        	           diceObject :[{uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f",value : 0, playerName : null, selected : false},{uniqueId : "8c89ca63-6a54-4088-8957-9280732b957d", value : 0, playerName : null, selected : false}], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(fourPlayerGame);
}