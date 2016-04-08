// Extended Phaser.Sprite (check out the examples Sprites -> extending sprite demo 1 & 2)
// Added a function to animate rolling.

Error = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'error');
    
    this.game = game;
    this.anchor.setTo(0.5, 0.5);
    this.alpha = 0.5;
    this.scale.x = 0.5;
    this.scale.y = 0.5;
    this.gameio;
    this.visible = false;
    game.game.add.existing(this);
};

Error.prototype = Object.create(Phaser.Sprite.prototype);
Error.prototype.constructor = Error;


Error.prototype.showError = function(game) 
{
	this.visible = true;
	game.time.events.add(2000, function() {
		game.add.tween(this).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true); 
		}, this);
	
	
};

Error.prototype.resetAlpha = function(game) {
	game.add.tween(this).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
	
};


