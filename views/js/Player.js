Player = function(game, name, turn, piecesNames, index, playerMode, controller, gameId, sessionName){

	this.game = game;
	this.controller = controller;
	this.piecesNames = piecesNames;
	this.playerName = name;
	this.turn = turn;
	this.index = index;
	this.hasRolled = false;
	this.playerMode = playerMode;
	this.playerPieces = [];
	this.diceObject = [];
	this.SIX = 6;
	this.endOfPlay = 0;
	this.rule = new Rules(game);
	this.selectedPiece = null;
	this.exitingGraphicsPositions = [740, 780, 820, 860];
	this.redGraphicsIndex = -1;
	this.blueGraphicsIndex = -1;
	this.yellowGraphicsIndex = -1;
	this.greenGraphicsIndex = -1;
	this.gameio = null;
	this.pusher = false;
	this.error = null;
	this.gameId = gameId;
	this.rolledTwoSixes = false;
	this.sessionName = sessionName;
};

Player.prototype.isSessionTurn = function(){
	return (this.sessionName === this.playerName);
};

Player.prototype.releasePlay = function(game){
	this.consumeDice();
	this.controller.consumeDice();
	this.endOfPlay = 2;
};


Player.prototype.buildPieces = function(game){
	switch(this.playerMode){
	case 2:
		this.getPieces(game, this.piecesNames[0]);
		this.getPieces(game, this.piecesNames[1]);
		break;
	case 4:
		this.getPieces(game, this.piecesNames[0]);
		break;
	}
};

Player.prototype.setGameIO = function(gameio){
	this.gameio = gameio;
	for (var i = 0; i < this.playerPieces.length; ++i){
		this.playerPieces[i].setGameIO(this.gameio);
	}
};

Player.prototype.setDice = function(diceObject){
	this.diceObject = diceObject;
};

Player.prototype.setPieces = function(game, pieces, playername){

	for (var i = 0; i < pieces.length; ++i)
	{
		var group = this.game.add.group();
		var piece = new Piece(game, pieces[i].x, pieces[i].y, pieces[i].piece, pieces[i].imageId, pieces[i].uniqueId, false, pieces[i].state, pieces[i].index, false, group, playername);   
		piece.x_home = pieces[i].x_home;         
		piece.y_home = pieces[i].y_home; 
		piece.homeIndex = pieces[i].homeIndex;
		this.playerPieces.push(piece);
	}

};


Player.prototype.resetPlayer = function(){
	this.endOfPlay = 0;
	
	for (var i = 0; i < this.playerPieces.length; ++i){
		this.playerPieces[i].resetPiece();  
		this.playerPieces[i].visible = true;
	}
	this.redGraphicsIndex = 0;
	this.blueGraphicsIndex = 0;
	this.greenGraphicsIndex = 0;
	this.yellowGraphicsIndex = 0;
};


Player.prototype.updatePlayer = function(players){

	var player = null;
	for (var i = 0; i < players.length; ++i){
		if (players[i].playerName === this.playerName){
			player = players[i];
			break;
		}
	}

	if (player !== null)
	{
		this.setDice(player.diceObject);
		this.endOfPlay = player.endOfPlay;
		this.hasRolled = player.hasRolled;
		this.playerName = player.playerName;
		if (player.selectedPieceId !== null){
			this.setSelectedPieceById(player.selectedPieceId);
		}
		this.exitingGraphicsPositions = player.exitingGraphicsPositions;
		this.turn = player.turn;

		for (i = 0; i < player.pieces.length; ++i)
		{
			this.playerPieces[i].updatePiece(player.pieces);   
		}
	}

};

Player.prototype.drawSavedExitedPieces = function(graphics){

	for (var i = 0; i < this.playerPieces.length; ++i)
	{
		if (this.playerPieces[i].isExited()){
			this.drawExitedPiece(this.playerPieces[i], graphics);
		}
	}

};

