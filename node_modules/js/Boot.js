var Ludo = {};

Ludo.Boot = function(game){};

Ludo.Boot.prototype = {
    preload: function() {
        this.load.image('board', 'images/ludo.jpg');
        this.load.image('red_piece', 'images/red_button.png');
        this.load.image('blue_piece', 'images/blue_button.png');
        this.load.image('green_piece', 'images/green_button.png');
        this.load.image('yellow_piece', 'images/yellow_button.png');
        this.load.image('dice', 'images/flick.jpg');
        this.load.image('play', 'images/playbutton.png');
        this.load.image('display', 'images/display.png');
        this.load.image('alertDisplay', 'images/alert.png');
        this.load.image('rolldisplay', 'images/rolldisplay.png');
        this.load.image('savebutton', 'images/savebutton.png');
        this.load.image('four-player', 'images/four-player.png');
        this.load.image('two-player', 'images/two-player.png');
        this.load.image('start-game', 'images/start-game.png');
        this.load.image('load-game', 'images/load_game.png');
        this.load.image('restart', 'images/restart.png');
        this.load.spritesheet("die", "images/diceRed.png", 64, 64);
        this.load.script('helpher', 'js/Utility.js');
        this.load.script('piece', 'js/Piece.js');
        this.load.script('player', 'js/Player.js');
        this.load.script('fire', 'js/Fire.js');
        this.load.script('diceCintroller', 'js/DiceController.js');
        this.load.script("BlurX", "js/BlurX.js");
        this.load.script("BlurY", "js/BlurY.js");
        this.load.script("BlurY", "js/queue.js");
        this.load.script("rules", "js/Rules.js");
        this.load.script("rules", "js/Action.js");
        this.load.script("underscore", "js/underscore.js");
        this.load.script("jquery", "js/jquery-1.12.2.min.js");
        this.load.script("gamedef", "js/Gamedef.js");
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.load.json('save', 'js/save.json');
        
    },
    
    create: function() {
        
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
        this.game.stage.smoothed = true; 
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.forcePortrait = true;
        this.input.addPointer();
        this.state.start('Preloader');
    },
    
}