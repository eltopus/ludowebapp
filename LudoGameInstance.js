var playerInstance = require('./LudoPlayerInstance');
var _ = require('underscore');
var diceObjects = [];

var diceValue = function(frame){

	switch(frame) {
	case 0:
		return 6;
	case 1:
		return 1;
	case 2:
		return 2;
	case 4:
		return 5;
	case 5:
		return 3;
	case 6:
		return 4;
	default:
		return 0;
	}
};

function LudoGameInstance(gameId, socketId, screenName, gameData, colors, newGame, callback) {

	this.colorsOptions = ["red", "blue", "yellow", "green"];
	this.disconnectedPlayers = [];
	this.date = new Date();
	this.ludoPlayers = [];
	this.screenNames = [];
	this.notifyEndOfPlay = [];
	this.numOfPlayers = 0;
	this.inBackground = [];
	this.playerWentInBackground = false;
	this.gameInProgress = false;
	this.screenName = screenName;
	this.gameMode = gameData.gameMode;
	this.currentPlayerName = "";
	this.initialGamaData = null;
	this.initialCurrentPlayerName = screenName;
	this.restartRequests = 0;

	this.gameEnded = false;
	this.choicesLeft = null;

	if (newGame){

		this.redPieces = [{piece :"red", state : 0, index : 1, x :118, y:72, x_home:118, y_home:72, 
			imageId:"red_piece", uniqueId :"8d4329e4-bb84-4ef5-97ec-593669ff197c", homeIndex:1 },
			{piece:"red",state:0,index:1,x:72,y:118,x_home :72,y_home :118, 
				imageId :"red_piece",uniqueId :"4324a6e0-b3b5-4c36-832a-d9eed25842dc",homeIndex :1 },
				{piece:"red",state:0, index:1, x:168, y:118, x_home:168, y_home:118,
					imageId : "red_piece",uniqueId :"e9833aec-d612-479f-836a-f33a62ee369a", homeIndex :1},
					{piece :"red", state :0, index :1, x :120, y :168, x_home :120, y_home :168, 
						imageId :"red_piece", uniqueId :"b4e8d1af-6c0e-4604-93da-7ba37c002906", homeIndex :1}];

		this.bluePieces = [{piece:"blue", state :0, index :14, x :552, y :72, x_home :552, y_home :72, imageId :"blue_piece", 
			uniqueId : "a9e1bda1-4122-45bf-b44a-aed5e480c9fd", homeIndex :14},
			{piece:"blue", state :0, index : 14, x :503, y :118, x_home :503, y_home :118, 
				imageId :"blue_piece", uniqueId :"d082c0f2-7fda-44b3-9409-e08acc1575a0", homeIndex :14},
				{piece :"blue", state :0, index :14, x :600, y :118, x_home :600, y_home :118, 
					imageId :"blue_piece", uniqueId :"f461039d-4fce-40b7-9ffe-941edf65275b", homeIndex :14},
					{piece : "blue" , state :0, index :14, x :552, y :168, x_home :552, y_home :168, 
						imageId :"blue_piece", uniqueId :"db947c8e-c8b4-4f8c-80bd-3698d0f8dfbf", homeIndex :14}];


		this.yellowPieces = [{ piece :"yellow", state :0, index :27, x :552, y :503, x_home :552, y_home :503, 
			imageId :"yellow_piece", uniqueId :"2753916e-d3d6-4546-8edd-e52a9f67ca69", homeIndex:27},
			{ piece :"yellow", state :0, index :27, x :503, y :552, x_home :503, y_home :552, 
				imageId :"yellow_piece", uniqueId :"7c22843d-7255-4672-b691-9a8db162d5ab", homeIndex :27},
				{ piece :"yellow", state :0, index :27, x :600, y :552, x_home :600, y_home :552, 
					imageId :"yellow_piece", uniqueId :"38934697-64df-4c41-8431-55de32e11361", homeIndex :27},
					{ piece :"yellow", state :0, index :27, x :552, y :600, x_home :552, y_home :600, 
						imageId :"yellow_piece", uniqueId :"7afc3d33-f2e2-4a3e-81e5-be11831250b6", homeIndex :27}];


		this.greenPieces = [{ piece :"green", state :0, index :40, x :118, y :503, x_home :118, y_home :503, 
			imageId :"green_piece", uniqueId :"4ba566af-e1e8-4fa7-8492-51d89bc491d3", homeIndex :40},
			{ piece :"green", state :0, index :40, x :72, y :552, x_home :72, y_home :552, 
				imageId :"green_piece", uniqueId :"dbfb79bf-30c6-433a-a2f4-d0dc059d08ec", homeIndex :40},
				{ piece :"green", state :0, index :40, x :168, y :552, x_home :168, y_home :552, 
					imageId :"green_piece", uniqueId :"0cdbdbd8-dbbb-42aa-b723-69eea1ebbe86", homeIndex :40},
					{ piece :"green", state :0, index :40, x :118,  y :600, x_home :118, y_home :600, 
						imageId :"green_piece", uniqueId :"313f6444-cc96-45b4-ae9f-3c9dfddff8a8", homeIndex :40}];


		++this.numOfPlayers;
		this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, gameData, this.numOfPlayers, true, true);
		this.gameData = this.ludoPlayers[screenName].gameData;
		this.ludoPlayers[screenName].deleteGameData();

		if (colors !== null){
			var playerPieces = this.getPlayerPieces(colors);
			this.addPlayerPieces(screenName, playerPieces, colors);
		}

		this.screenNames.push(screenName);
		this.currentPlayerName = screenName;
		this.gameData.screenNames = this.screenNames;
		if (this.gameMode === 4){
			//console.log("BEFORE Shuffling " + this.colorsOptions);
			this.reshuffleColors(colors);
		}

		callback(this);

	}else{

		gameData.howManyPlayersJoined = 0;
		this.screenNames = gameData.screenNames;
		var currentPlayerName  = '';
		var disconnectedPlayers = this.disconnectedPlayers;

		this.gameData = gameData;
		

		_.any(this.gameData.players, function(player){
			var disconnetedPlayer = {};
			disconnetedPlayer.screenName = player.playerName;
			if (player.turn){
				currentPlayerName = player.playerName;
			}

			disconnetedPlayer.index = player.playerIndex;
			disconnetedPlayer.isOwner = player.creator;	
			disconnetedPlayer.turn = player.turn;
			disconnectedPlayers.push(disconnetedPlayer);

		});
		
		this.currentPlayerName = currentPlayerName;
		console.log("Current Name is : " + this.currentPlayerName);
		
		this.gameInProgress = true;
		//console.log("Disconnection: " + JSON.stringify(this.disconnectedPlayers));
		//console.log("ScreenNames: " + JSON.stringify(this.screenNames));
		
		for (var j = 0; j < this.screenNames.length; ++j){
			console.log("Creating player account for: " + this.screenNames[j]);
			this.addPlayerFromDB(this.screenNames[j], gameId);
		}
		this.initialGamaData = JSON.stringify(gameData);
		this.initialCurrentPlayerName = currentPlayerName;
		callback(this);

	}

}