//**********************************************Move Operation*****************************************

Player.prototype.play = function(playerPlayed){

	if (playerPlayed === null){
		this.gameio.emitPlay({playerName : this.playerName, gameId : this.gameId});
	}

	if (this.hasSelectedPiece())
	{
		var state = this.pieceMovement(this.selectedPiece);
		var path = null;
		var value = null;
		switch (state)
		{
		case 0:
			this.controller.unSelectUnplayedDie();
			this.error.showError("Rule does not apply.");
			break;
		case 1:
			//consume dice
			this.consumeSix();
			value = this.getRemainingDieValue();
			path = this.selectedPiece.plotPath(value);
			this.selectedPiece.moveToStart(path);
			break;
		case 2:
			this.consumeSix();
			this.selectedPiece.moveToStart();
			break;
		case 3:
			//Move forward with both dice values
			value = this.getBothDiceValues();
			path = this.selectedPiece.plotPath(value);
			this.selectedPiece.moveForward(path);
			break;
		case 4:
			value = this.getSelectedDieValue();
			if (value === 0){
				this.error.showError("Please select dice.");
			}
			else{
				path = this.selectedPiece.plotPath(value);
				this.selectedPiece.moveForward(path);
			}
			break;
		case 5:
			alert("Case 5!");
			break;
		case 6:
			//Use approprate die
			value = this.getAwaitingExitDieValue();
			path = this.selectedPiece.plotExitpath(value);
			this.selectedPiece.moveForward(path);
			break;
		case 7:
			value = this.getSelectedDieValue();
			if (value === 0){
				this.error.showError("Please select dice.");
			}
			else{
				path = this.selectedPiece.plotExitpath(value);
				this.selectedPiece.moveForward(path);
			}
			break;
		case 8:
			//Use both dice to move
			value = this.getAwaitingExitDieValue();
			path = this.selectedPiece.plotExitpath(value);
			this.selectedPiece.moveForward(path);
			this.getBothDiceValues();
			break;
		case 10:
			//Move towards exit with both dice values
			value = this.getBothDiceValues();
			path = this.selectedPiece.plotExitpath(value);
			this.selectedPiece.moveForward(path);
			break;
		default:
			this.diceSelectionError();
		break;
		}
	}
	else{

		this.controller.unSelectUnplayedDie();
		this.diceSelectionError();
	}
};

Player.prototype.diceSelectionError = function(){
	this.error.showError("Please select piece.");
};

Player.prototype.pieceMovement = function(selectedPiece){

	switch(selectedPiece.state){
	case 0: 
		return (this.rule.applyIddleStateRules(this));
	case 1:
		return (this.rule.applyActiveStateRule(this));
	case 2:
		return (this.rule.applyAwaitingExitStateRules(this));
	case 3:   
		return 0;

	}

};

Player.prototype.canMoveToNextAtHome = function(){
	var byWhatDie = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){
		var piece = this.playerPieces[i];
		if (piece.isAwaitingExit())
		{
			var start = piece.index;
			for (var m = 0; m < this.diceObject.length; ++m){
				if (this.diceObject[m].value !== 0){
					var stop = start + this.diceObject[m].value;
					if (stop <= 5){
						++byWhatDie;
					}
				}
			}
		}
	}
	return byWhatDie;
};

Player.prototype.canMoveSelectedToNextAtHome = function(){
	var byWhatDie = 0;
	var piece = this.selectedPiece;
	if (piece !== null){
		if (piece.isAwaitingExit()){
			var start = piece.index;
			for (var i = 0; i < this.diceObject.length; ++i){
				if (this.diceObject[i].value !== 0){
					var stop = start + this.diceObject[i].value;
					if (stop <= 5){
						++byWhatDie;
					}
				}
			}
		}
	}

	return byWhatDie;
};


