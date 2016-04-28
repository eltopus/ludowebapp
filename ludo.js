/**
 * 
 */
var io;
var gameSocket;
var redisIsReady = false;
var games = [];
var socketIds = [];

var redis = require('redis');
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
};

function releaseGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('releaseGame', data);
};


function emitNextPlayer(nextPlayerObject){
	var sock = this;
	var gameId = nextPlayerObject.gameId;
	var playerName = nextPlayerObject.playerName;
	
	//console.log('gameId: ' + gameId + ' playerName: ' + playerName + ' sockId: ' + sock.id);
	
};

function nextTurn(data){
	
};

function endOfGame(data){
	
};


function awaitingStartGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('awaitingStartGame', data);
	
};

function startGame(gameId, callback){
	var sock = this;
	var gameData = games[gameId.toString()].gameData;
	sock.broadcast.to(gameId).emit('startGame', gameData);
	callback(gameData);
};

function pieceSelection(pieceSelectionObject){
	var sock = this;
	sock.broadcast.to(pieceSelectionObject.gameId).emit('pieceSelection', pieceSelectionObject.uniqueId);
};


function createTwoPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim().toUpperCase();
	getTwoPlayerGame(function(twoPlayer){
		twoPlayer.ok = true;
		twoPlayer.message = 'OK';
		twoPlayer.complete = false;
		var ludoInstance = new ludoGameInstance(gameId, sock.id, screenName, twoPlayer);
		games[gameId] = ludoInstance;
		socketIds[sock.id] = {gameId : gameId, screenName : screenName};
		callback(ludoInstance.gameData);
	});
	this.join(gameId.toString());
};

function connectMultiplayerGame(newPlayer, callback){
	var sock = this;
	var screenName = newPlayer.screenName.toString().trim().toUpperCase();
	if (games[newPlayer.gameId]){
		
		var data = games[newPlayer.gameId].addPlayer(newPlayer.gameId, sock.id, screenName);
		var gameData = data.gameData;
		var updatedScreenName = data.screenName;
		if (gameData === null){
			callback({ok : false, message : "Error!!! Game ID: " + newPlayer.gameId + " may be full"});
		}else{
			socketIds[sock.id] = {gameId : newPlayer.gameId, screenName : updatedScreenName};
			sock.broadcast.to(newPlayer.gameId).emit('awaitingStartGame', gameData);
			this.join(newPlayer.gameId.toString());
			callback(gameData);
		}
		
	}else{
		callback({ok : false, message : "Game Id " + newPlayer.gameId + " does not exist" });
	}
	
	
	
	
	
};

function createFourPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim().toUpperCase();
	
	getFourPlayerGame(function(fourPlayer){
		fourPlayer.ok = true;
		fourPlayer.message = 'OK';
		fourPlayer.complete = false;
		var ludoInstance = new ludoGameInstance(gameId, sock.id, screenName, fourPlayer);
		games[gameId] = ludoInstance;
		socketIds[sock.id] = {gameId : gameId, screenName : screenName};
		callback(ludoInstance.gameData);
	});
	this.join(gameId.toString());
};



function diceSelection(diceObject){
	var sock = this;
	sock.broadcast.to(diceObject.gameId).emit('diceSelection', diceObject);

};

function piecePosition(pieceObject){
	var sock = this;
	//console.log('Piece: ' + pieceObject.uniqueId + ' x: ' + pieceObject.x + ' y: ' + pieceObject.y);
	sock.broadcast.emit('piecePosition', pieceObject);

};

function diceUnSelection(diceObject){
	var sock = this;
	sock.broadcast.to(diceObject.gameId).emit('diceUnSelection', diceObject);
};


function diceRoll(diceObject){
	var sock = this;
	sock.broadcast.to(diceObject.gameId).emit('diceRoll', diceObject);
	

};

function emitPlay(playerObject){
	var sock = this;
	sock.broadcast.to(playerObject.gameId).emit('play', playerObject);

};


