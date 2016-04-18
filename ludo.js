/**
 * 
 */
var io;
var gameSocket;
var parsedData;
var gameId;
var gameData = '{"gameId":"412b2a8d-a303-471a-8c26-bcba5ca50ba4","diceIds":[{"uniqueId":"551cb0ea-8f72-4edf-8cd2-aa5824a818b0","value":0},{"uniqueId":"e63124ca-eecf-4166-91a3-daf5db6a6e83","value":0}],"players":[{"piecesNames":["red","blue"],"playerName":"Player One","hasRolled":false,"index":0,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"red","state":0,"index":1,"x":118,"y":72,"x_home":118,"y_home":72,"imageId":"red_piece","uniqueId":"7d5dfd0c-4553-4a40-960f-cc0741751952","homeIndex":1},{"piece":"red","state":0,"index":1,"x":72,"y":118,"x_home":72,"y_home":118,"imageId":"red_piece","uniqueId":"15b8fb31-d4b8-453b-9fa5-0deb71c87bc2","homeIndex":1},{"piece":"red","state":0,"index":1,"x":168,"y":118,"x_home":168,"y_home":118,"imageId":"red_piece","uniqueId":"c3aed909-db1a-4b13-819e-560026d9d824","homeIndex":1},{"piece":"red","state":0,"index":1,"x":120,"y":168,"x_home":120,"y_home":168,"imageId":"red_piece","uniqueId":"1d589270-488f-4af7-9806-9367ae4a2431","homeIndex":1},{"piece":"blue","state":0,"index":14,"x":552,"y":72,"x_home":552,"y_home":72,"imageId":"blue_piece","uniqueId":"be26b859-dbbe-4eed-ba0b-1306063c61b4","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":503,"y":118,"x_home":503,"y_home":118,"imageId":"blue_piece","uniqueId":"843b1645-28cd-4b2b-9ac6-7876117c4777","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":600,"y":118,"x_home":600,"y_home":118,"imageId":"blue_piece","uniqueId":"c76b4c98-b011-4912-8654-150800cfff17","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":552,"y":168,"x_home":552,"y_home":168,"imageId":"blue_piece","uniqueId":"ad48fb91-4992-4471-9e51-169c1a051494","homeIndex":14}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["yellow","green"],"playerName":"Player Two","hasRolled":false,"index":1,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"yellow","state":0,"index":27,"x":552,"y":503,"x_home":552,"y_home":503,"imageId":"yellow_piece","uniqueId":"bdd4985a-b781-4b09-81bb-1277a9d55a19","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":503,"y":552,"x_home":503,"y_home":552,"imageId":"yellow_piece","uniqueId":"89f5b924-3790-493a-8b3d-dc5dcaf079df","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":600,"y":552,"x_home":600,"y_home":552,"imageId":"yellow_piece","uniqueId":"9851ae14-11f7-4e99-895b-a6aadad624f9","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":552,"y":600,"x_home":552,"y_home":600,"imageId":"yellow_piece","uniqueId":"175d4eb0-9b92-4193-b00c-2f140c0a9c9a","homeIndex":27},{"piece":"green","state":0,"index":40,"x":118,"y":503,"x_home":118,"y_home":503,"imageId":"green_piece","uniqueId":"4013297f-3733-4d59-88f1-ad16fedbbfe2","homeIndex":40},{"piece":"green","state":0,"index":40,"x":72,"y":552,"x_home":72,"y_home":552,"imageId":"green_piece","uniqueId":"faa02b62-2d7b-4a6b-8799-c438c12e8713","homeIndex":40},{"piece":"green","state":0,"index":40,"x":168,"y":552,"x_home":168,"y_home":552,"imageId":"green_piece","uniqueId":"4328f76b-9d6b-4dcb-8b29-b53115112669","homeIndex":40},{"piece":"green","state":0,"index":40,"x":118,"y":600,"x_home":118,"y_home":600,"imageId":"green_piece","uniqueId":"e3ddfea7-3838-4a00-88f7-f78b53af81f6","homeIndex":40}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]}]}';
var socketId;
var twoPlayerGame = '{"gameId":"b0b4feeb-3dff-4b48-9305-3ad8815253c3","diceIds":[{"uniqueId":"0fa40a32-8102-40be-85ae-595e7845d62a","value":0},{"uniqueId":"601b50bb-ed85-4323-8cfd-61262f924748","value":0}],"players":[{"piecesNames":["red","blue"],"playerName":"Player One","hasRolled":false,"index":0,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"red","state":0,"index":1,"x":118,"y":72,"x_home":118,"y_home":72,"imageId":"red_piece","uniqueId":"8d4329e4-bb84-4ef5-97ec-593669ff197c","homeIndex":1},{"piece":"red","state":0,"index":1,"x":72,"y":118,"x_home":72,"y_home":118,"imageId":"red_piece","uniqueId":"4324a6e0-b3b5-4c36-832a-d9eed25842dc","homeIndex":1},{"piece":"red","state":0,"index":1,"x":168,"y":118,"x_home":168,"y_home":118,"imageId":"red_piece","uniqueId":"e9833aec-d612-479f-836a-f33a62ee369a","homeIndex":1},{"piece":"red","state":0,"index":1,"x":120,"y":168,"x_home":120,"y_home":168,"imageId":"red_piece","uniqueId":"b4e8d1af-6c0e-4604-93da-7ba37c002906","homeIndex":1},{"piece":"blue","state":0,"index":14,"x":552,"y":72,"x_home":552,"y_home":72,"imageId":"blue_piece","uniqueId":"a9e1bda1-4122-45bf-b44a-aed5e480c9fd","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":503,"y":118,"x_home":503,"y_home":118,"imageId":"blue_piece","uniqueId":"d082c0f2-7fda-44b3-9409-e08acc1575a0","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":600,"y":118,"x_home":600,"y_home":118,"imageId":"blue_piece","uniqueId":"f461039d-4fce-40b7-9ffe-941edf65275b","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":552,"y":168,"x_home":552,"y_home":168,"imageId":"blue_piece","uniqueId":"db947c8e-c8b4-4f8c-80bd-3698d0f8dfbf","homeIndex":14}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["yellow","green"],"playerName":"Player Two","hasRolled":false,"index":1,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"yellow","state":0,"index":27,"x":552,"y":503,"x_home":552,"y_home":503,"imageId":"yellow_piece","uniqueId":"2753916e-d3d6-4546-8edd-e52a9f67ca69","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":503,"y":552,"x_home":503,"y_home":552,"imageId":"yellow_piece","uniqueId":"7c22843d-7255-4672-b691-9a8db162d5ab","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":600,"y":552,"x_home":600,"y_home":552,"imageId":"yellow_piece","uniqueId":"38934697-64df-4c41-8431-55de32e11361","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":552,"y":600,"x_home":552,"y_home":600,"imageId":"yellow_piece","uniqueId":"7afc3d33-f2e2-4a3e-81e5-be11831250b6","homeIndex":27},{"piece":"green","state":0,"index":40,"x":118,"y":503,"x_home":118,"y_home":503,"imageId":"green_piece","uniqueId":"4ba566af-e1e8-4fa7-8492-51d89bc491d3","homeIndex":40},{"piece":"green","state":0,"index":40,"x":72,"y":552,"x_home":72,"y_home":552,"imageId":"green_piece","uniqueId":"dbfb79bf-30c6-433a-a2f4-d0dc059d08ec","homeIndex":40},{"piece":"green","state":0,"index":40,"x":168,"y":552,"x_home":168,"y_home":552,"imageId":"green_piece","uniqueId":"0cdbdbd8-dbbb-42aa-b723-69eea1ebbe86","homeIndex":40},{"piece":"green","state":0,"index":40,"x":118,"y":600,"x_home":118,"y_home":600,"imageId":"green_piece","uniqueId":"313f6444-cc96-45b4-ae9f-3c9dfddff8a8","homeIndex":40}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]}]}';
var fourPlayerGame = '{"gameId":"73fc61e7-adb7-4243-b5fa-da37743febb2","diceIds":[{"uniqueId":"de55d5af-6cda-4ebf-80d7-8ae5f6f7698f","value":0},{"uniqueId":"8c89ca63-6a54-4088-8957-9280732b957d","value":0}],"players":[{"piecesNames":["red"],"playerName":"Player Red","hasRolled":false,"index":0,"playerMode":4,"endOfPlay":0,"pieces":[{"piece":"red","state":0,"index":1,"x":118,"y":72,"x_home":118,"y_home":72,"imageId":"red_piece","uniqueId":"8fa049ea-336a-4211-8248-ced65b8fe3f0","homeIndex":1},{"piece":"red","state":0,"index":1,"x":72,"y":118,"x_home":72,"y_home":118,"imageId":"red_piece","uniqueId":"062258e6-dec1-459e-8484-c9f442195093","homeIndex":1},{"piece":"red","state":0,"index":1,"x":168,"y":118,"x_home":168,"y_home":118,"imageId":"red_piece","uniqueId":"a8ceb866-611f-4adc-9e74-0cc76a06ba9e","homeIndex":1},{"piece":"red","state":0,"index":1,"x":120,"y":168,"x_home":120,"y_home":168,"imageId":"red_piece","uniqueId":"305206ff-efb8-4abf-9b92-dc2425056270","homeIndex":1}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["blue"],"playerName":"Player Blue","hasRolled":false,"index":1,"playerMode":4,"endOfPlay":0,"pieces":[{"piece":"blue","state":0,"index":14,"x":552,"y":72,"x_home":552,"y_home":72,"imageId":"blue_piece","uniqueId":"e4e6af75-b9ea-42b4-970a-d648d249fceb","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":503,"y":118,"x_home":503,"y_home":118,"imageId":"blue_piece","uniqueId":"80eb50f3-1fec-45bb-9174-ad6f2522eda9","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":600,"y":118,"x_home":600,"y_home":118,"imageId":"blue_piece","uniqueId":"92861a29-b37a-42b0-afc1-afe048182498","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":552,"y":168,"x_home":552,"y_home":168,"imageId":"blue_piece","uniqueId":"38c6c1f9-6d04-4117-8434-aad907d49aa5","homeIndex":14}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["yellow"],"playerName":"Player Yellow","hasRolled":false,"index":2,"playerMode":4,"endOfPlay":0,"pieces":[{"piece":"yellow","state":0,"index":27,"x":552,"y":503,"x_home":552,"y_home":503,"imageId":"yellow_piece","uniqueId":"659bb79b-7d05-48c6-80ec-c7129d96ac9c","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":503,"y":552,"x_home":503,"y_home":552,"imageId":"yellow_piece","uniqueId":"502bf906-49d4-4933-88ee-232076748573","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":600,"y":552,"x_home":600,"y_home":552,"imageId":"yellow_piece","uniqueId":"9dd7de72-4033-429c-9b70-9e7d00fd254d","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":552,"y":600,"x_home":552,"y_home":600,"imageId":"yellow_piece","uniqueId":"6924e88b-a7e3-4872-855a-746b0bbaa1f6","homeIndex":27}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["green"],"playerName":"Player Green","hasRolled":false,"index":3,"playerMode":4,"endOfPlay":0,"pieces":[{"piece":"green","state":0,"index":40,"x":118,"y":503,"x_home":118,"y_home":503,"imageId":"green_piece","uniqueId":"07f17e29-609b-4058-8f25-e07977e7dccf","homeIndex":40},{"piece":"green","state":0,"index":40,"x":72,"y":552,"x_home":72,"y_home":552,"imageId":"green_piece","uniqueId":"0a6d7022-2b7a-44da-b77e-781e59df61a0","homeIndex":40},{"piece":"green","state":0,"index":40,"x":168,"y":552,"x_home":168,"y_home":552,"imageId":"green_piece","uniqueId":"2a41f4b8-775e-4ab7-84c8-e4bbfa98eebf","homeIndex":40},{"piece":"green","state":0,"index":40,"x":118,"y":600,"x_home":118,"y_home":600,"imageId":"green_piece","uniqueId":"8730a218-f1dc-453b-9c5f-02b0d062358b","homeIndex":40}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]}]}';
var s;
var gameCodeStart = 1000;
var redisIsReady = false;
var redis = require('redis');
var client = redis.createClient("6379", "192.168.1.21"); 
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