Player.prototype.canMoveSamePieceSelectedCloserToExit = function(){
	var whatDie = 0;
	var piece = this.selectedPiece;
	if (piece.isAwaitingExit()){   
		var start = piece.index;    
		for (var i = 0; i < this.diceObject.length; ++i){
			if (this.diceObject[i].value !== 0){
				var stop = start + this.diceObject[i].value;
				if (stop <= 5){
					++whatDie;
				}   
			}  
		}     
	}
	return (whatDie > 1);
};

Player.prototype.canMoveAnotherAwaitingToExit = function(selectedPiece){

	var index = this.validateAwaitingExitDiceLeftover(selectedPiece.index, -1);

	for (var i = 0; i < this.playerPieces.length; ++i)
	{
		if (selectedPiece != this.playerPieces[i] && this.playerPieces[i].isAwaitingExit())
		{
			if (this.validateAwaitingExitDiceLeftover(this.playerPieces[i].index, index) >= 0){
				return true;   
			} 
		}
	}

	return false;
};


Player.prototype.validateAwaitingExitDiceLeftover = function(start, index){

	for (var i = 0; i < this.diceObject.length; ++i){
		if (this.diceObject[i].value !== 0)
		{      
			var stop = start + this.diceObject[i].value;   
			if (stop <= 5 && i != index){  
				return i;  
			}   
		}    
	} 
	return -1;
};


Player.prototype.validateAwaitingExitDiceSelection = function(){
	var piece = this.selectedPiece;
	if(piece !== null){
		return (this.validateNextExitMove(piece));
	}
	else{
		return false;
	}
};

Player.prototype.validateNextExitMove = function(piece){
	var selection = this.getNonConsumingSelectedDieValue();
	if (selection === 0){
		return false;
	}
	var start = piece.index;
	var stop = start + selection;
	if (stop <= 5){
		return true;
	}
	return false;
};

Player.prototype.getNonConsumingSelectedDieValue = function(){
	var selectedDice = this.controller.getSelectedDieValue();
	var d1 = 0;
	var d2 = 0;

	for (var i = 0; i < selectedDice.length; ++i){
		d1 += selectedDice[i].d1;
		d2 += selectedDice[i].d2;
	}
	var value = d1 + d2;
	return value;
};

Player.prototype.selectAll = function(){
	for (var i = 0; i < this.playerPieces.length; ++i){
		this.playerPieces[i].isSelectable = true;
		this.playerPieces[i].alpha = 1;
	}
};


Player.prototype.deSelectAll = function(){

	for (var i = 0; i < this.playerPieces.length; ++i){

		this.playerPieces[i].isSelectable = false;
		this.playerPieces[i].alpha = 0.7;
	}

};

Player.prototype.setSelectedPiece = function(piece){
	for (var i = 0; i < this.playerPieces.length; ++i){

		if (this.playerPieces[i].uniqueId === piece.uniqueId){
			if (this.selectedPiece !== null){
				this.selectedPiece.playDeselect();
			}
			this.selectedPiece = this.playerPieces[i];
			this.selectedPiece.playSelect();
			this.gameio.emitPieceSelection({uniqueId : this.selectedPiece.uniqueId, gameId : this.gameId, playerName : this.playerName});
			return true;
		}
	}

	return false;
};


Player.prototype.emitNextPlayer = function(){
	this.gameio.emitNextPlayer({screenName : this.playerName, gameId : this.gameId, gameMode : this.playerMode, sessionTurn : this.game.myTurn});
};

Player.prototype.updateGameOnDisconnection = function(updatedGameData){
	this.gameio.updateGameOnDisconnection(updatedGameData);
};


Player.prototype.setSelectedPieceById = function(id)
{
	for (var i = 0; i < this.playerPieces.length; ++i)
	{
		if (this.playerPieces[i].uniqueId === id){
			if (this.selectedPiece !== null){
				this.selectedPiece.playDeselect();
			}
			this.selectedPiece = this.playerPieces[i];
			this.selectedPiece.playSelect();
			return true;
		}
	}
	return false;
};


