function LudoGameInstance(gameid, socketId, owner, gameData, limit) {

	
  this.gameId = gameId;
  this.socketId = socketId;
  this.owner = owner;
  this.ludoPlayers = [];
  this.limit = limit;
  this.gameData = gameData;
  this.status = "available";
};

LudoGameInstance.prototype.addPlayer = function(newPlayerObject) {
  if (this.status === "available") {
    this.ludoPlayers.push(newPlayerObject);
  }
};

LudoGameInstance.prototype.removePlayer = function(newPlayerObject) {
  var playerIndex = -1;
  for(var i = 0; i < this.ludoPlayers.length; i++){
    if(this.ludoPlayers[i].socketId === newPlayerObject.socketId){
    	playerIndex = i;
      break;
    }
  }
  this.ludoPlayers.remove(playerIndex);
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

LudoGameInstance.prototype.isAvailable = function() {
  return this.available === "available";
};


module.exports = LudoGameInstance;