var _ = require('underscore');

function LudoPlayerInstance(gameId, socketId, screenName, gameData){
	
	updateScreenName = function(name, data){
		 _.any(data.players, function(player){
			  if (player.playerName === null){
				  player.playerName = name;
				  //player.piecesNames = colors;
				  return {};
			  }
		  });
	};
	
	this.gameId = gameId;
	this.socketId = socketId;
	this.screenName = screenName;
	updateScreenName(screenName, gameData);
	this.gameData = gameData;
}

LudoPlayerInstance.prototype.updateGameData = function(gameData){
	this.gameData = gameData;
};



module.exports = LudoPlayerInstance;