Player.prototype.getSelectedPieceById = function(id){
	for (var i = 0; i < this.playerPieces.length; ++i){
		if (this.playerPieces[i].uniqueId == id){
			return this.playerPieces[i];
		}
	}
	return null;
};

Player.prototype.setSelectedDieById = function(uniqueId){
	return (this.controller.selectDieById(uniqueId));
};

Player.prototype.setUnSelectedDieById = function(uniqueId){
	return (this.controller.unSelectDieById(uniqueId));
};


Player.prototype.belongsTo = function(name){
	return (this.playerName == name);
};

Player.prototype.checkPlayCompleted = function(){
	if (this.hasRolled && (this.diceIsEmpty() || !this.hasUnplayedDice())){
		return true;
	}
	return false;
};



//**********************************Dice Operation***************************************

Player.prototype.rollDice = function(dice, pusher, diceObjects){
	this.consumeDice();
	this.controller.consumeDice();
	this.pusher = pusher;
	var i;
	
	if (this.pusher){
		for (i = 0; i < dice.length; ++i){
			dice[i].setCurrentPlayer(this);
			dice[i].pusher = pusher;
			dice[i].roll(null);
		}

	}else{
		for (i = 0; i < dice.length; ++i){
			dice[i].setCurrentPlayer(this);
			dice[i].pusher = pusher;
			dice[i].roll(diceObjects);
		}

	}

	this.pusher = false;
};


Player.prototype.updateDiceObject = function(diceObject){
    
    for (var i = 0; i < this.diceObject.length; ++i){
        if (this.diceObject[i].uniqueId === diceObject.uniqueId){
            this.diceObject[i].value = diceObject.value;
            this.diceObject[i].playerName = diceObject.playerName;
            this.diceObject[i].selected = diceObject.playerName;
        }
    }
	this.diceCompletion();
};

Player.prototype.updateDiceObjectSelection = function(diceObject){

	for (var i = 0; i < this.diceObject.length; ++i){
		if (this.diceObject[i].uniqueId === diceObject.uniqueId){
			this.diceObject[i].selected = diceObject.selected;
			break;
		}
	}
};


Player.prototype.rolledSix = function(){
	return (this.diceObject.length > 0 && (this.diceObject[0].value == this.SIX || this.diceObject[1].value == this.SIX));
};

Player.prototype.rolledDoubleSix = function(){
	return (this.diceObject.length > 0 && this.diceObject[0].value == this.SIX && this.diceObject[1].value == this.SIX);
};

Player.prototype.hasUnplayedDice = function(){
	return (this.diceObject.length > 0 && (this.diceObject[0].value > 0 || this.diceObject[1].value > 0));
};


Player.prototype.diceCompleted = function(){
	if (this.endOfPlay == 2){
		this.rolled();
		return true;
	}
	else{
		return false;
	}
};

Player.prototype.diceCompletion = function(){
	++this.endOfPlay;
};

Player.prototype.diceCompletionSet = function(){
	this.endOfPlay = 2;
};

Player.prototype.diceCompletionReset = function(){
	this.endOfPlay = 0;
};


Player.prototype.consumeSix = function(){
	for (var i = 0; i < this.diceObject.length; ++i){
		if (this.diceObject[i].value == this.SIX){
			this.controller.consumeDie(this.diceObject[i].uniqueId);
			this.diceObject[i].value = 0;
			return true;
		}
	}
	return false;
};

Player.prototype.consumeDice = function(){
    for (var i = 0; i < this.diceObject.length; ++i){
        this.diceObject[i].value = 0;
	}
};

Player.prototype.consumeDie = function(value){
	for (var i = 0; i < this.diceObject.length; ++i){
		if (this.diceObject[i].value == value){
			this.controller.consumeDie(this.diceObject[i].uniqueId);
			this.diceObject[i].value = 0;
			return true;
		}
	}
	return false;
};