LudoGameInstance.prototype.getUpdatedGameData = function(callback) {
	callback({gameData : this.gameData, screenName  : this.currentPlayerName});
};

LudoGameInstance.prototype.updateRestartRequests = function(callback) {
	++this.restartRequests;
	if (this.restartRequests >= this.gameMode){
		this.restartRequests = 0;
		this.restartGame(function(data){
			return callback(data);
		});
	}
	callback(null);
};


LudoGameInstance.prototype.restartGame = function(callback) {
	this.currentPlayerName = this.initialCurrentPlayerName;
	//console.log("Original: " + this.currentPlayerName + " GameData: " + JSON.stringify(this.gameData));
	this.gameData = JSON.parse(this.initialGamaData);
	this.notifyEndOfPlay = [];
	this.gameData.inprogress = true;
	//this.gameData.screenName = this.currentPlayerName;
	callback({gameData : this.gameData, screenName : this.currentPlayerName});
};


LudoGameInstance.prototype.addAdminPlayer = function(screenName, callback) {

	if (this.gameInProgress){
		this.gameData.screenName = 'ADMIN';
		callback(this.gameData);

	}else{
		callback(null);
	}

};

LudoGameInstance.prototype.reshuffleColors = function(colors) {

	var color = colors[0];
	switch(color){
	case "red":
		this.colorsOptions = ["blue", "yellow", "green"];
		break;
	case "blue":
		this.colorsOptions = ["yellow", "green", "red"];
		break;
	case "yellow":
		this.colorsOptions = ["green", "red", "blue"];
		break;
	case "green":
		this.colorsOptions = ["red", "blue", "yellow"];
		break;
	}

	//console.log("AFTER Shuffling " + this.colorsOptions);

};


