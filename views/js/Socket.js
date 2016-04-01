/**
 * http://usejsdoc.org/
 */


Socket = function(gameio){
	this.gameio = gameio;
	
	this.gameio.on('playerJoinedRoom', function(data){
        console.log(data);
    });
};


Socket.prototype.emitPieceSelection = function(uniqueId){
	console.log('--------------------------------------------------------');
	console.log('sending uniqueId: ' + uniqueId);
	this.gameio.emit('pieceSelection', uniqueId);
};