Player.prototype.diceIsEmpty = function(){
	return (this.diceObject[0].value === 0 && this.diceObject[1].value === 0);
};

Player.prototype.rolled = function(){
	this.hasRolled = true;
};

Player.prototype.unRolled = function(){
	this.hasRolled = false;
};


//****************************Get Operations********************************************

Player.prototype.getRemainingDieValue = function(){
	var value = 0;
	for (var i = 0; i < this.diceObject.length; ++i){
		if (this.diceObject[i].value > 0){
			this.controller.consumeDie(this.diceObject[i].uniqueId);
			value = this.diceObject[i].value;
			this.consumeDice();
			return value;
		}
	}
	return value;
};


Player.prototype.getAwaitingExitDieValue = function(){

	var dieOne = this.diceObject[0].value;
	var dieTwo = this.diceObject[1].value;

	if (this.selectedPiece.dieCanGetMeHome(dieOne)){
		this.controller.consumeDie(this.diceObject[0].uniqueId);
		this.diceObject[0].value = 0;
		return dieOne;
	}
	else if (this.selectedPiece.dieCanGetMeHome(dieTwo)){
		this.controller.consumeDie(this.diceObject[1].uniqueId);
		this.diceObject[1].value = 0;
		return dieTwo;
	}
	else if (this.selectedPiece.dieCanGetMeHome(dieOne + dieTwo)){
		this.controller.consumeDie(this.diceObject[0].uniqueId);
		this.diceObject[0].value = 0;
		this.controller.consumeDie(this.diceObject[1].uniqueId);
		this.diceObject[1].value = 0;
		return (dieOne + dieTwo);
	}
	else{
		return this.getHighestDieValueThatGetsMeCloserToHome();
	}
};

Player.prototype.getHighestDieValueThatGetsMeCloserToHome = function(){

	var dieValueOne = this.diceObject[0].value;
	var dieValueTwo = this.diceObject[1].value;

	if (this.selectedPiece.dieCanGetMeCloserToHome(dieValueOne) && !this.selectedPiece.dieCanGetMeCloserToHome(dieValueTwo)){

		this.controller.consumeDie(this.diceObject[0].uniqueId);
		this.diceObject[0].value = 0;
		return dieValueOne;
	}
	else if (!this.selectedPiece.dieCanGetMeCloserToHome(dieValueOne) && this.selectedPiece.dieCanGetMeCloserToHome(dieValueTwo)){

		this.controller.consumeDie(this.diceObject[1].uniqueId);
		this.diceObject[1].value = 0;
		return dieValueTwo;
	}
	else if (this.selectedPiece.dieCanGetMeCloserToHome(dieValueOne + dieValueTwo)){

		this.controller.consumeDie(this.diceObject[0].uniqueId);
		this.diceObject[0].value = 0;
		this.controller.consumeDie(this.diceObject[1].uniqueId);
		this.diceObject[1].value = 0;
		return (dieValueOne + dieValueTwo);
	}else{

		this.controller.consumeDie(this.diceObject[0].uniqueId);
		this.diceObject[0].value = 0;
		this.controller.consumeDie(this.diceObject[1].uniqueId);
		this.diceObject[1].value = 0;
		return (this.getHighestDieValue(dieValueOne, dieValueTwo));
	}

};

Player.prototype.getHighestDieValue = function(dieOne, dieTwo){  
	if (dieOne > dieTwo){
		return dieOne;
	}else{
		return dieTwo;
	}
};


Player.prototype.getActivePieces = function(){  
	var activePieces = [];
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isActive()){
			activePieces.push(this.playerPieces[i]);
		}    
	}     
	return activePieces;  
};


Player.prototype.getAwaitingExitStatePieces = function(){  
	var awaitingExitPieces = [];
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isAwaitingExit()){
			awaitingExitPieces.push(this.playerPieces[i]);
		}    
	}     
	return awaitingExitPieces;  
};


