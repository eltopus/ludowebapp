var _ = require('underscore');

function LudoPlayerInstance(gameId, socketId, screenName, gameData, index, owner){
	
	updateScreenName = function(name, data){
		 _.any(data.players, function(player){
			  if (player.playerName === null){
				  player.playerName = name;
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
	this.index = index;
	//console.log('Index set : ' + index);
}

LudoPlayerInstance.prototype.updateGameData = function(gameData){
	this.gameData = gameData;
};



module.exports = LudoPlayerInstance;