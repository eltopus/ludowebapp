var _ = require('underscore');

function LudoPlayerInstance(gameId, socketId, screenName, gameData, index, owner, newPlayer){

	var playerIndex = 0;
	this.index = 0;
	this.connect = true;
	this.focus = true;
	this.owner = owner;
	this.myTurn = false;
	
	updateScreenName = function(name, data){
		_.any(data.players, function(player){
			if (player.playerName === null){
				player.playerName = name;
				player.diceObject[0].playerName = name;
				player.diceObject[1].playerName = name;
				playerIndex = player.playerIndex;
				if (owner){
					player.turn = true;
				}
				return {};
			}
		});
	};
	
	this.gameId = gameId;
	this.socketId = socketId;
	this.screenName = screenName;
	updateScreenName(screenName, gameData);
	this.gameData = gameData;
	
	
	if (newPlayer){
		this.index = playerIndex;
	}else{
		this.index = index;
	}
	
}

LudoPlayerInstance.prototype.setTurn = function(playerName){
	if (this.screenName === playerName){
		this.myTurn = true;
	}else{
		this.myTurn = false;
	}
};

LudoPlayerInstance.prototype.updateGameData = function(gameData){
	this.gameData = gameData;
};

LudoPlayerInstance.prototype.deleteGameData = function(){
	this.gameData = null;
};

LudoPlayerInstance.prototype.connected = function(){
	this.connect = true;
};

LudoPlayerInstance.prototype.disconnected = function(){
	this.connect = false;
};

LudoPlayerInstance.prototype.isConnected = function(){
	return(this.connect);
};

LudoPlayerInstance.prototype.inFocus = function(){
	//console.log('Going into focus');
	this.focus = true;
};

LudoPlayerInstance.prototype.outFocus = function(){
	//console.log('Going out of focus');
	this.focus = false;
};

LudoPlayerInstance.prototype.isInFocus = function(){
	return(this.focus);
};



module.exports = LudoPlayerInstance;