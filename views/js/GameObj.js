GameObj = function () {

	this.playerMode = 0;
	this.playerName = "";
	this.playerColors = [];

	this.gameCode ="";
	this.joinPlayerName="";
	
	this.createGame = false;
	this.joinGame = false;

};

GameObj.prototype.resetColors = function(color) {
	this.playerColors = [];
};

GameObj.prototype.addPlayerColors = function(color) {


	if (this.playerColors.length === 0){
		this.playerColors.push(color);
		console.log("Adding First Color: " + this.playerColors);
		return true;
		
	}else
	{
		for ( var i = 0; i < this.playerColors.length; ++i)
		{

			if (this.playerColors[i] === color){
				this.playerColors.splice(i, 1);
			console.log("Removing Colors: " + this.playerColors);
				return false;
			}
		}

		switch(this.playerMode)
		{

			case 2:
			{
				if (this.playerColors.length <= 1)
				{
					this.playerColors.push(color);
					console.log("Adding 2-Player Colors: " + this.playerColors);
					return true;
				}
				
				return false;
				
			}
		case 4:
			{
				if (this.playerColors.length < 1){
					this.playerColors.push(color);
					//console.log("Adding 4 Player Colors: " + this.playerColors);
					return true;
				}
					
				return false;
				
			}
		}
		
		return false;
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