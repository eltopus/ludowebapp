/**
 * http://usejsdoc.org/
 */


Socket = function(game){

	this.gameio = game.socket;
	var dice = game.controller.dice;
	var players = game.ludo;
	
	for (var i = 0; i < players.length; ++i){
		players[i].setGameIO(this);
    }
	
	for (var i = 0; i < dice.length; ++i){
		dice[i].setGameIO(this);
    }
	
	
	this.gameio.on('pieceSelection', function(data){
        
		console.log('Piece: ' + data + ' is selected');
        for (var i = 0; i <  players.length; ++i){
        	 players[i].setSelectedPieceById(data);
        }
    });
	
	this.gameio.on('diceRoll', function(diceObject){
		game.rollDiceEmission(diceObject);
		
    });
	
};


Socket.prototype.emitPieceSelection = function(uniqueId){
	this.gameio.emit('pieceSelection', uniqueId);
};

Socket.prototype.emitDiceRoll = function(diceObject){
	this.gameio.emit('diceRoll', diceObject);
};



Socket.prototype.emitDiceRollCompleted = function(diceObject){
	this.gameio.emit('diceRollCompleted', diceObject);
};
