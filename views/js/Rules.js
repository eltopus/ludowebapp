Rules = function (game, play) {
    this.game = game;
    this.play = play;
};

//this.Rules.prototype = Object.create(Phaser.Sprite.prototype);
//this.Rules.prototype.constructor = this.Rules;


Rules.prototype.applyNextPlayerRule = function(currentPlayer){
    
    if (currentPlayer.hasRolled && (currentPlayer.diceIsEmpty() || !currentPlayer.hasUnplayedDice())){
        this.play.visible = false;
        currentPlayer = this.nextPlayer(currentPlayer);
    }
    else{
        this.play.visible = true;
    }
    return currentPlayer;  
};


Rules.prototype.nextPlayer = function(currentPlayer){
    currentPlayer.unRolled();
    currentPlayer.deSelectAll();
    currentPlayer.consumeDice();
    currentPlayer.diceCompletionReset();
    currentPlayer.nextTurn();
    currentPlayer = this.game.ludo[this.getNextPlayerIndex(currentPlayer.index)];
    currentPlayer.selectAll();
    currentPlayer.playerTurn();
    return currentPlayer;
};

//***************************APPLY DICE ROLL RULES**************************************************

Rules.prototype.applyDiceRules = function(currentPlayer){
    if(!this.applyDiceRollRule(currentPlayer)){
        this.play.visible = false;
        currentPlayer.getBothDiceValues();
        currentPlayer = this.nextPlayer(currentPlayer);
    }
    else{
        this.play.visible = true;
    }
    return currentPlayer;
       
};

Rules.prototype.applyDiceRollRule = function(currentPlayer){
    return (this.applyCheckingHasActive(currentPlayer));
};

Rules.prototype.applyCheckingHasActive = function(currentPlayer){
    if (currentPlayer.hasActivePieces()){
        return true;
    }
    else{
       return (this.applyCheckingHasAwaiting(currentPlayer)); 
    }
};

Rules.prototype.applyCheckingHasAwaiting = function(currentPlayer){
    if (currentPlayer.hasAwaitingExitStatePieces()){
        return (this.applyCheckingCanMoveTowardsExit(currentPlayer));
    }
    else{
        return (this.applyCheckingHasIddle(currentPlayer));
    }
};

Rules.prototype.applyCheckingCanMoveTowardsExit = function(currentPlayer){
    if (currentPlayer.canMoveToNextAtHome() > 0 || currentPlayer.canMoveSelectedToNextAtHome() > 0){
        return true;
    }
    else{
        return (this.applyCheckingHasIddle(currentPlayer));
    }
};

Rules.prototype.applyCheckingHasIddle = function(currentPlayer){
    if (currentPlayer.hasIddlePieces()){
        return (this.applyRolledSixOrDoubleSix(currentPlayer));
    }
    else{
        return false;
    }
};

Rules.prototype.applyRolledSixOrDoubleSix = function(currentPlayer){
    if (currentPlayer.rolledSix() || currentPlayer.rolledDoubleSix()){        
        return true;
    }
    else{
        return false;
    }
};

//******************************************************************************************************


Rules.prototype.applyIddleStateRules = function(currentPlayer){

    return (this.applyIddleCheckingRolledSixOrDouble(currentPlayer));
};

Rules.prototype.applyIddleCheckingRolledSixOrDouble = function(currentPlayer){
    if (currentPlayer.rolledDoubleSix()){
        if (currentPlayer.hasMoreThanOneIddlePiece()){
            return 2;
        }else{
            return 1;
        }
        
    }
    else if (currentPlayer.rolledSix()){
        if (currentPlayer.hasActivePieces()){
            return 2;
        }
        else{
            if (currentPlayer.hasAwaitingExitStatePieces()){
                if (currentPlayer.canMoveToNextAtHome() > 0){
                    return 2;
                }
                else{
                    return 1;
                }
            }
            else{
                return 1;
            }
        }
    }
    else{
        return 0;
    }
};


//*******************************ACTIVE STATE PLAY RULE******************************************************

Rules.prototype.applyActiveStateRule = function(currentPlayer){
    return (this.applyCheckingActiveStateHasActivePieces(currentPlayer));
};

Rules.prototype.applyCheckingActiveStateHasActivePieces = function(currentPlayer){
    if (currentPlayer.hasMoreThanOneActivePiece()){
        return (this.applyCheckingActiveStateHasOneUnplayedDie(currentPlayer));
    }else{
        return (this.applyCheckingActiveStateHasAwaitingPieces(currentPlayer));
    }
};

