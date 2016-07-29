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
    this.alpha = 0;
    this.tween = null;
    this.tweenText;
    this.errorText;
    this.style = { font: "15px Revalia", fill: "#ff0000", wordWrap: true, wordWrapWidth: 200, align: "center" };
    game.add.existing(this);
};

Error.prototype = Object.create(Phaser.Sprite.prototype);
Error.prototype.constructor = Error;


Error.prototype.showError = function(errorType) 
{
	var xc = this.x - 55;
	var yc = this.y + 40;
	this.errorText = this.game.add.text(xc, yc, errorType, this.style);
	this.tween = this.game.add.tween(this).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
	this.tweenText = this.game.add.tween(this.errorText).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
	this.tween.start();
	this.tweenText.start();
	this.tween.onComplete.add(this.onComplete, this);
	this.tweenText.onComplete.add(this.onCompleteTweenText, this);
	
};

Error.prototype.onComplete = function() {
	this.game.add.tween(this).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
};

Error.prototype.onCompleteTweenText = function() {
	this.game.add.tween(this.errorText).to( { alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
};




