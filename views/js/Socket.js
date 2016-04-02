/**
 * http://usejsdoc.org/
 */


Socket = function(gameio, LudoPlayers, controller){

	for (var i = 0; i < LudoPlayers.length; ++i){
		LudoPlayers[i].setGameIO(this);
    }
	
	for (var i = 0; i < controller.dice.length; ++i){
		controller.dice[i].setGameIO(this);
    }
	
	this.gameio = gameio;
	var dice = controller.dice;
	var players = LudoPlayers;
	
	
	this.gameio.on('pieceSelection', function(data){
        console.log('Piece: ' + data + ' is selected');
        for (var i = 0; i <  players.length; ++i){
        	 players[i].setSelectedPieceById(data);
        }
    });
	
	this.gameio.on('diceRoll', function(data){
        for (var i = 0; i <  dice.length; ++i){
       	 dice[i].changeFrameById(data);
       }
        
    });
};



Socket.prototype.emitPieceSelection = function(uniqueId){
	this.gameio.emit('pieceSelection', uniqueId);
};

Socket.prototype.emitDiceRoll = function(die){
	this.gameio.emit('diceRoll', {uniqueId : die.uniqueId, frame : die.frame, angle : die.angle});
};