Rules.prototype.applyCheckingActiveStateHasOneUnplayedDie = function(currentPlayer){
    if (currentPlayer.hasExactlyOneUnplayedDie()){
        return 3;
        
    }else{
        return 4;
    }
};

Rules.prototype.applyCheckingActiveStateHasAwaitingPieces = function(currentPlayer){  
    if (currentPlayer.hasAwaitingExitStatePieces()){
       return (this.applyCheckingActiveCanMoveHome(currentPlayer));
    }else{
        return (this.applyCheckingActiveStateHasIddlePieces(currentPlayer));
    }
};

Rules.prototype.applyCheckingActiveCanMoveHome = function(currentPlayer){
    if (currentPlayer.canMoveToNextAtHome() > 0){
        return (this.applyCheckingActiveStateHasOneUnplayedDie(currentPlayer));
    }else{
        return (this.applyCheckingActiveStateHasIddlePieces(currentPlayer));
    }
};

Rules.prototype.applyCheckingActiveStateHasIddlePieces = function(currentPlayer){
    
    if (currentPlayer.hasMoreThanOneIddlePiece()){
        return (this.applyCheckingActiveStateRolledSix(currentPlayer));
    }else{
        return 3;
    }
};

Rules.prototype.applyCheckingActiveStateRolledSix = function(currentPlayer){
    if (currentPlayer.rolledSix() || currentPlayer.rolledDoubleSix()){
        return 4;
    }else{
        return 3;
    }
};

//**********************************************************************************************

Rules.prototype.applyAwaitingExitStateRules = function(currentPlayer){
    
    return (this.applyCheckingAwaitingExitCanMove(currentPlayer));
};

Rules.prototype.applyCheckingAwaitingExitCanMove = function(currentPlayer){
    
    if (currentPlayer.validateAwaitingExitDiceSelection()){
       return (this.applyCheckingAwaitingIsActive(currentPlayer));
    }
    else{
        return 0;
    }
};

Rules.prototype.applyCheckingAwaitingIsActive = function(currentPlayer){
    
    if (currentPlayer.hasActivePieces()){
        return 7;
    }else{
        return (this.applyCheckingAwaitingHasIddle(currentPlayer));
    }
};

Rules.prototype.applyCheckingAwaitingHasIddle = function(currentPlayer){
    
    if (currentPlayer.hasIddlePieces()){
        return (this.applyCheckingAwaitingRolledSix(currentPlayer));
    }else{
        return (this.applyCheckingAwaitingHasAwaiting(currentPlayer));
    }
};

Rules.prototype.applyCheckingAwaitingRolledSix = function(currentPlayer){
    
    if (currentPlayer.rolledSix() || currentPlayer.rolledDoubleSix()){
        return 6;
    }else{
        return (this.applyCheckingAwaitingHasAwaiting(currentPlayer));
    }
};

Rules.prototype.applyCheckingAwaitingHasAwaiting = function(currentPlayer){
        
    if (currentPlayer.hasAwaitingExitStatePieces()){
        return (this.applyCheckingAwaitingCanMoveOtherAwaiting(currentPlayer));
        
    }else{
        return (this.applyCheckingAwaitingExactlyOneDie(currentPlayer));
    }
    
};

Rules.prototype.applyCheckingAwaitingCanMoveOtherAwaiting = function(currentPlayer){
        
    if (currentPlayer.canMoveAnotherAwaitingToExit(currentPlayer.selectedPiece)){
        //alert("Other 7");
        return 7;
        
    }else{
        //alert("Other 8");
        return 8;
    }
    
};


Rules.prototype.applyCheckingAwaitingExactlyOneDie = function(currentPlayer){
        
    if (currentPlayer.hasExactlyOneUnplayedDie())
    {
        //alert("Die 8");
        return 8;
        
    }else{
        //alert("Die 8 else");
        return (this.applyCheckingAwaitingCanMoveSamePieceToExit(currentPlayer));
    }
};

Rules.prototype.applyCheckingAwaitingCanMoveSamePieceToExit = function(currentPlayer){
    
    if (currentPlayer.canMoveSamePieceSelectedCloserToExit()){
        return 10; //special function
    }else{
        return 8;
    }
};


 Rules.prototype.getNextPlayerIndex = function(currentIndex){
     
     if (currentIndex >= this.game.ludo.length - 1){
         currentIndex = 0;
         return currentIndex;
     }
     return ++currentIndex;
};