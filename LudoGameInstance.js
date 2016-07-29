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

function LudoGameInstance(gameId, socketId, screenName, gameData, colors, callback) {

	this.colorsOptions = ["red", "blue", "green", "yellow"];
	this.disconnectedPlayers = [];
	this.gameData = gameData;

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




	this.ludoPlayers = [];
	this.screenNames = [];
	this.notifyEndOfPlay = [];

	this.screenName = screenName;
	this.numOfPlayers = 0;
	this.gameData.gameId = gameId;
	this.gameMode = this.gameData.gameMode;
	++this.numOfPlayers;
	this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, this.gameData, this.numOfPlayers, true);
	this.gameData = this.ludoPlayers[screenName].gameData;
	this.ludoPlayers[screenName].deleteGameData();
	this.choicesLeft = null;

	if (colors !== null){
		var playerPieces = this.getPlayerPieces(colors);
		this.addPlayerPieces(screenName, playerPieces, colors);
	}

	this.screenNames.push(screenName);
	this.currentPlayerName = screenName;
	this.gameInProgress = false;
	this.gameData.screenNames = this.screenNames;
	this.inBackground = [];
	this.playerWentInBackground = false;
	this.date = new Date();
	this.gameEnded = false;
	callback(this);

}


LudoGameInstance.prototype.addAdminPlayer = function(screenName, callback) {

	if (this.gameInProgress){
		this.gameData.screenName = 'ADMIN';
		callback(this.gameData);

	}else{
		callback(null);
	}

};


LudoGameInstance.prototype.addPlayer = function(gameId, socketId, screenName, fromDB, callback) {

	if (this.isNotFull()) 
	{

		if (this.gameInProgress)
		{

			var screenameExists = false;
			if (fromDB){
				//this.gameData.inprogress = true;
				this.screenNames.push(screenName);
			}

			for (var i = 0; i < this.disconnectedPlayers.length; ++i)
			{
				if (this.disconnectedPlayers[i].screenName === screenName)
				{
					screenameExists = true;
					this.gameData.setSessionTurn = this.disconnectedPlayers[i].turn;
					this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, this.gameData, this.disconnectedPlayers[i].index, false);
					this.gameData = this.ludoPlayers[screenName].gameData;
					this.ludoPlayers[screenName].deleteGameData();
					++this.numOfPlayers;
					if (this.numOfPlayers === this.gameMode){
						this.gameData.complete = true;
					}
					var index = this.disconnectedPlayers[i].index;
					this.gameData.owner = this.disconnectedPlayers[i].isOwner;
					if (!fromDB){
						this.disconnectedPlayers.splice(i, 1);
					}
					this.gameData.howManyPlayersJoined  = this.numOfPlayers;
					callback({gameData : this.gameData, screenName: screenName, index : index});
				}

			}


			if (!screenameExists){
				callback({gameData : this.gameData, screenName: screenName, index : -1, availableScreenNames : this.disconnectedPlayers});
			}



		}else
		{

			var colorsLeft = null;
			var playerPieces = null;
			screenName = this.validateScreenName(screenName);
			this.screenNames.push(screenName);
			++this.numOfPlayers;
			this.gameData.setSessionTurn = false;
			this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, this.gameData, this.numOfPlayers, false);
			this.gameData = this.ludoPlayers[screenName].gameData;
			this.ludoPlayers[screenName].deleteGameData();
			if (this.numOfPlayers === this.gameMode){
				this.gameData.complete = true;
				this.gameInProgress = true;
				
			}

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
				//console.log(JSON.stringify(this.gameData));

			}

			this.gameData.howManyPlayersJoined  = this.numOfPlayers;
			this.gameData.screenNames = this.screenNames;
			callback({gameData : this.gameData, screenName: screenName, index : this.numOfPlayers});

		}


	}else{
		callback(null);
	}


};


LudoGameInstance.prototype.getUpdatedGameData = function(callback) {
	callback({gameData : this.gameData, screenName  : this.currentPlayerName});
};

