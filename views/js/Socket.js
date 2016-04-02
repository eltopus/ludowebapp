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
		console.log('PlayerName: ' + data.playerName);
		for (var i = 0; i < players.length; ++i){
			if (players[i].playerName == data.playerName){
				for (var j = 0; j < dice.length; ++j){
					dice[j].setCurrentPlayer(players[i]);
				}
			}
	    }
		
       
        
    });
	
	
	this.gameio.on('diceRollCompleted', function(diceObject){
		console.log('Dice Completed: ' + diceObject.uniqueId + ' value: ' + diceObject.value);
		for (var i = 0; i <  dice.length; ++i){
       	   dice[i].setDiceObj(diceObject);
		}
		
		 for (var j = 0; j <  dice.length; ++j){
			 dice[j].roll();
	      
		 }
        
    });
};


Socket.prototype.emitPieceSelection = function(uniqueId){
	this.gameio.emit('pieceSelection', uniqueId);
};

Socket.prototype.emitDiceRoll = function(die){
	this.gameio.emit('diceRoll', {uniqueId : die.uniqueId, frame : die.frame, playerName :die.player.playerName});
};


Socket.prototype.emitDiceRollCompleted = function(diceObject){
	this.gameio.emit('diceRollCompleted', diceObject);
};
