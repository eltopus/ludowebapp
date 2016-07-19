GameObj = function () {

	this.playerMode = 0;
	this.playerName = "";
	this.playerColors = [];
	
	this.gameCode ="";
	this.joinPlayerName="";
    
};

GameObj.prototype.addPlayerColors = function(color) {
	
	for ( var i = 0; i < this.playerColors.length; ++i){
		
		if (this.playerColors[i] === color){
			console.log("Colors: " + this.playerColors[i] + " is already chosen");
			return;
		}
	}
	
	switch(this.playerMode){
	
		case 2:{
			if (this.playerColors.length <= 1){
				this.playerColors.push(color);
			}else{
				this.playerColors.shift();
				this.playerColors.push(color);
			}
			console.log("Colors: " + this.playerColors);
			break;
		}
		case 4:{
			if (this.playerColors.length < 1){
				this.playerColors.push(color);
			}else{
				this.playerColors.shift();
				this.playerColors.push(color);
			}
			console.log("Colors: " + this.playerColors);
			break;
		}
	}
};

GameObj.prototype.verifyCreateGame = function(){
	
	if (this.playerMode === 0){
		return "Please Select Player Mode";
	}
	else if (this.playerName === ""){
		return "Please Enter Valid Player Name";
	}
	else if (this.playerColors.length === 0){
		return "Please Select Player Colors";
	}
	else if (this.playerMode === 2 && this.playerColors.length < 2){
		return "Please Select 2 Player Colors";
	}
	else if (this.playerMode === 4 && this.playerColors.length < 1){
		return "Please Select 1 Player Color";
	}
	else{
		console.log("PlayerMode: " + this.playerMode + " PlayerName: " + this.playerName + " Colors: " + this.playerColors);
		return "ok";
	}
};

GameObj.prototype.verifyJoinGame = function(){
	
	
	if (this.joinPlayerName === ""){
		return "Please Enter Valid Player Name";
	}
	else if (this.gameCode === ""){
		return "Please Enter Valid Game Code";
	}
	else{
		console.log("PlayerName: " + this.joinPlayerName + " GameCode: " + this.gameCode);
		return "ok";
	}
};