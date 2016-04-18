Ludo.WaitMenu = function(game) {
  
};

Ludo.WaitMenu.prototype = {
		
	init : function(data, loadGame, socket){
		this.ready = false;
		this.whoJoined = data.whoJoined;
		this.screenName = data.screenName;
		this.gameId = data.gameId;
		this.gameMode = data.playerMode;
		this.loadGame = loadGame;
		this.socket = socket;
		this.data = data;
		this.joinNotification = false;
		
		this.gameCodeBg = this.game.add.nineSlice((this.game.width / 2), (this.game.height /2) - 200, 'input', 600, 100);
        this.gameCodeBg.anchor.set(0.5);
        this.gameCode = this.game.add.inputField((this.game.width / 2) - 380  , (this.game.height /2) - 220, {
            font: '25px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            width: 700,
            height: 100,
            max: 100,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: ' ',
            textAlign: 'center'
        });
        
        
        this.gameCodeBg.alpha = 0.5;
        this.gameCode.value =  'Join Code: ' + this.gameId ;
        this.gameCode.updateText();
        this.gameCodeBg.inputEnabled  = false;
        this.gameCode.inputEnabled = false;
        
 
        this.userGameCodeBg = this.game.add.nineSlice((this.game.width / 2), (this.game.height /2), 'input', 600, 250);
        this.userGameCodeBg.anchor.set(0.5);
        this.userOne = this.game.add.inputField((this.game.width / 2) - 300 , (this.game.height /2) - 100, {
            font: '15px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            backgroundColor : '#1affff',
            width: 700,
            height: 100,
            max: 100,
            padding: 4,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: ' ',
            zoom : false,
            textAlign: 'left'
        });
        
        this.userGameCodeBg.alpha = 0.5;
        
        this.userTwo = this.game.add.inputField((this.game.width / 2) - 300 , (this.game.height /2) - 50, {
            font: '15px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            backgroundColor : '#1affff',
            width: 700,
            height: 100,
            max: 200,
            padding: 4,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: ' ',
            zoom : false,
            textAlign: 'left'
        });
        
        this.userThree = this.game.add.inputField((this.game.width / 2) - 300 , (this.game.height /2), {
            font: '15px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            backgroundColor : '#1affff',
            width: 700,
            height: 100,
            max: 200,
            padding: 4,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: ' ',
            zoom : false,
            textAlign: 'left'
        });
        
        this.userFour = this.game.add.inputField((this.game.width / 2) - 300 , (this.game.height /2) + 50, {
            font: '15px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            backgroundColor : '#1affff',
            width: 700,
            height: 100,
            max: 200,
            padding: 4,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: ' ',
            zoom : false,
            textAlign: 'left'
        });
		
        
		var saveFlag = loadGame;
		var state = this.game.state;
		
		this.socket.on('startGame', function(gameData){
        	state.start('Game', true, false, gameData, saveFlag, socket);
        });
		
		this.socket.on('disconnected', function(message){
        	alert(message);
        });
        
        this.socket.on('connectMultiplayerGame', function(gameData){
        
        });
        
        
	},

    preload: function() {
    },
    
    create: function() {
    	
    	this.filter;
        this.sprite;
        this.sprite = this.game.add.sprite();
        this.sprite.width = 900;
        this.sprite.height = 720;
        this.filter = this.game.add.filter('Fire', 900, 720);
	    this.filter.alpha = 0.0;
        this.sprite.filters = [ this.filter ];
        
        this.start_game = this.make.button((this.game.width / 2) - 90, (this.game.height/ 2) + 200, 'start-game', this.startGame, this, 2, 1, 0);
        this.start_game.visible = false;
        this.buttonGroup = this.add.group();
        this.buttonGroup.add(this.start_game);
    	
    	var data = this.data;
        var userOne = this.userOne;
        var userTwo = this.userTwo;
        var userThree = this.userThree;
        var userFour = this.userFour;
        var start_game = this.start_game;
        
        switch (data.whoJoined)
    	{
        	case 1:
        		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players..';
        		userOne.updateText();
        		break;
        	case 2:
        		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players..';
        		userOne.updateText();
        		if (data.complete)
        		{
        			start_game.visible = true;
        			userTwo.value =  data.playerNames[1] + ' joined game. Waiting for game creator to start game';
        			userTwo.updateText();
        		}
        		else
        		{
        			userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players..';
        			userTwo.updateText();
        		}
        		
        		break;
        	case 3:
        		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players...';
        		userOne.updateText();
        		userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players...';
        		userTwo.updateText();
        		userThree.value =  data.playerNames[2] + ' joined game. Waiting for other players...';
        		userThree.updateText();
        		break;
        	case 4:
        		start_game.visible = true;
        		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players...';
        		userOne.updateText();
        		userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players...';
        		userTwo.updateText();
        		userThree.value =  data.playerNames[2] + ' joined game. Waiting for other players...';
        		userThree.updateText();
        		userFour.value =  data.playerNames[3] + ' joined game. Waiting for game creator to start game...';
        		userFour.updateText();
        		break;
        	
    	} 
        
        this.socket.on('awaitingStartGame', function(data){
        	
        	switch (data.whoJoined)
        	{
            	case 1:
            		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players...';
            		userOne.updateText();
            		break;
            	case 2:
            		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players...';
            		userOne.updateText();
            		if (data.complete)
            		{
            			start_game.visible = true;
            			userTwo.value =  data.playerNames[1] + ' joined game. Waiting for game creator to start game...';
            			userTwo.updateText();
            		}
            		else
            		{
            			userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players...';
            			userTwo.updateText();
            		}
            		break;
            	case 3:
            		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players..';
            		userOne.updateText();
            		userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players..';
            		userTwo.updateText();
            		userThree.value =  data.playerNames[2] + ' joined game. Waiting for other players..';
            		userThree.updateText();
            		break;
            	case 4:
            		start_game.visible = true;
            		userOne.value =  data.playerNames[0] + ' created game. Waiting for other players..';
            		userOne.updateText();
            		userTwo.value =  data.playerNames[1] + ' joined game. Waiting for other players..';
            		userTwo.updateText();
            		userThree.value =  data.playerNames[2] + ' joined game. Waiting for other players..';
            		userThree.updateText();
            		userFour.value =  data.playerNames[3] + ' joined game. Waiting for game creator to start game.';
            		userFour.updateText();
            		break;
        	}  
        });
        
    },
     
    startGame : function(){
    	
    },
    
    update: function() {
        this.filter.update();
    }
};