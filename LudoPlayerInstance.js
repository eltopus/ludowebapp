var _ = require('underscore');

function LudoPlayerInstance(gameId, socketId, screenName, gameData, index, owner, newPlayer){

	var playerIndex = 0;
	
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

LudoPlayerInstance.prototype.updateGameData = function(gameData){
	this.gameData = gameData;
};

LudoPlayerInstance.prototype.deleteGameData = function(){
	this.gameData = null;
};

module.exports = LudoPlayerInstance;