Player.prototype.getBothDiceValues = function(){
	var value = 0;
	for (var i = 0; i < this.diceObject.length; ++i){
		this.controller.consumeDie(this.diceObject[i].uniqueId);
		value += this.diceObject[i].value;
		this.diceObject[i].value = 0;
	}
	return value;
};


Player.prototype.getSelectedDieValue = function(){
	var selectedDice = this.controller.getSelectedDieValue();
	var d1 = 0;
	var d2 = 0;

	for (var i = 0; i < selectedDice.length; ++i){
		d1 += selectedDice[i].d1;
		d2 += selectedDice[i].d2;
	}
	this.consumeDie(d1);
	this.consumeDie(d2);
	var value = d1 + d2;
	return value;
};

Player.prototype.getNextSelectedPiece = function(){
	for (var i = 0; i < this.playerPieces.length; ++i){
		if (this.playerPieces[i].isActive()){
			this.selectedPiece = this.playerPieces[i];
			this.selectedPiece.playSelect();
			return true;
		}
	}
	return false;
};

Player.prototype.canExitingPiecesUseRemainingDiceValue = function(){ 

	var unselectedDiceValue = this.controller.getUnselectedDieValue();
	for (var j = 0; j < unselectedDiceValue.length; ++j )
	{
		for (var i = 0; i < this.playerPieces.length; ++i)
		{    
			if (this.playerPieces[i].awaitingExitCanUseDiceValue(unselectedDiceValue[j])){
				return true;
			}    
		}     
	}
	return false;
};


//******************************Has Operations*************************************************************

Player.prototype.hasMovingPieceCallback = function(callback){
	callback(true);
};

Player.prototype.hasMovingPiece = function(){
	var movingPieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isMoving()){
			++movingPieces; 
			break;
		}    
	}     
	return (movingPieces > 0);
};

Player.prototype.hasSelectedPiece = function(){
	return (this.selectedPiece !== null);
};



Player.prototype.hasActivePieces = function(){    
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isActive()){
			return true;  
		}    
	}     
	return false;  
};


Player.prototype.hasAwaitingExitStatePieces = function(){  
	var awaitingExitPieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isAwaitingExit()){
			++awaitingExitPieces;
			break;
		}    
	}     
	return (awaitingExitPieces > 0);  
};

Player.prototype.hasMoreThanOneAwaitingExitStatePieces = function(){  
	var awaitingExitPieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isAwaitingExit()){
			++awaitingExitPieces;

			if (awaitingExitPieces > 1){
				break;
			}
		}    
	}     
	return (awaitingExitPieces > 1);  
};

Player.prototype.hasOnePieceLeft = function(){  
	var onlyPiece = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isExited()){
			++onlyPiece;
		}    
	}     
	return (onlyPiece == (this.playerPieces.length - 1));  
};

Player.prototype.hasIddlePieces = function(){  
	var iddlePieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isIddle()){
			++iddlePieces;
			break;
		}    
	}     
	return (iddlePieces > 0);  
};

Player.prototype.hasMoreThanOneIddlePiece = function(){  
	var iddlePieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isIddle()){
			++iddlePieces;
			if (iddlePieces > 1){
				break;
			}
		}    
	}     
	return (iddlePieces > 1);  
};


Player.prototype.hasExactlyOneActivePiece = function(){ 
	var activePiece = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isActive()){
			++activePiece;  
			if (activePiece > 1){
				break;
			}
		}    
	}     
	return (activePiece == 1);  
};

Player.prototype.hasMoreThanOneActivePiece = function(){ 
	var activePiece = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isActive()){
			++activePiece;  
			if (activePiece > 1){
				break;
			}
		}    
	}     
	return (activePiece > 1);  
};

Player.prototype.hasExactlyOneActivePieceLeft = function(){ 
	var onlyPiece = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isExited()){
			++onlyPiece;  
		}    
	}     
	return (onlyPiece == (this.playerPieces.length - 1));  
};