LudoGameInstance.prototype.getNextSocketId = function(screenName, callback){

	if (this.ludoPlayers[screenName])
	{

		var currentPlayer = this.ludoPlayers[screenName];
		var index = (currentPlayer.index % this.gameMode) + 1;

		var player = this.stillInTheGame(index);
		if (player === null)
		{
			//Unreachable Code
			//console.log('Next Player migth have been disconnected...' + screenName + " " + this.currentPlayerName);
			this.notifyEndOfPlay = [];
			this.gameData.screenName = this.currentPlayerName;
			var players = this.gameData.players;
			var currentPlayerName = this.currentPlayerName;
			//console.log('Preparing next player on connection' + currentPlayerName);
			_.any(players, function(player){
				if (player.playerName === currentPlayerName){
					player.hasRolled = false;
					player.turn = true;
					//console.log(player.playerName + ' would be next  on connection');
				}else{
					player.hasRolled = false;
					player.turn = false;
				}
			});
			callback({socketId : null, screenName : this.currentPlayerName, gameData : this.gameData, playerWentInBackground : this.playerWentInBackground});

		}else
		{
			var nextPlayerName = null;
			for (var key in this.ludoPlayers)
			{
				if (this.ludoPlayers[key].index === index){
					nextPlayerName = key;
					break;
				}
				

			}
			
			if (nextPlayerName !== null)
			{
				var players = this.gameData.players;
				_.any(players, function(player){
					if (player.playerName === key){
						player.hasRolled = false;
						player.turn = true;
					}else{
						player.hasRolled = false;
						player.turn = false;
					}
				});

				var data = this.updateNotifyEndOfPlay(screenName);
				var size = data.size;

				if (size >= this.gameMode){
					this.notifyEndOfPlay = [];
					this.currentPlayerName = nextPlayerName;
					this.gameData.screenName = nextPlayerName;
					//this.updatePlayerTurn(key);
					callback({socketId : this.ludoPlayers[nextPlayerName].socketId, screenName : nextPlayerName, gameData : this.gameData, playerWentInBackground : this.playerWentInBackground});
				}else
				{
					
					size = this.notifyEndOfPlay.length + this.inBackground.length;
					if (size >= this.gameMode){
						//console.log("Updating playerWentInBackground");
						this.playerWentInBackground = true;
						callback({gameData : this.gameData, playerWentInBackground : this.playerWentInBackground});
						
					}else{
						callback({playerWentInBackground : this.playerWentInBackground});
					}
					
					
				}
			}
		}
	}else{
		console.log('ScreenName : ' + screenName + ' cannot be FOUND');
		callback({playerWentInBackground : this.playerWentInBackground});
	}


};

LudoGameInstance.prototype.addPlayerinBackground = function(playerName, callback){
	//console.log('Updating in background ' + playerName);
	this.inBackground.push(playerName);
	this.playerWentInBackground = true;
	callback(true);
	
};


LudoGameInstance.prototype.resetInBackground = function(){
	this.inBackground = [];
	this.playerWentInBackground = false;
};

LudoGameInstance.prototype.stillInTheGame = function(index){

	var playerName = null;
	//console.log('Checking if player is still in game');
	for (var key in this.ludoPlayers)
	{
		if (this.ludoPlayers[key].index === index)
		{
			playerName = key;
			break;

		}
	}

	if (playerName === null){
		//console.log('Seems like player is disconnected from game');
		for (var i = 0; i < this.disconnectedPlayers.length; ++i){

			if (this.disconnectedPlayers[i].index === index){
				this.disconnectedPlayers[i].turn = true;
				this.currentPlayerName = this.disconnectedPlayers[i].screenName;
				//console.log(this.currentPlayerName + ' Found and turn set to true');
				
				break;
			}
		}

	}
	
	//console.log("After Disconnection: " + JSON.stringify(this.disconnectedPlayers) + "PlayerName: " + playerName);
	return playerName;
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


LudoGameInstance.prototype.updateNotifyEndOfPlay = function(screenName) {

	this.notifyEndOfPlay.push(screenName);
	return {size :this.notifyEndOfPlay.length, ok : true};
	
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


LudoGameInstance.prototype.processColorChoices = function(colors){

	_.any(colors, function(color){
		//colorsOptions = _.without(colorsOptions, color);
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
		//Save disconnected screenName and index
		var player = this.ludoPlayers[screenName];
		disconnetedPlayer.screenName = player.screenName;
		disconnetedPlayer.index = player.index;
		disconnetedPlayer.isOwner = isOwner;
		delete this.ludoPlayers[screenName];
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
		//console.log("After Disconnection: " + JSON.stringify(this.disconnectedPlayers));
	}
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