var ludoPlayer = require('./LudoPlayer');
var joinMultiplayer = require('./JoinMultiplayerGame');

exports.initGame = function(gameio, socket){
	io = gameio;
	s = socket;

	gameSocket = socket;
	gameSocket.emit('connected', 'You are connected!');
	gameSocket.on('createNewGame', createNewGame);
	gameSocket.on('saveNewGame', saveNewGame);
	gameSocket.on('pieceSelection', pieceSelection);
	gameSocket.on('tryConnecting', tryConnecting);
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
	
	
	
	
	gameSocket.on('disconnect', disconnected);
};

function endOfGame(data){
	client.exists(data.gameId, function(err, reply) {
	    if (reply === 1) {
	        console.log('exists');
	        client.del(data.gameId, function(err, reply) {
	            console.log(reply);
	        });
	        
	    } else {
	        console.log('doesn\'t exist');
	    }
	});
};


function awaitingStartGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('awaitingStartGame', data);
};

function startGame(data){
	var sock = this;
	sock.broadcast.to(data.gameId).emit('startGame', data);
};

function pieceSelection(pieceSelectionObject){
	var sock = this;
	sock.broadcast.to(pieceSelectionObject.gameId).emit('pieceSelection', pieceSelectionObject.uniqueId);
};


function createTwoPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim();
	var status = false;
	
	client.get('twoplayer', function(err, data) {
	
		if (data != null){
			ludoPlayer.LudoPlayer(gameId, screenName, data, function (augmentedData){
				console.log(augmentedData.gameId + ' ' + sock.id );
				console.log('GameId: ' + augmentedData.gameId + ' ScreenName: ' + screenName);
				
				augmentedData.ok = true;
				augmentedData.message = "OK";
				
				var ludoGameData = JSON.stringify(augmentedData);
				client.set(augmentedData.gameId, ludoGameData, function(err, reply) {
						  
					console.log(reply); 
					if (reply === 'OK'){ 
						status = true;
						sock.join(gameId);
						client.set(sock.id, JSON.stringify({gameId : gameId,  s : false, screenName : screenName}), function(err, reply) { 
							console.log('saving socket id' + reply);
						});
						callback(augmentedData);
					} 
					else	  
					{ 
						augmentedData.ok = false;	  
						augmentedData.message = "Unknown Error! Game cannot be resaved";
						callback(augmentedData);
					}
				});
			});
		}else{
			callback({
				ok : status, 
				gameId : gameId,
				screenName : null, 
				whoJoined : null,
				complete : false,
				message : "Unknown Error! Game cannot be created"
			});
		}
	});
};

