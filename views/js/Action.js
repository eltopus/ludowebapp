Action = function (game, controller) {
      
    this.game = game;
    this.players = this.game.ludo;
    this.controller = controller;
    
};

Action.prototype.action = function(pieceUniqueId, playerName, diceUniqueIds, activity, diceObject){
    
    var player = this.getPlayer(playerName);
    var piece = null;
    if (player != null){
        piece = this.getPiece(player, pieceUniqueId); 
    }
    
    if (piece == null){
        alert("A great Error has occurred!!!");
        return;
    }
    
    
    switch (activity){
        case "selectDice":
            this.selectDice(player, diceUniqueIds);
            break;
        case "unSelectDice":
            this.unSelectDice(player, diceUniqueIds);
            break;
        case "moveForward":
            this.moveForward(piece, player, diceUniqueIds)
            break;
        case "selectPiece":
            this.selectPiece(player, piece);
            break;
         case "setDiceValue":
            this.setDiceValue(player, diceObject);
            break;
        default:
            break;
    }
};

Action.prototype.setDiceValue = function(player, diceObject){    
    this.controller.rollDiceActivity(player, diceObject);
   
};

Action.prototype.unSelectDice = function(player, diceUniqueIds){    
    
    if (diceUniqueIds != null){
        for (var i = 0; i < diceUniqueIds.length; ++i ){
            player.unSelectDieById(diceUniqueIds[i]);
        }
        return true;
    }
    return false;
};

Action.prototype.selectDice = function(player, diceUniqueIds){    
    
    if (diceUniqueIds != null){
        for (var i = 0; i < diceUniqueIds.length; ++i ){
            player.setSelectedDieById(diceUniqueIds[i]);
        }
        return true;
    }
    return false;
};

Action.prototype.moveForward = function(piece, player, diceUniqueIds){    
    
    if (diceUniqueIds != null){
        player.setSelectedDieById(diceUniqueIds[0]);
    }
    player.setSelectedPiece(piece);
    player.play();
    return piece;
    
};


Action.prototype.getPlayer = function(playerName){
    var player = null;
    for (var i = 0; i < this.players.length; ++i){
       if (this.players[i].playerName == playerName ){
           player = this.players[i];
           break;
       }
    }
    return player;
};


Action.prototype.getPiece = function(player, pieceUniqueId){
    var piece = null;
    var pieces = player.playerPieces;
    for (var i = 0; i < pieces.length; ++i){
       if (pieces[i].uniqueId == pieceUniqueId){
           piece = pieces[i];
           break;
       }
    }
    return piece;
};

Action.prototype.selectPiece = function(player, piece){    
    player.setSelectedPiece(piece);
};