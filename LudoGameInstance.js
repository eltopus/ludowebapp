var playerInstance = require('./LudoPlayerInstance');
var _ = require('underscore');

function LudoGameInstance(gameId, socketId, owner, gameData) {

  this.ludoPlayers = [];
  this.screenNames = [];
  this.owner = owner;
  this.numOfPlayers = 0;
  gameData.gameId = gameId;
  this.gameMode = gameData.gameMode;
  this.ludoPlayers[owner] = new playerInstance(gameId, socketId, owner, gameData);
  this.gameData = this.ludoPlayers[owner].gameData;
  this.screenNames.push(owner);
  ++this.numOfPlayers;
};

LudoGameInstance.prototype.addPlayer = function(gameId, socketId, screenName) {
  if (this.isNotFull()) {
	  screenName = this.validateScreenName(screenName);
	  this.screenNames.push(screenName);
	  this.ludoPlayers[screenName] = new playerInstance(gameId, socketId, screenName, this.gameData);
	  ++this.numOfPlayers;
	  this.gameData = this.ludoPlayers[screenName].gameData;
	  if (this.numOfPlayers === this.gameMode){
		  this.gameData.complete = true;
	  }
	  return {gameData : this.gameData, screenName: screenName};
  }
  return null;
};


LudoGameInstance.prototype.validateScreenName = function(screenName) {
	
	for (var i = 0; i < this.gameData.players.length; ++i){
		if (this.gameData.players[i].playerName === screenName)
		{
			  screenName = screenName.concat('-1');
			  //console.log(screenName + " Has been Changed ");
			  this.validateScreenName(screenName);
		 }
	}
	
	 return screenName;
};


LudoGameInstance.prototype.isNotFull = function() {
	return (this.numOfPlayers < this.gameMode);
};


LudoGameInstance.prototype.isEmpty = function() {
	return (this.numOfPlayers < 0 || this.numOfPlayers === 0 );
};

LudoGameInstance.prototype.removePlayer = function(screenName) {
	
	_.without(this.ludoPlayers, screenName);
	--this.numOfPlayers;
	 _.any(this.gameData.players, function(player){
		  if (player.playerName === screenName){
			  //player.playerName = null;
			  player.complete = false;
			  return {};
		  }
	  });
	 //console.log("After screenName: " + JSON.stringify(this.gameData));
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

module.exports = LudoGameInstance;