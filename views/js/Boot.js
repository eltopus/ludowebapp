var Ludo = {};

Ludo.Boot = function(game){};

Ludo.Boot.prototype = {
		
	init : function(){
		this.game.plugins.add(Fabrique.Plugins.NineSlice);	
	},
    preload: function() {
        this.load.image('board', 'images/ludo.jpg');
        this.load.image('red_piece', 'images/red_button.png');
        this.load.image('blue_piece', 'images/blue_button.png');
        this.load.image('green_piece', 'images/green_button.png');
        this.load.image('yellow_piece', 'images/yellow_button.png');
        this.load.image('dice', 'images/flick.jpg');
        this.load.image('play', 'images/playbutton.png');
        this.load.image('display', 'images/display.png');
        this.load.image('error', 'images/alert.png');
        this.load.image('rolldisplay', 'images/rolldisplay.png');
        this.load.image('savebutton', 'images/savebutton.png');
        this.load.image('four-player', 'images/four-player.png');
        this.load.image('two-player', 'images/two-player.png');
        this.load.image('start-game', 'images/start-game.png');
        this.load.image('load-game', 'images/load_game.png');
        this.load.nineSlice('input', 'images/inputfield.png', 15);
        this.load.image('restart', 'images/restart.png');
        this.load.spritesheet("die", "images/diceRed.png", 64, 64);
        this.load.script('helpher', 'js/Utility.js');
        this.load.script('piece', 'js/Piece.js');
        this.load.script('player', 'js/Player.js');
        this.load.script('fire', 'js/Fire.js');
        this.load.script('diceCintroller', 'js/DiceController.js');
        this.load.script("BlurX", "js/BlurX.js");
        this.load.script("BlurY", "js/BlurY.js");
        this.load.script("queue", "js/Queue.js");
        this.load.script("rules", "js/Rules.js");
        this.load.script("err", "js/Error.js");
        this.load.script("actions", "js/Action.js");
        this.load.script("underscore", "js/underscore.js");
        this.load.script("jquery", "js/jquery-1.12.2.min.js");
        this.load.script("gamedef", "js/Gamedef.js");
        this.load.script("socketio", "js/socket.io.js");
        this.load.script("Socket", "js/Socket.js");
        this.load.script("jquery-ui", "jquery-ui/jquery-ui.min.js");
        this.load.script("index", "js/index.js");
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        //this.load.json('save', 'js/save.json');
        
    },
    
    create: function() {
        
    	 
    	if (this.game.device.desktop) {
    		this.input.maxPointers = 1;
    		this.game.add.plugin(Fabrique.Plugins.InputField);
   		 	this.game.stage.disableVisibilityChange = true;
   		 	this.game.stage.smoothed = true; 
   		 	this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
   		 	this.scale.pageAlignHorizontally = true;
   		 	this.scale.pageAlignVertically = true;
   		 	this.stage.forcePortrait = true;
   		 	this.input.addPointer();
    		
    	 }else
    	 {
    		 
    		 this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		 this.game.add.plugin(Fabrique.Plugins.InputField);
    		 this.game.stage.smoothed = true;
    	     this.scale.pageAlignHorizontally = true;
    	     this.stage.forcePortrait = true;
    	     this.game.orientated = true;
    	     this.game.scale.minWidth = this.game.width /2.7;
    	     this.game.scale.minHeight = this.game.height /2.7;
    	     this.game.scale.pageAlignHorizontally = true;
    	     this.game.scale.pageAlignVertically = true;
     		 this.game.scale.maxWidth = this.game.width * 2.5;
  			 this.game.scale.maxHeight = this.game.height * 2.5;
  			 this.game.scale.forceOrientation(false, true);
    	     
    		 
    		 /*
    		this.game.add.plugin(Fabrique.Plugins.InputField);
    		this.input.maxPointers = 1;
    		this.stage.disableVisibilityChange = true;
    		this.game.orientated = true;
    		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.game.scale.minWidth = this.game.width /2.7;
    		this.game.scale.minHeight = this.game.height /2.7;
    		this.game.scale.pageAlignHorizontally = true;
    		this.game.scale.pageAlignVertically = true;
    		this.game.scale.maxWidth = this.game.width * 2.5;
 			this.game.scale.maxHeight = this.game.height * 2.5;
 			this.game.scale.forceOrientation(false, true);
 			this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
 			this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
 			this.game.scale.setScreenSize = true;
 			*/

    		 
    	 }
        
        this.state.start('Preloader');
    },
    
    
    enterIncorrectOrientation: function () {

		this.game.orientated = false;
		document.getElementById('orientation').style.display = 'block';

	},

	leaveIncorrectOrientation: function () {

		this.game.orientated = true;
		document.getElementById('orientation').style.display = 'none';
		this.game.scale.setScreenSize = true;

	}

    
};