// Extended Phaser.Sprite (check out the examples Sprites -> extending sprite demo 1 & 2)
// Added a function to animate rolling.

Gamedef = function (controller, gameId) {
    this.gameId = gameId;
    this.diceIds = [];
    for (var i = 0; i < controller.dice.length; ++i){
        this.diceIds.push({uniqueId : controller.dice[i].uniqueId, value : controller.dice[i].value()});
    }
    this.players = []; 
};


Playerdef = function(player, pieces){
     
    this.piecesNames = player.piecesNames;
    this.playerName = player.playerName;
    this.hasRolled = player.hasRolled;
    this.index = player.index;
    this.playerMode = player.playerMode;
    this.endOfPlay = player.endOfPlay;
    this.pieces = pieces;
    this.diceObject = player.diceObject;
    this.turn = player.turn;
    this.selectedPieceId = null;
    this.exitingGraphicsPositions = player.exitingGraphicsPositions;
    
    if (player.selectedPiece != null){
        this.selectedPieceId = player.selectedPiece.uniqueId;
    }
    
};

Gamedef.prototype.constructPiecesDef = function(pieces){
  
    var piecesdef = [];
    for (var i = 0; i < pieces.length; ++i){
        var piece = new Piecedef(pieces[i]);
        piecesdef.push(piece);
    }
   
    return piecesdef;
};

Piecedef = function(piece){
  
    this.piece = piece.piece;
    this.state = piece.state;
    this.index = piece.index;
    this.x = piece.position.x;
    this.y = piece.position.y;
    this.x_home = piece.x_home;     
    this.y_home = piece.y_home;          
    this.imageId = piece.imageId;      
    this.uniqueId = piece.uniqueId;            
    this.homeIndex = piece.homeIndex;     
};


Gamedef.prototype.constructPlayerDef = function(player){
    
    var pieces = this.constructPiecesDef(player.playerPieces);
    var playersdef = new Playerdef(player, pieces);
    return playersdef;
};


Gamedef.prototype.savedef = function(ludo){
    players = [];
    for (var i = 0; i < ludo.length; ++i)
    {
        players.push(this.constructPlayerDef(ludo[i]));
    }
    
    this.players = players;
};
