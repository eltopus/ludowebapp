Ludo.StartMenu = function(game){
    this.startBG;
    this.game = game;
    this.gameMode = 2;
    this.loadGame = false;
    this.socket = null;
}

Ludo.StartMenu.prototype = {
    
    create: function() {
        this.filter;
        this.sprite;
       
        /*
        this.filter = new Phaser.Filter(this.game, null, this.fragmentSrc);
        this.filter.setResolution(800, 600);
        this.sprite = this.game.add.sprite();
        this.sprite.width = 900;
        this.sprite.height = 720;
        this.sprite.filters = [ this.filter ];
        */
        
        
        this.sprite = this.game.add.sprite();
        this.sprite.width = 900;
        this.sprite.height = 720;
        this.filter = this.game.add.filter('Fire', 900, 720);
	    this.filter.alpha = 0.0;
        this.sprite.filters = [ this.filter ];
        
        this.two_player = this.make.button((this.game.width / 2) - 360, (this.game.height /2) - 5, 'two-player', this.twoPlayer, this, 2, 1, 0);
        this.four_player = this.make.button((this.game.width / 2) + 180, (this.game.height /2) - 5, 'four-player', this.fourPlayer, this, 2, 1, 0);
        this.start_game = this.make.button((this.game.width / 2) - 90, this.game.height / 4, 'start-game', this.startGame, this, 2, 1, 0);
        this.load_game = this.make.button((this.game.width / 2) - 85, this.game.height /2, 'load-game', this.retrieveGame, this, 2, 1, 0);
           
        
        this.two_player.onInputDown.add(this.down, this);
        this.four_player.onInputDown.add(this.down, this);
        this.load_game.onInputDown.add(this.down, this);

       
        this.buttonGroup = this.add.group();
        this.buttonGroup.add(this.two_player);
        this.buttonGroup.add(this.four_player);
        this.buttonGroup.add(this.start_game);
        this.buttonGroup.add(this.load_game);
        
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({ duration: 1000, ease: Phaser.Easing.Linear.None, properties: { alpha: 0, scale: { x: 1.4, y: 1.4 } }});
       
        this.gameCodeBg = this.game.add.nineSlice(this.game.width / 2, 450, 'input', 170, 40);
        this.gameCodeBg.anchor.set(0.5);
        this.gameCode = this.game.add.inputField((this.game.width / 2) - 60, 450 - 17, {
            font: '18px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            width: 150,
            max: 10,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Game Code',
            textAlign: 'left'
        });
        
        this.gameCodeBg.alpha = 0.0;
        this.gameCode.alpha = 0.0;
     
        this.screenNameBg = this.game.add.nineSlice((this.game.width / 2) , (this.game.height /2) + 150, 'input', 170, 40);
        this.screenNameBg.anchor.set(0.5);
        this.screenName = this.game.add.inputField((this.game.width / 2) - 60 , (this.game.height /2) + 130, {
            font: '18px Arial',
            fill: '#212121',
            fillAlpha: 0,
            fontWeight: 'bold',
            width: 150,
            max: 10,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Screen Name',
            textAlign: 'left'
        });

        this.screenNameBg.alpha = 0.0;
        this.screenName.alpha = 0.0;
        
        
    },
    
    twoPlayer : function(){
        this.two_player.alpha = 0.5;
        this.four_player.alpha = 1;
        this.load_game.alpha = 1;
        this.gameMode = 2;
        this.loadGame = false;
        this.gameCodeBg.alpha = 0.0;
        this.gameCode.alpha = 0.0;
        this.screenNameBg.alpha = 0.0;
        this.screenName.alpha = 0.0;
    },
    
    fourPlayer : function(){
        this.four_player.alpha = 0.5;
        this.two_player.alpha = 1;
        this.load_game.alpha = 1;
        this.gameMode = 4;
        this.loadGame = false;
        this.gameCodeBg.alpha = 0.0;
        this.gameCode.alpha = 0.0;
        this.screenNameBg.alpha = 0.0;
        this.screenName.alpha = 0.0;
    },
    
    retrieveGame : function(){
        this.load_game.alpha = 0.5;
        this.four_player.alpha = 1.0;
        this.two_player.alpha = 1.0;
        this.loadGame = true;
        this.gameCodeBg.alpha = 0.5;
        this.gameCode.alpha = 1.0;
        this.screenNameBg.alpha = 0.5;
        this.screenName.alpha = 1.0;
    },
    
    
    down: function(p)
    {
        if (p.key == "two-player"){
           
        }
        else if (p.key == "four-player"){
            
        }
        else if (p.key == "load-game"){
            
        }
    },
    
    startGame: function(pointer){
    	
    	if (this.socket === null){
    		this.socket = io();
    	}
    	var socket = this.socket;
    	var game = this;
    	var gameMode = this.gameMode;
    	var loadGame = this.loadGame;
    	var sprite = this.sprite;
    	var gameCodeBg = this.gameCodeBg;
        var gameCode = this.gameCode;
        var gameId = this.gameCode.value;
        
    	
        
        if (loadGame){
        	
        	if (!gameId || 0 === gameId.length){
            	alert('Please enter game id');
    			return;
    		}
        	
        	socket.emit('tryConnecting', {id : socket.id, gameId : gameId}, function (data){

    			if (data.ok)
    			{
    				
    				if (loadGame)
    				{
    				
    					if (loadGame && data.gameData === null){
    						alert("Cannot connect to game server!!!");
    						return;
    					}
    					console.log('Event was processed successfully ' + socket.id);
    					game.game.state.states['Game'].save = JSON.parse(data.gameData);
    					game.game.state.states['Game'].playerMode = gameMode;
    					game.game.state.states['Game'].saveFlag = loadGame;
    					game.game.state.states['Game'].socket = socket;
    					game.game.state.states['Game'].savedGameId = gameId.toString();
    					sprite.destroy();
    					gameCodeBg.destroy();
    			        gameCode.destroy();
    					game.game.stateTransition.to('Game');
    							
    				}
    				
    			}else{
    				alert("Game ID : " + gameId + " does not exist!");
    			}

    		});
        	
        }else{
			game.game.state.states['Game'].playerMode = gameMode;
            game.game.state.states['Game'].saveFlag = loadGame;
            game.game.state.states['Game'].socket = socket;
            sprite.destroy();
			gameCodeBg.destroy();
	        gameCode.destroy();
            game.game.stateTransition.to('Game');
		}
    	
    	
        
    },
    
    
    update: function(){
        this.filter.update();
    }
    
};