function createFourPlayerMultiplayerGame(preparedData, callback){
	var sock = this;
	var gameId = randomString(5);
	var screenName = preparedData.screenName.toString().trim();
	var status = false;
	
	client.get('fourplayer', function(err, data) {
	
		if (data != null){
			
			ludoPlayer.LudoPlayer(gameId, screenName, data, function (augmentedData){
				console.log(augmentedData.gameId + ' ' + sock.id );
				console.log('GameId: ' + augmentedData.gameId + ' ScreenName: ' + screenName);
				
				augmentedData.ok = true;
				augmentedData.message = "OK";
				
				var ludoGameData = JSON.stringify(augmentedData);
				client.set(augmentedData.gameId, ludoGameData, function(err, reply) {
						  
					console.log(reply); 
					if (reply === 'OK'){ 
						status = true;
						sock.join(gameId);
						client.set(sock.id, JSON.stringify({gameId : gameId, s : true, screenName : screenName}), function(err, reply) { 
							console.log('saving socket id' + reply);
						});  
						callback(augmentedData);
					} 
					else	  
					{ 
						augmentedData.ok = false;	  
						augmentedData.message = "Unknown Error! Game cannot be resaved";
						callback(augmentedData);
					}
				});
				
			});
		}else{
			
			callback({
				ok : status, 
				gameId : gameId,
				screenName : null, 
				whoJoined : null,
				complete : false,
				message : "Unknown Error! Game cannot be created"
			});
		}
		
	});
};