function disconnected(data){
	var sock = this;
	
	if (socketIds[sock.id]){
		var gameId = socketIds[sock.id].gameId;
		var screenName = socketIds[sock.id].screenName;
		
		if (gameId){
			var game = games[gameId];
			if (game){
				game.removePlayer(screenName);
				_.without(socketIds, sock.id);
				if (game.isEmpty()){
					console.log('Game is empty. Deleting ' + gameId);
					_.without(games, gameId);
				}else{
					sock.broadcast.to(gameId).emit('disconnected', screenName + ' has disconnected');
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
		
};


function saveNewGame(data){
	
};

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};



function getTwoPlayerGame(callback) {
	var twoPlayerGame = {gameId: null, gameMode : 2,
			diceIds:[{ uniqueId :"0fa40a32-8102-40be-85ae-595e7845d62a", value: 0 }, {uniqueId :"601b50bb-ed85-4323-8cfd-61262f924748", value : 0}],
				players :[{ piecesNames :["red","blue"], playerName : null, hasRolled :false, index : 0, playerMode : 2, endOfPlay : 0,
					pieces:[{piece :"red", state : 0, index : 1, x :118, y:72, x_home:118, y_home:72, imageId:"red_piece", uniqueId :"8d4329e4-bb84-4ef5-97ec-593669ff197c", homeIndex:1 },
					        {piece:"red",state:0,index:1,x:72,y:118,x_home :72,y_home :118, imageId :"red_piece",uniqueId :"4324a6e0-b3b5-4c36-832a-d9eed25842dc",homeIndex :1 },
					        {piece:"red",state:0, index:1, x:168, y:118, x_home:168, y_home:118,imageId : "red_piece",uniqueId :"e9833aec-d612-479f-836a-f33a62ee369a", homeIndex :1},
					        {piece :"red", state :0, index :1, x :120, y :168, x_home :120, y_home :168, imageId :"red_piece", uniqueId :"b4e8d1af-6c0e-4604-93da-7ba37c002906", homeIndex :1},
					        {piece:"blue", state :0, index :14, x :552, y :72, x_home :552, y_home :72, imageId :"blue_piece", uniqueId : "a9e1bda1-4122-45bf-b44a-aed5e480c9fd", homeIndex :14},
					        {piece:"blue", state :0, index : 14, x :503, y :118, x_home :503, y_home :118, imageId :"blue_piece", uniqueId :"d082c0f2-7fda-44b3-9409-e08acc1575a0", homeIndex :14},
					        {piece :"blue", state :0, index :14, x :600, y :118, x_home :600, y_home :118, imageId :"blue_piece", uniqueId :"f461039d-4fce-40b7-9ffe-941edf65275b", homeIndex :14},
					        {piece : "blue" , state :0, index :14, x :552, y :168, x_home :552, y_home :168, imageId :"blue_piece", uniqueId :"db947c8e-c8b4-4f8c-80bd-3698d0f8dfbf", homeIndex :14}],
					         diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
					         { piecesNames :["yellow","green"], playerName : null, hasRolled :false, index :1, playerMode :2, endOfPlay :0, 
					pieces :[{ piece :"yellow", state :0, index :27, x :552, y :503, x_home :552, y_home :503, imageId :"yellow_piece", uniqueId :"2753916e-d3d6-4546-8edd-e52a9f67ca69", homeIndex:27},
					         { piece :"yellow", state :0, index :27, x :503, y :552, x_home :503, y_home :552, imageId :"yellow_piece", uniqueId :"7c22843d-7255-4672-b691-9a8db162d5ab", homeIndex :27},
					         { piece :"yellow", state :0, index :27, x :600, y :552, x_home :600, y_home :552, imageId :"yellow_piece", uniqueId :"38934697-64df-4c41-8431-55de32e11361", homeIndex :27},
					         { piece :"yellow", state :0, index :27, x :552, y :600, x_home :552, y_home :600, imageId :"yellow_piece", uniqueId :"7afc3d33-f2e2-4a3e-81e5-be11831250b6", homeIndex :27},
					         { piece :"green", state :0, index :40, x :118, y :503, x_home :118, y_home :503, imageId :"green_piece", uniqueId :"4ba566af-e1e8-4fa7-8492-51d89bc491d3", homeIndex :40},
					         { piece :"green", state :0, index :40, x :72, y :552, x_home :72, y_home :552, imageId :"green_piece", uniqueId :"dbfb79bf-30c6-433a-a2f4-d0dc059d08ec", homeIndex :40},
					         { piece :"green", state :0, index :40, x :168, y :552, x_home :168, y_home :552, imageId :"green_piece", uniqueId :"0cdbdbd8-dbbb-42aa-b723-69eea1ebbe86", homeIndex :40},
					         { piece :"green", state :0, index :40, x :118,  y :600, x_home :118, y_home :600, imageId :"green_piece", uniqueId :"313f6444-cc96-45b4-ae9f-3c9dfddff8a8", homeIndex :40}],
					          diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(twoPlayerGame);
};

function getFourPlayerGame(callback){
	var fourPlayerGame = {gameId :null, gameMode : 4, 
			diceIds :[{ uniqueId :"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f", value :0},{ uniqueId :"8c89ca63-6a54-4088-8957-9280732b957d", value :0}],
			 players :[{ piecesNames :["red"], playerName : null, hasRolled :false, index :0, playerMode :4, endOfPlay :0, 
				 pieces :[{ piece :"red", state :0, index :1, x :118, y :72, x_home :118, y_home :72, imageId :"red_piece", uniqueId :"8fa049ea-336a-4211-8248-ced65b8fe3f0", homeIndex :1},
				          { piece :"red", state :0, index :1, x :72, y :118, x_home :72, y_home :118, imageId :"red_piece",uniqueId :"062258e6-dec1-459e-8484-c9f442195093", homeIndex :1},
				          { piece :"red", state :0, index :1, x :168, y :118, x_home :168, y_home :118, imageId :"red_piece", uniqueId :"a8ceb866-611f-4adc-9e74-0cc76a06ba9e", homeIndex :1},
				          { piece :"red", state :0, index :1, x :120, y :168, x_home :120, y_home :168, imageId :"red_piece", uniqueId :"305206ff-efb8-4abf-9b92-dc2425056270", homeIndex :1}],
				           diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				           { piecesNames :["blue"], playerName : null, hasRolled :false, index :1, playerMode :4, endOfPlay :0,
				  pieces :[{ piece :"blue", state :0, index :14, x :552, y :72, x_home :552, y_home :72, imageId :"blue_piece", uniqueId :"e4e6af75-b9ea-42b4-970a-d648d249fceb", homeIndex :14},
				           { piece :"blue", state :0, index :14, x :503, y :118, x_home :503, y_home :118, imageId :"blue_piece", uniqueId :"80eb50f3-1fec-45bb-9174-ad6f2522eda9", homeIndex :14},
				           { piece :"blue", state :0, index :14, x :600, y :118, x_home :600, y_home :118, imageId :"blue_piece", uniqueId :"92861a29-b37a-42b0-afc1-afe048182498", homeIndex :14},
				           { piece :"blue", state :0, index :14, x :552, y :168, x_home :552, y_home :168, imageId :"blue_piece", uniqueId :"38c6c1f9-6d04-4117-8434-aad907d49aa5", homeIndex :14}],
				            diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				            { piecesNames :["yellow"], playerName : null, hasRolled :false, index :2, playerMode :4, endOfPlay :0, 
				  pieces:[{ piece :"yellow", state :0, index :27, x :552, y :503, x_home :552, y_home :503, imageId :"yellow_piece", uniqueId :"659bb79b-7d05-48c6-80ec-c7129d96ac9c", homeIndex :27},
				          { piece :"yellow", state :0, index :27, x :503, y :552, x_home :503, y_home :552, imageId :"yellow_piece", uniqueId :"502bf906-49d4-4933-88ee-232076748573", homeIndex :27},
				          { piece :"yellow", state :0, index :27, x :600, y :552, x_home :600, y_home :552, imageId :"yellow_piece", uniqueId :"9dd7de72-4033-429c-9b70-9e7d00fd254d", homeIndex :27},
				          { piece :"yellow", state :0, index :27, x :552, y :600, x_home :552, y_home :600, imageId :"yellow_piece", uniqueId :"6924e88b-a7e3-4872-855a-746b0bbaa1f6", homeIndex :27}],
				           diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]},
				           { piecesNames :["green"], playerName : null, hasRolled :false, index :3, playerMode :4, endOfPlay :0,
				   pieces :[{ piece :"green", state :0, index :40, x :118, y :503, x_home :118, y_home :503, imageId :"green_piece", uniqueId :"07f17e29-609b-4058-8f25-e07977e7dccf", homeIndex :40},
				            { piece :"green", state :0, index :40, x :72, y :552, x_home :72, y_home :552, imageId :"green_piece", uniqueId :"0a6d7022-2b7a-44da-b77e-781e59df61a0", homeIndex :40},
				            { piece :"green", state :0, index :40, x :168, y :552, x_home :168, y_home :552, imageId :"green_piece", uniqueId :"2a41f4b8-775e-4ab7-84c8-e4bbfa98eebf", homeIndex :40},
				            { piece :"green", state :0, index :40, x :118, y :600, x_home :118, y_home :600, imageId :"green_piece", uniqueId :"8730a218-f1dc-453b-9c5f-02b0d062358b", homeIndex :40}],
				             diceObject :[], turn :false, selectedPieceId :null, exitingGraphicsPositions :[740,780,820,860]}]};
	callback(fourPlayerGame);
}