LudoGameInstance.prototype.addPlayerFromDB = function(screenName, gameId) {
	
	for (var i = 0; i < this.disconnectedPlayers.length; ++i)
	{
		if (this.disconnectedPlayers[i].screenName === screenName)
		{
			var index = this.disconnectedPlayers[i].index;
			var owner = this.disconnectedPlayers[i].isOwner;
			console.log("Creating account for : " + screenName + " index: " + index + " owner: " + owner);
			this.ludoPlayers[screenName] = new playerInstance(gameId, null, screenName, this.gameData, index , owner, false);
		}
	}
	
	
};


LudoGameInstance.prototype.addPlayer = function(gameId, socketId, screenName, fromDB, callback) {

	if (this.isNotFull()) 
	{

		if (this.gameInProgress || this.playerWasDisconnected(screenName))
		{

			var screenameExists = false;
			for (var i = 0; i < this.disconnectedPlayers.length; ++i)
			{
				if (this.disconnectedPlayers[i].screenName === screenName)
				{
					var owner = this.disconnectedPlayers[i].isOwner;
					screenameExists = true;
					//replaces disconnected player index turn
					this.gameData.setSessionTurn = this.getNextPlayerTurn(screenName);

					//console.log("Setting screenName: " + screenName + " Turn to " + this.gameData.setSessionTurn);

					++this.numOfPlayers;
					if (this.numOfPlayers === this.gameMode){
						this.gameData.complete = true;
					}

					this.ludoPlayers[screenName].connected();
					this.ludoPlayers[screenName].inFocus();
					
					this.disconnectedPlayers.splice(i, 1);
					this.gameData.howManyPlayersJoined  = this.numOfPlayers;

					callback({gameData : this.gameData, screenName: screenName, ok : true, owner : owner});
					return {};
				}
			}

			if (!screenameExists){
				callback({gameData : this.gameData, screenName: screenName, ok : false, availableScreenNames : this.disconnectedPlayers});
			}

		}else
		{

			var colorsLeft = null;
			var playerPieces = null;
			screenName = this.validateScreenName(screenName);
			this.screenNames.push(screenName);
			++this.numOfPlayers;
			this.gameData.setSessionTurn = false;
			this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, this.gameData, this.numOfPlayers, false, true);
			this.gameData = this.ludoPlayers[screenName].gameData;
			this.ludoPlayers[screenName].deleteGameData();
			
			
			
			
			if (this.gameMode === 2){
				colorsLeft = this.colorsOptions;
				playerPieces = this.getPlayerPieces(this.colorsOptions);
				this.addPlayerPieces(screenName , playerPieces, colorsLeft);
				//console.log(JSON.stringify(this.gameData));
			}
			else if (this.gameMode === 4 && this.colorsOptions.length > 0){
				
				
				colorsLeft = [];
				colorsLeft.push(this.colorsOptions[0]);
				playerPieces = this.getPlayerPieces(colorsLeft);
				this.addPlayerPieces(screenName , playerPieces, colorsLeft);
				//console.log("Color Options: " + this.colorsOptions);
				//console.log(JSON.stringify(this.gameData));
			}
			
			if (this.numOfPlayers === this.gameMode){
				this.gameData.complete = true;
				this.gameInProgress = true;
				this.gameData.complete = true;
				this.initialGamaData = JSON.stringify(this.gameData);
			}

			this.gameData.howManyPlayersJoined  = this.numOfPlayers;
			this.gameData.screenNames = this.screenNames;
			callback({gameData : this.gameData, screenName: screenName, ok : true});
		}

	}else{
		callback(null);
	}

};



