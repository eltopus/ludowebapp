/**
 * http://usejsdoc.org/
 */


Socket = function(game){

	this.gameio = game.socket;
	var dice = game.controller.dice;
	var players = game.ludo;
	this.queue = new Queue();
	
	for (var i = 0; i < players.length; ++i){
		players[i].setGameIO(this);
    }
	
	for (var i = 0; i < dice.length; ++i){
		dice[i].setGameIO(this);
    }
	
	
	this.gameio.on('pieceSelection', function(pieceId){
		game.selectPieceEmissionById(pieceId);
        
    });
	
	this.gameio.on('diceRoll', function(diceObject){
		game.rollDiceEmission(diceObject);
		
    });
	
	this.gameio.on('diceSelection', function(diceObject){
		game.setSelectedDieById(diceObject);
		
    });
	
	this.gameio.on('diceUnSelection', function(diceObject){
		game.setUnSelectedDieById(diceObject);
		
    });
	
	this.gameio.on('piecePosition', function(pieceObject){
		console.log('Id: ' + pieceObject.uniqueId + ' x: ' + pieceObject.x + ' y: ' + pieceObject.y);
		
    });
	
	this.gameio.on('play', function(playObject){
		game.playDiceEmission(playObject.playerName);
		
    });
	
	
	
};


Socket.prototype.emitPieceSelection = function(pieceSelectionObject){
	this.gameio.emit('pieceSelection', pieceSelectionObject);
};

Socket.prototype.emitDiceRoll = function(diceObject){
	this.gameio.emit('diceRoll', diceObject);
};

Socket.prototype.emitDiceRollCompleted = function(diceObject){
	this.gameio.emit('diceRollCompleted', diceObject);
};

Socket.prototype.emitDiceSelection = function(diceObject){
	this.gameio.emit('diceSelection', diceObject);
};

Socket.prototype.emitDiceUnSelection = function(diceObject){
	this.gameio.emit('diceUnSelection', diceObject);
};

Socket.prototype.emitPiecePosition = function(pieceObject){
	this.gameio.emit('piecePosition', pieceObject);
};

Socket.prototype.emitPlay = function(playObject){
	this.gameio.emit('play', playObject);
};
