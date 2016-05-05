Ludo.WaitMenu = function(game) {
  
};

Ludo.WaitMenu.prototype = {
		
	init : function(data, loadGame, socket, myTurn, owner, isMobile, menuMusic){
		this.ready = false;
		this.screenName = data.screenName;
		this.gameId = data.gameId;
		this.loadGame = loadGame;
		this.socket = socket;
		this.data = data;
		this.myTurn = myTurn;
		this.owner = owner;
		this.isMobile = isMobile;
		this.menuMusic = menuMusic;
		
		this.gameCodeBg = this.game.add.nineSlice((this.game.width / 2), (this.game.height /2) - 200, 'input', 600, 100);
        this.gameCodeBg.anchor.set(0.5);
        this.gameCode = this.game.add.inputField((this.game.width / 2) - 380  , (this.game.height /2) - 220, {
            font: '35px Arial',
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
        this.gameCode.value =  this.gameId;
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
		var turn = this.myTurn;
		var owner = this.owner;
		var isMobile = this.isMobile;
		var menuMusic = this.menuMusic;
		
		this.socket.on('startGame', function(gameData){
			if (menuMusic != null){
				menuMusic.destroy();
			}
			
        	state.start('Game', true, false, gameData, saveFlag, socket, turn, owner, isMobile);
        });
		
        
        this.socket.on('connectMultiplayerGame', function(gameData){
        
        });
        
        
        if (this.owner){
        	this.userOne.value =  this.data.players[0].playerName + ' created game. Waiting for other players...';
    		this.userOne.updateText();
        }
        
        
	},

    preload: function() {
    },
    
    create: function() {
    	this.filter;
        this.sprite;
        this.soundIcon = this.game.add.sprite(850, 30, "soundIcon");
		this.soundIcon.anchor.set(0.5);
		this.soundIcon.scale.x = 0.2;
		this.soundIcon.scale.y = 0.2;
		this.soundIcon.inputEnabled = true;
		this.soundIcon.input.enableDrag();
		this.soundIcon.events.onInputDown.add(this.muteMusic, this);
        
        
        if (this.isMobile === false){
        	this.sprite = this.game.add.sprite();
        	this.sprite.width = 900;
        	this.sprite.height = 720;
        	this.filter = this.game.add.filter('Fire', 900, 720);
        	this.filter.alpha = 0.0;
        	this.sprite.filters = [ this.filter ];
        }else{
        	
        	this.game.stage.backgroundColor = "#171642";
        }
        
        
        this.start_game = this.make.button((this.game.width / 2) - 90, (this.game.height/ 2) + 200, 'start-game', this.startGame, this, 2, 1, 0);
        this.start_game.visible = false;
        this.buttonGroup = this.add.group();
        this.buttonGroup.add(this.start_game);
        var userOne = this.userOne;
        var userTwo = this.userTwo;
        var userThree = this.userThree;
        var userFour = this.userFour;
        var start_game = this.start_game;
        var owner = this.owner;
        
        this.socket.on('disconnected', function(message){
    		start_game.visible = false;
    		userOne.value =  message;
    		userOne.updateText();
        });
        
        
        updatePlayerActivity = function(data)
        {
        	
        	var numOfPlayers = 0;
        	
        	for (var i = 0; i < data.players.length; ++i){
        		if (data.players[i].playerName != null){
        			++numOfPlayers;
        		}
        	}
        	
        	switch (numOfPlayers)
        	{
            	case 1:
            		userOne.value =  data.players[0].playerName + ' created game. Waiting for other players...';
            		userOne.updateText();
            		break;
            	case 2:
            		userOne.value =  data.players[0].playerName + ' created game. Waiting for other players...';
            		userOne.updateText();
            		if (data.complete)
            		{
            			userTwo.value =  data.players[1].playerName + ' joined game. Waiting for game creator to start game...';
            			userTwo.updateText();
            			if (owner){
            				start_game.visible = true;
            			}
            		}
            		else
            		{
            			userTwo.value =  data.players[1].playerName + ' joined game. Waiting for other players...';
            			userTwo.updateText();
            		}
            		break;
            	case 3:
            		userOne.value =  data.players[0].playerName + ' created game. Waiting for other players..';
            		userOne.updateText();
            		userTwo.value =  data.players[1].playerName + ' joined game. Waiting for other players..';
            		userTwo.updateText();
            		userThree.value =  data.players[2].playerName + ' joined game. Waiting for other players..';
            		userThree.updateText();
            		break;
            	case 4:
            		userOne.value =  data.players[0].playerName + ' created game. Waiting for other players..';
            		userOne.updateText();
            		userTwo.value =  data.players[1].playerName + ' joined game. Waiting for other players..';
            		userTwo.updateText();
            		userThree.value =  data.players[2].playerName + ' joined game. Waiting for other players..';
            		userThree.updateText();
            		userFour.value =  data.players[3].playerName + ' joined game. Waiting for game creator to start game.';
            		userFour.updateText();
            		if (owner){
        				start_game.visible = true;
        			}
            		break;
            	default :
            		break;	
        	}  
        	
        };
        
        this.socket.on('awaitingStartGame', function(data){
        	userOne.value = " ";
        	userTwo.value = " ";
        	userThree.value = " ";
        	userFour.value = " ";
        	updatePlayerActivity(data);
        	
        });
        
        if (this.owner === false){
        	updatePlayerActivity(this.data);
        }
        
        
    },
     
    startGame : function(){
    	var saveFlag = this.loadGame;
		var state = this.game.state;
		var turn = this.myTurn;
		var owner = this.owner;
		var socket = this.socket;
		var isMobile = this.isMobile;
		if (this.menuMusic != null){
			this.menuMusic.destroy();
		}
		
    	this.socket.emit('startGame', this.gameId, function (gameData){
			state.start('Game', true, false, gameData, saveFlag, socket, turn, owner, isMobile);
		});
    },
    
    muteMusic : function(){
		if (this.game.sound.mute === true){
			this.game.sound.mute = false;
			this.soundIcon.scale.x = 0.2;
			this.soundIcon.scale.y = 0.2;
		}else{
			this.game.sound.mute = true;
			this.soundIcon.scale.x = 0.1;
			this.soundIcon.scale.y = 0.1;
		}
	},
    
    update: function() {
    	if (this.isMobile === false){
    		this.filter.update();
    	}
    }
};