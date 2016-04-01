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
        
        this.two_player = this.make.button(this.world.centerX-350, this.world.centerY, 'two-player', this.twoPlayer, this, 2, 1, 0);
        this.four_player = this.make.button(this.world.centerX+200, this.world.centerY, 'four-player', this.fourPlayer, this, 2, 1, 0);
        this.start_game = this.make.button(this.world.centerX-80, this.world.centerY-200, 'start-game', this.startGame, this, 2, 1, 0);
        this.load_game = this.make.button(this.world.centerX-70, this.world.centerY+10, 'load-game', this.retrieveGame, this, 2, 1, 0);
           
        
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
        

        
    },
    
    twoPlayer : function(){
        this.two_player.alpha = 0.5;
        this.four_player.alpha = 1;
        this.load_game.alpha = 1;
        this.gameMode = 2;
        this.loadGame = false;
    },
    
    fourPlayer : function(){
        this.four_player.alpha = 0.5;
        this.two_player.alpha = 1;
        this.load_game.alpha = 1;
        this.gameMode = 4;
        this.loadGame = false;
    },
    
    retrieveGame : function(){
        this.load_game.alpha = 0.5;
        this.four_player.alpha = 1;
        this.two_player.alpha = 1;
        this.loadGame = true;
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
    	var socket = io();
    	var game = this;
    	var gameMode = this.gameMode;
    	var loadGame = this.loadGame;
    	
    	if (loadGame)
    	{
    		socket.emit('join', {}, function (data){

    			if (data.ok){
    				console.log('Event was processed successfully');
    				socket.on('join', function(gameData){
    					game.game.state.states['Game'].save = JSON.parse(gameData);
    					game.game.state.states['Game'].playerMode = gameMode;
    					game.game.state.states['Game'].saveFlag = loadGame;
    					game.game.state.states['Game'].socket = socket;
    					game.game.stateTransition.to('Game');
    				});

    			}

    		});
    		
    	}
    	else
    	{
    		this.game.state.states['Game'].playerMode = this.gameMode;
            this.game.state.states['Game'].saveFlag = this.loadGame;
            this.game.state.states['Game'].socket = socket;
            this.game.stateTransition.to('Game');
            this.sprite.destroy();
    	}
    	
    	
        
    },
    
    
    update: function(){
        this.filter.update();
    }
    
};