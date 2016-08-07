var Ludo = {};

Ludo.Boot = function(game){};

Ludo.Boot.prototype = {
		
	init : function(){
		this.game.plugins.add(Fabrique.Plugins.NineSlice);	
		this.isMobile = false;
		this.x = 32;
		this.y = 80;
		this.game.stage.disableVisibilityChange = true;
		//this.game.sound.mute = true;
		
		var device = Phaser.Device;
		//console.log("Is Device " + device.windows);
		
		/*
		if(device.desktop){
			(function (win, doc, script, source, objectName) { (win.RadionomyPlayerObject = win.RadionomyPlayerObject || []).push(objectName); win[objectName] = win[objectName] || function (k, v) { (win[objectName].parameters = win[objectName].parameters || { src: source, version: '1.1' })[k] = v; }; var js, rjs = doc.getElementsByTagName(script)[0]; js = doc.createElement(script); js.async = 1; js.src = source; rjs.parentNode.insertBefore(js, rjs); }(window, document, 'script', 'https://www.radionomy.com/js/radionomy.player.js', 'radplayer'));
			radplayer('url', 'ludo');
			radplayer('type', 'mobile');
			radplayer('autoplay', '1');
			radplayer('volume', '50');
			radplayer('color1', '#f1ffc4');
			radplayer('color2', '#ff844f');
		}
		*/
	
	},
	
	create: function() {
        
   	 
		this.text = this.game.add.text((this.game.width /2) - 200, this.game.height / 2, 'Click to start load', { fill: '#ffffff' });
		
    	if (this.game.device.desktop) {
    		this.input.maxPointers = 1;
    		this.game.add.plugin(Fabrique.Plugins.InputField);
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
    	     this.game.orientated = true;
    	     this.game.scale.pageAlignHorizontally = true;
    	     this.game.scale.pageAlignVertically = true;
  			 this.game.scale.forceOrientation(false, true);
  			 this.isMobile = true;
    		 
    	 }
    	
    	this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);
        
        this.start();
        
    },
	
	
    start : function() 
    {
    	this.load.spritesheet("red_piece", "images/red.png", 42, 42, 2);
        this.load.spritesheet("blue_piece", "images/blue.png", 42, 42, 2);
        this.load.spritesheet("green_piece", "images/green.png", 42, 42, 2);
        this.load.spritesheet("yellow_piece", "images/yellow.png", 42, 42, 2);
        this.load.image('board', 'images/ludo.jpg');
        this.load.image('diceBtn', 'images/dice.png');
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
        this.load.image('updateBtn', 'images/update.png');
        this.load.image('cred', 'images/cred.png');
        this.load.image('cblue', 'images/cblue.png');
        this.load.image('cgreen', 'images/cgreen.png');
        this.load.image('cyellow', 'images/cyellow.png');
        this.load.image('success', 'images/successAlert.png');
        this.load.image('failure', 'images/failureAlert.png');
        this.load.image('skipturn', 'images/skipTurn.png');
        this.load.image('report', 'images/ireport.png');
        this.load.image('power', 'images/power.png');
        this.load.image('refresh', 'images/refresh.png');
        this.load.image('soundIcon', 'images/sound.ico');
        this.load.spritesheet("die", "images/diceRed.png", 64, 64);
        this.load.script('fire', 'js/Fire.js');
        this.load.script("jquery", "js/jquery-1.12.2.min.js");
        this.load.script("socketio", "js/socket.io.js");
        this.load.script("jquery-ui", "jquery-ui/jquery-ui.min.js");
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.load.audio("shakeAndroll", "audio/ShakeAndRollDice.mp3");
        this.load.audio("redneckRoll", "audio/RedneckRollsDice.mp3");
        this.load.audio("ding", "audio/ding.mp3");
        this.game.load.start();
        
        
    },
    
    
    loadStart : function(){
    	this.text.setText("Loading ...");
    },
    
    fileComplete : function(progress, cacheKey, success, totalLoaded, totalFiles) {

    	this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

    },
    
    loadComplete : function(){
    	this.text.setText("Load Complete");
    	this.state.start('GameSetup', true, false, this.isMobile);
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