function connectMultiplayerGame(playerInfo, callback){
	var sock = this;
	client.get(playerInfo.gameId, function(err, data) {
		if (data != null)
		{
			joinMultiplayer.JoinMultiplayerGame(data, playerInfo.screenName, function (augmentedData){
				
				if (augmentedData != null)
				{
					
					console.log(augmentedData.gameId + ' ' + sock.id );
					sock.join(playerInfo.gameId);
					
					client.set(sock.id, JSON.stringify({gameId : playerInfo.gameId, s : true, screenName : playerInfo.screenName}), function(err, reply) {
						  console.log('saving socket id' + reply);
					  });
					
					if (augmentedData.complete)
					{
						
							augmentedData.ok = true;
							augmentedData.message = "Starting game...";
							var ludoGameData = JSON.stringify(augmentedData);
							client.set(playerInfo.gameId, ludoGameData, function(err, reply) {
							
							});
							callback(augmentedData);
					}
					else
					{
						
						augmentedData.ok = true;
						augmentedData.message = "Waiting for other players";
						var ludoGameData = JSON.stringify(augmentedData);
						client.set(playerInfo.gameId, ludoGameData, function(err, reply) {
							  console.log('Saving back game' + reply);
							  if (reply === 'OK')
							  {
								  callback(augmentedData);
							  }
							  else
							  {
								  augmentedData.ok = false;
								  augmentedData.message = "Game id has been deleted or corrupted";
								  callback(augmentedData);
							  }
						});
					}
				}
				else
				{
					callback({
						ok : false, 
						message : "Error connecting! Game is full"
							
					});
				}
			});
		}
		else
		{
			callback({
				ok : false, 
				message : "Game id does not exist"
				
			});
		}
	    
	});
	
};