LudoGameInstance.prototype.getNextSocketId = function(previousPlayer, callback){

	var currentPlayerName  = previousPlayer.screenName;
	var currentPlayer = this.ludoPlayers[currentPlayerName];
	if (currentPlayer)
	{
		var size = this.updateNotifyEndOfPlay(currentPlayerName);
		var index = (currentPlayer.index % this.gameMode) + 1;


		for (var key in this.ludoPlayers){

			if (this.ludoPlayers[key].index === index){
				currentPlayerName = key;
				//console.log('Found Player still in the game: ' + currentPlayerName);
			}

			/**
			 * This is a condition where next player is disconnected and it is his turn
			 */
			if (!this.ludoPlayers[key].isConnected()){
				console.log('It appears: ' + currentPlayerName + ' has been disconnected');
				size = this.updateNotifyEndOfPlay(currentPlayerName);
			}

			/**
			 * This is a condition where player on mobile device is connected
			 * but out of focus. Since he won't get any update, add player name as
			 * if he completed his turn
			 */
			if (this.ludoPlayers[key].isConnected() && !this.ludoPlayers[key].isInFocus()){
				console.log('It appears mobile device : ' + currentPlayerName + ' is out of focus');
				this.ludoPlayers[key].inFocus();
				size = this.updateNotifyEndOfPlay(currentPlayerName);
			}
		}

		//console.log('Size: ' + size + ' index: ' + index);
		if (size >= this.gameMode){

			this.currentPlayerName = currentPlayerName;
			this.updatePlayerTurn(currentPlayerName);
			//console.log('Destroying... : ' + this.notifyEndOfPlay);
			this.notifyEndOfPlay = [];
			//console.log('Destroyed... : ' + this.notifyEndOfPlay);
			//console.log('GameData: ' + JSON.stringify(this.gameData));
			return callback({socketId : null, screenName : this.currentPlayerName, gameData : this.gameData, playerWentInBackground : this.playerWentInBackground});
		}else{
			return callback({});
		}

	}else{
		console.log('ScreenName : ' + screenName + ' cannot be FOUND');
		return callback({});
	}

};


LudoGameInstance.prototype.updateNotifyEndOfPlay = function(screenName) {
	//console.log('Pushing ScreenName : ' + screenName);
	this.notifyEndOfPlay.push(screenName);
	return this.notifyEndOfPlay.length;

};

LudoGameInstance.prototype.getNextPlayerTurn = function(screenName) {
	return (screenName === this.currentPlayerName);

};

LudoGameInstance.prototype.addPlayerinBackground = function(playerName, callback){

	if (this.ludoPlayers[playerName]){
		this.ludoPlayers[playerName].outFocus();
		this.playerWentInBackground = true;
	}
	callback(true);
};

LudoGameInstance.prototype.resetInBackground = function(){
	this.playerWentInBackground = false;
	//console.log('Resetting background : ' + this.playerWentInBackground);
};

LudoGameInstance.prototype.updateStartGame = function(callback) {
	this.gameData.inprogress = true;
	callback(this.gameData);
};


LudoGameInstance.prototype.setUpdatedGameData = function(gameData, callback) {
	callback(true);
};

LudoGameInstance.prototype.validateScreenName = function(screenName) {

	for (var i = 0; i < this.gameData.players.length; ++i){
		if (this.gameData.players[i].playerName === screenName)
		{
			screenName = screenName.concat('-1');
			this.validateScreenName(screenName);
		}
	}

	return screenName;
};

LudoGameInstance.prototype.playerWasDisconnected = function(screenName){

	for (var i = 0; i < this.disconnectedPlayers.length; ++i){
		if (this.disconnectedPlayers[i].screenName === screenName){
			return true;
		}
	}
	return false;

};

LudoGameInstance.prototype.addPlayerPieces = function(playerName, playerPieces, colorsChosen){

	_.any(this.gameData.players, function(player){
		if (player.playerName === playerName){
			player.piecesNames = colorsChosen;
			player.pieces = playerPieces;
			return {};
		}
	});

};

