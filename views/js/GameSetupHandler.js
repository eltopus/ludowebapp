/**
 * http://usejsdoc.org/
 */


var selectRedColorHandler = function(){
 
	var colorAdded = gameObj.addPlayerColors("red");
	if (colorAdded){
		console.log("RED Color was Added");
		var canvas = document.getElementById("circleOne");
		var context = canvas.getContext("2d");
		context.fillStyle = "red";
		context.fillRect(5,5,10,10);
	}else{
		console.log("RED Color was NOT Added");
		var canvas = document.getElementById("circleOne");
		var context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
 
};

var selectBlueColorHandler = function(){
	 
		
	var colorAdded = gameObj.addPlayerColors("blue");
	if (colorAdded){
		console.log("Blue Color was Added");
		var canvas = document.getElementById("circleTwo");
		var context = canvas.getContext("2d");
		context.fillStyle = "blue";
		context.fillRect(5,5,10,10);
		
	}else{
		console.log("Blue Color was NOT Added");
		var canvas = document.getElementById("circleTwo");
		var context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
 
};

var selectYellowColorHandler = function(){
	 
	var colorAdded = gameObj.addPlayerColors("yellow");
	if (colorAdded){
		console.log("Yellow Color was Added");
		var canvas = document.getElementById("circleThree");
		var context = canvas.getContext("2d");
		context.fillStyle = "yellow";
		context.fillRect(5,5,10,10);
	}else{
		console.log("Yellow Color was NOT Added");
		var canvas = document.getElementById("circleThree");
		var context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	     
	}

 
};

var selectGreenColorHandler = function(){
	 
	var colorAdded = gameObj.addPlayerColors("green");
	if (colorAdded){
		console.log("Green Color was Added");
		var canvas = document.getElementById("circleFour");
		var context = canvas.getContext("2d");
		context.fillStyle = "green";
		context.fillRect(5,5,10,10);
	}else{
		console.log("Green Color was NOT Added");
		var canvas = document.getElementById("circleFour");
		var context = canvas.getContext("2d");
	    context.clearRect(0, 0, canvas.width, canvas.height);
	}

};

var selectTwoPlayerHandler = function(){
	gameObj.playerMode = 2;
	$('.playerModeKlass h5').text('2-PLAYER');
	
};

var selectFourPlayerHandler = function(){
	gameObj.playerMode = 4;
	$('.playerModeKlass h5').text('4-PLAYER');
};
