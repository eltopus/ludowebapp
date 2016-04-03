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
	
	this.gameio.on('diceRoll', function(uniqueIds){
		
		for (var i = 0; i < players.length; ++i)
		{
			players[i].handleDiceUniqueIds(dice, uniqueIds);
	    }
		
    });
	
	
	this.gameio.on('diceRollCompletedReturn', function(diceObject){
	
		for (var i = 0; i < players.length; ++i){
			players[i].handleDiceObject(dice, diceObject);
	    }
		
    });
};


Socket.prototype.emitPieceSelection = function(uniqueId){
	this.gameio.emit('pieceSelection', uniqueId);
};

Socket.prototype.emitDiceRoll = function(uniqueIds){
	this.gameio.emit('diceRoll', uniqueIds);
};



Socket.prototype.emitDiceRollCompleted = function(diceObject){
	this.gameio.emit('diceRollCompleted', diceObject);
};