LudoGameInstance.prototype.getPlayerPieces = function(colors){

	var selectedPieces = [];

	for (var i = 0; i < colors.length; ++i)
	{
		switch(colors[i])
		{
		case "red":
			selectedPieces.push(this.redPieces[0]);
			selectedPieces.push(this.redPieces[1]);
			selectedPieces.push(this.redPieces[2]);
			selectedPieces.push(this.redPieces[3]);
			this.colorsOptions = _.without(this.colorsOptions, colors[i]);
			break;
		case "blue":
			selectedPieces.push(this.bluePieces[0]);
			selectedPieces.push(this.bluePieces[1]);
			selectedPieces.push(this.bluePieces[2]);
			selectedPieces.push(this.bluePieces[3]);
			this.colorsOptions = _.without(this.colorsOptions, colors[i]);
			break;
		case "green":
			selectedPieces.push(this.greenPieces[0]);
			selectedPieces.push(this.greenPieces[1]);
			selectedPieces.push(this.greenPieces[2]);
			selectedPieces.push(this.greenPieces[3]);
		
			this.colorsOptions =_.without(this.colorsOptions, colors[i]);
			break;
		case "yellow":
			selectedPieces.push(this.yellowPieces[0]);
			selectedPieces.push(this.yellowPieces[1]);
			selectedPieces.push(this.yellowPieces[2]);
			selectedPieces.push(this.yellowPieces[3]);
			this.colorsOptions = _.without(this.colorsOptions, colors[i]);
			break;
		default:
			break;
		}
	}

	//console.log("Options: " + this.colorsOptions);
	return selectedPieces;
};



LudoGameInstance.prototype.isNotFull = function() {
	return (this.numOfPlayers < this.gameMode);
};


LudoGameInstance.prototype.isEmpty = function() {
	return (this.numOfPlayers < 0 || this.numOfPlayers === 0 );
};

LudoGameInstance.prototype.removePlayer = function(screenName, isOwner) {

	var disconnetedPlayer = {};

	if (this.ludoPlayers.hasOwnProperty(screenName))
	{
		//Don't save player info if game is not in progress
		if (this.gameInProgress)
		{
			//Save disconnected screenName and index
			var player = this.ludoPlayers[screenName];
			disconnetedPlayer.screenName = player.screenName;
			disconnetedPlayer.index = player.index;
			disconnetedPlayer.isOwner = isOwner;
			//console.log("Removed Player: " + JSON.stringify(this.ludoPlayers[screenName]));
			//delete this.ludoPlayers[screenName];
			this.ludoPlayers[screenName].disconnected();
			--this.numOfPlayers;
			for (var i = 0; i < this.gameData.players.length; ++i){

				if (this.gameData.players[i].playerName === screenName)
				{
					disconnetedPlayer.turn = this.gameData.players[i].turn;
					this.gameData.complete = false;
					this.disconnectedPlayers.push(disconnetedPlayer);
					break;
				}
			}


			for (var k = 0; k < this.inBackground.length; ++k){
				if (this.inBackground[k] === screenName){
					this.inBackground.splice(k, 1);
					console.log("Need to remove screenName " + screenName + " from Background: " + this.inBackground);
					break;
				}
			}
			
			if (this.inBackground.length < 1){
				console.log("No screenName in background ");
				this.resetInBackground();
			}
			


		}else{
			//things to do if game has not started
			--this.numOfPlayers;
			this.gameData.howManyPlayersJoined = this.numOfPlayers;
			this.disconnectionBeforeGameStarts(screenName);
		}
		console.log("After Disconnection: " + JSON.stringify(this.disconnectedPlayers));
	}



};

LudoGameInstance.prototype.disconnectionBeforeGameStarts = function(screenName) {

	if (this.gameData.screenNames){
		//console.log("screenNames before deletion  " + this.gameData.screenNames);
		for (var j = 0; j < this.gameData.screenNames.length; ++j){
			if (this.gameData.screenNames[j] === screenName){
				this.gameData.screenNames.splice(j, 1);
				console.log("screenNames After Deletion " + this.gameData.screenNames);
				break;
			}
		}
	}
	//console.log("After Deletion " + this.gameData.screenNames);

	var colors = [];
	_.any(this.gameData.players, function(player){
		if (player.playerName === screenName){
			colors = player.piecesNames; 
			player.playerName = null;
			player.diceObject[0].playerName = null;
			player.diceObject[1].playerName = null;
			return {};
		}
	});

	//Return back colors used
	//console.log('Before Restored colors: ' + this.colorsOptions);
	for (var m = 0; m < colors.length; ++m){
		this.colorsOptions.push(colors[m]);
	}
	//console.log('Restored colors: ' + this.colorsOptions);
	
	
	delete this.ludoPlayers[screenName];
	//console.log('GameData: ' + JSON.stringify(this.gameData));
};