function createNewGame(preparedData, callback){
	gameData = preparedData.gameData;
	socketId = this.id;
	gameId = preparedData.gameId;
	console.log('GameId: ' + gameId + ' GameData: ' + gameData);
	var status = true;
	if (redisIsReady){
		
		
		client.set(preparedData.gameId, preparedData.gameData, function(err, reply) {
			  console.log(reply);
			  if (reply == 'OK'){
				  status = true;
			  }
		});
		
	}
	
	if (status){
		console.log(gameId + ' ' + socketId );
		this.join(gameId.toString());
	}
	callback({ok : status, gameId : gameId});
};



function tryConnecting(data, callback){
	var sock = this;
	
	client.get(data.gameId, function(err, gameData) {
	    console.log(gameData);
	    if (gameData === null){
	    	callback({ok : false, gameData : gameData});
	    }else{
	    	sock.join(data.gameId);
	    	callback({ok : true, gameData : gameData});
	    }
	    	
	 	sock.emit('conn', 'connected');
	});
	
	console.log('user is attempting to connect');
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


function disconnected(){
	var sock = this;
	client.get(sock.id, function(err, data) {
		if (data != null){
			var userDetails = JSON.parse(data);
			var screenName = userDetails.screenName;
			var gameId = userDetails.gameId;
			console.log('user ' + screenName + ' has disconnected with id ' + gameId);
			disconnectedHandler(gameId, sock.id);
			sock.broadcast.to(gameId).emit('disconnected', screenName + ' has disconnected');
		}else{
			console.log('diconnection error');
		}
		
	});
};

function disconnectedHandler(gameId, socketId){

	client.get(gameId, function(err, data) {
		if (data != null){
			var gameData = JSON.parse(data);
			var whoJoined = gameData.whoJoined;
			--whoJoined;
			if (whoJoined === 0){
				
				client.exists(gameId, function(err, reply) {
				    if (reply === 1) {
				        console.log(gameId + ' exists');
				        client.del(gameId, function(err, reply) {
				            console.log('delected gameId? ' + reply);
				        });
				        
				    } 
				    else {
				        console.log(gameId + ' does NOT exist');
				    }
				});
				
				
				client.exists(socketId, function(err, reply) {
				    if (reply === 1) {
				        console.log(socketId + ' exists');
				        client.del(socketId, function(err, reply) {
				            console.log('delected socket id? ' + reply);
				        });
				        
				    } 
				    else {
				        console.log(socketId + ' does NOT exist');
				    }
				});
				
			}else{
				
				client.exists(socketId, function(err, reply) {
				    if (reply === 1) {
				        console.log(socketId + ' exists');
				        client.del(socketId, function(err, reply) {
				            console.log('delected socket id ?' + reply);
				        });
				    } 
				    else {
				        console.log(socketId + ' doesn\'t exist');
				    }
				});
				
				gameData.whoJoined = whoJoined;
				var preparedData = JSON.stringify(gameData);
				client.set(gameId, preparedData, function(err, reply) {
					console.log('One user still active ' + reply);
				});
				
				
			}
			
		}else{
			console.log('diconnection error');
		}
		
	});
};

function saveNewGame(data){
	var sock = this;
	console.log(data.data);
	
	if (data.gameId === undefined ||  data.gameId === null){
		sock.emit('saveNewGame', 'Game ID: ' + data.gameId + ' Not Saved!!!');
		return;
	}
	client.set(data.gameId, data.data, function(err, reply) {
		  console.log(reply);
		  if (reply == 'OK'){
			  sock.emit('saveNewGame', 'Game Saved Successfully');
		  }else{
			  sock.emit('saveNewGame', 'Game Not Saved!!!');
		  }
	});
};

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