Player.prototype.hasAllPiecesExited = function(){ 
	var allPieces = 0;
	for (var i = 0; i < this.playerPieces.length; ++i){    
		if (this.playerPieces[i].isExited()){
			++allPieces;  
		}    
	}     
	return (allPieces == this.playerPieces.length);  
};

Player.prototype.hasExactlyOneUnplayedDie = function(){
	return ( (this.diceObject.length > 0) && (this.diceObject[0].value > 0 && this.diceObject[1].value === 0) || ( this.diceObject.length > 0) && (this.diceObject[1].value > 0 && this.diceObject[0].value === 0));
};

Player.prototype.playerTurn = function(){
	this.turn = true;
};

Player.prototype.nextTurn = function(){
	this.turn = false;
};

Player.prototype.myTurn = function(){
	return (this.turn === true);
};



Player.prototype.exitAll = function(){

	/*
    for (var i = 0; i < this.playerPieces.length-2; ++i){
        this.playerPieces[i].exit();
        this.playerPieces[i].visible = false;
    }

    if (this.playerPieces[6].piece == "blue"){
        setBlueParameter(this.playerPieces[6]);
    }

    if (this.playerPieces[6].piece == "green"){
        setGreenParameter1(this.playerPieces[6]);
    }

    if (this.playerPieces[7].piece == "green"){
        setGreenParameter2(this.playerPieces[7]);
    }
	 */


};

Player.prototype.resetAllPiecesExited = function(){ 
	for (var i = 0; i < this.playerPieces.length; ++i){    
		this.playerPieces[i].iddle();
	}     
};

Player.prototype.selectsDieValueSix = function(){ 
	var selectedDice = this.controller.getSelectedDieValue();
	return ((selectedDice[0].d1 === 6) || (selectedDice[0].d2 === 6));
};


Player.prototype.getExitingPieceGraphicsPosition = function(piece){
	var graphicsPositions = {};
	switch(piece.piece){
	case "red":
		graphicsPositions = {y : 100, color: "0xFF0000"};
		return graphicsPositions;
	case "blue": 
		graphicsPositions = {y : 140, color: "0x0000FF"};
		return graphicsPositions;
	case "yellow":
		graphicsPositions = {y : 180, color: "0xFFFF00"};
		return graphicsPositions;
	case "green":
		graphicsPositions = {y : 220, color: "0x00FF40"};
		return graphicsPositions;
	}
};


Player.prototype.getNextGraphicsPosition = function(piece){

	switch(piece.piece){
	case "red":
		if (this.redGraphicsIndex > 3){
			this.redGraphicsIndex = 0;
			return this.redGraphicsIndex;
		}
		return ++this.redGraphicsIndex;
	case "blue": 
		if (this.blueGraphicsIndex > 3){
			this.blueGraphicsIndex = 0;
			return this.blueGraphicsIndex;
		}
		return ++this.blueGraphicsIndex;
	case "yellow":
		if (this.yellowGraphicsIndex > 3){
			this.yellowGraphicsIndex = 0;
			return this.yellowGraphicsIndex;
		}
		return ++this.yellowGraphicsIndex;
	case "green":
		if (this.greenGraphicsIndex > 3){
			this.greenGraphicsIndex = 0;
			return this.greenGraphicsIndex;
		}
		return ++this.greenGraphicsIndex;
	}
};

Player.prototype.drawExitedPiece = function(piece, graphics){
	var index = this.getNextGraphicsPosition(piece);
	var graphicsPosition = this.getExitingPieceGraphicsPosition(piece);

	if (graphicsPosition === null){
		return;
	}
	graphics.beginFill(graphicsPosition.color, 1);
	graphics.drawCircle(this.exitingGraphicsPositions[index], graphicsPosition.y, 30);

};

Player.prototype.getUuid = function(){
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
};



