// Extended Phaser.Sprite (check out the examples Sprites -> extending sprite demo 1 & 2)
// Added a function to animate rolling.

Dice = function (game, x, y, group) {
    Phaser.Sprite.call(this, game, x, y, 'die');
    
    this.tween;
    this.anim;
    this.blurX = game.add.filter("BlurX");  // Blur filters taken from
    this.blurY = game.add.filter("BlurY");  // Filters -> blur example
    this.game = game;
    this.dieValue = 0;
    this.isPlayed = true;
    this.group = group;
    this.player;
    this.anchor.setTo(0.5, 0.5);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.selectDie, this);
    this.uniqueId = null;

    var i;
    this.pix = [];
    for (i=0; i < 15; i++) {
        this.pix[i] = game.rnd.pick([0,1,2,4,5,6]);
    }
    
    this.anim = this.animations.add("roll", this.pix);
    this.anim.onComplete.add(this.rollComplete, this); 

    this.frame = 1;
    this.alpha = 0.5;
    this.activity = null;

    game.add.existing(this);
};

Dice.prototype = Object.create(Phaser.Sprite.prototype);
Dice.prototype.constructor = Dice;


Dice.prototype.roll = function() {
    this.alpha = 1;
    this.isPlayed = false;
    this.filters = [this.blurX, this.blurY];
    this.animations.play("roll", 20);
};

Dice.prototype.select = function() {
    this.alpha = 0.6;
};

Dice.prototype.unSelect = function() {
    this.alpha = 1;
};

Dice.prototype.selected = function() {
    return (this.alpha == 0.6);
};

Dice.prototype.unSelected = function() {
    return (this.alpha == 1);
};

Dice.prototype.setActivity = function(diceObject) {
    for (var i = 0; i < diceObject.length; ++i){
        if (diceObject[i].uniqueId == this.uniqueId){
            this.activity = diceObject[i];
            break;
        }
    }
};

Dice.prototype.rollComplete = function(game, value) {
    this.filters = null;
    this.frame = this.game.rnd.pick([0,1,2,4,5,6]);
    if (this.activity != null){
        this.setValue(this.activity);
    }
    this.player.diceCompletion();
    var diceObject = {uniqueId: this.uniqueId, value: this.value()};
    this.player.diceObject.push(diceObject);
};

Dice.prototype.update = function() {
    if (this.anim.isPlaying) {
        this.angle = this.game.rnd.angle();
    }
};

Dice.prototype.played = function(){
    this.isPlayed = true;
    this.alpha = 0.6;
};

Dice.prototype.isSpent = function(){
    return (this.isPlayed);
};

/*
Dice.prototype.setDieValue = function(newValue){
    this.activity = newValue;
};
*/

Dice.prototype.unSetDieValue = function(){
    this.activity = null;
};

Dice.prototype.setCurrentPlayer = function(currentPlayer){
    this.player = currentPlayer;
};

Dice.prototype.setSavedCurrentPlayer = function(currentPlayer){
    
    for (var i = 0; i < currentPlayer.diceObject.length; ++i){
        if (currentPlayer.diceObject[i].uniqueId == this.uniqueId){
            this.player = currentPlayer;
            this.setValue(currentPlayer.diceObject[i]);
            break;
        }
    }
};

Dice.prototype.selectDie = function() {
    
    if (this.player != null && !this.player.hasMovingPiece()){   
        if (this.selected() && !this.isPlayed){
            this.unSelect();    
        }else if (this.unSelected()){  
            this.select(); 
        }   
    }
};

Dice.prototype.value = function() {

    if (this.isPlayed){
        return 0;
    }
    
   
    switch(this.frame) {
        case 0:
            return 6;
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 5;
        case 5:
            return 3;
        case 6:
            return 4;
        default:
            return 0;
            break;
    }
};


Dice.prototype.setValue = function(diceObject) {
    
    if (diceObject.value == 0){
        return;
    }
    switch(diceObject.value) 
    {
        case 6:
            this.frame = 0;
            this.unSelect();
            this.isPlayed = false;
            break;
        case 1:
            this.frame = 1;
            this.unSelect();
            this.isPlayed = false;
            break;
        case 2:
            this.frame = 2;
            this.unSelect();
            this.isPlayed = false;
            break;
        case 5:
            this.frame = 4;
            this.unSelect();
            this.isPlayed = false;
            break;
        case 3:
            this.frame = 5;
            this.unSelect();
            this.isPlayed = false;
            break;
        case 4:
            this.frame = 6;
            this.unSelect();
            this.isPlayed = false;
            break;
    
    }
};