LudoGameInstance.prototype.getPlayer = function(socketId) {
	var player = null;
	for(var i = 0; i < this.ludoPlayers.length; i++) {
		if(this.ludoPlayers[i].socketId == socketId) {
			player = this.ludoPlayers[i];
			break;
		}
	}
	return player;
};


LudoGameInstance.prototype.updateDiceRoll = function(diceObject, callback) {

	diceObjects.push(diceObject);
	if (diceObjects.length > 1){
		//console.log("After Dice Rool : " + JSON.stringify(diceObjects));
		var gameData = this.gameData;
		_.any(gameData.players, function(player){
			if (player.playerName === diceObject.playerName)
			{
				player.diceObject = [];
				gameData.diceIds = [];
				for (var i = 0; i < diceObjects.length; ++i){
					player.diceObject.push({uniqueId : diceObjects[i].uniqueId, value : diceValue(diceObjects[i].frame), selected : false});
					gameData.diceIds.push({uniqueId : diceObjects[i].uniqueId, value : diceValue(diceObjects[i].frame)});
				}
				player.hasRolled = true;
				player.turn = true;
				diceObjects = [];
			}else
			{
				player.hasRolled = false;
				player.turn = false;
			}
		});
	}
	callback(true);
};

LudoGameInstance.prototype.updateDiceSelection = function(diceObject, callback) {

	_.any(this.gameData.players, function(player){
		if (player.playerName === diceObject.playerName)
		{
			for (var i = 0; i < player.diceObject.length; ++i){
				if (player.diceObject[i].uniqueId === diceObject.uniqueId){
					player.diceObject[i].selected = true;
					callback(true);
					return {};
				}
			}
		}
	});
	callback(false);
};

LudoGameInstance.prototype.updateDiceUnSelection = function(diceObject, callback) {

	_.any(this.gameData.players, function(player){
		if (player.playerName === diceObject.playerName)
		{
			for (var i = 0; i < player.diceObject.length; ++i){
				if (player.diceObject[i].uniqueId === diceObject.uniqueId){
					player.diceObject[i].selected = false;
					callback(true);
					return {};
				}
			}
		}
	});
	callback(false);
};

LudoGameInstance.prototype.updatePlayerTurn = function(playerName) {

	var players = this.gameData.players;
	_.any(players, function(player){
		if (player.playerName === playerName){
			player.hasRolled = false;
			player.turn = true;
		}else{
			player.hasRolled = false;
			player.turn = false;
		}
	});
};

LudoGameInstance.prototype.updatePlayerPieceSelection = function(playerInfo, callback) {

	var players = this.gameData.players;
	_.any(players, function(player){
		if (player.playerName === playerInfo.playerName){
			for (var i = 0; i < player.pieces.length; ++i){
				if (player.pieces[i].uniqueId === playerInfo.uniqueId){
					player.selectedPieceId = playerInfo.uniqueId;
					return {};
				}
			}
		}
	});
	callback(true);
};

LudoGameInstance.prototype.updatePieceInfo = function(playerInfo, callback) {

	var players = this.gameData.players;
	_.any(players, function(player){
		if (player.playerName === playerInfo.playerName){
			for (var i = 0; i < player.pieces.length; ++i){
				if (player.pieces[i].uniqueId === playerInfo.uniqueId){
					player.pieces[i].x = playerInfo.x;
					player.pieces[i].y = playerInfo.y;
					player.pieces[i].state = playerInfo.state;
					player.pieces[i].index = playerInfo.index;
					return {};
				}
			}
		}
	});

	callback(true);
};

LudoGameInstance.prototype.updateDiceInfo = function(diceInfo, callback) {

	var gameData = this.gameData;
	//console.log("FBefore : " + JSON.stringify(gameData));
	_.any(gameData.players, function(player){
		if (player.playerName === diceInfo.playerName)
		{
			for (var i = 0; i < player.diceObject.length; ++i)
			{
				if (player.diceObject[i].uniqueId === diceInfo.uniqueId){
					player.diceObject[i].value = 0;
					break;
				}

			}

			for (var j = 0; j < gameData.diceIds.length; ++j)
			{
				if (gameData.diceIds[j].uniqueId === diceInfo.uniqueId){
					gameData.diceIds[j].value = 0;
					break;
				}
			}
			return {};
		}
	});
	//console.log("FAfter : " + JSON.stringify(gameData));
	callback(true);
};

module.exports = LudoGameInstance;