/**
 * http://usejsdoc.org/
 */

Alert = function (game, x, y, imageId) {

    Phaser.Sprite.call(this, game.game, x, y, imageId);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.exitMessage, this);
    this.style = { font: "bold 18px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: this.width, align: "center" };
    this.game = game;
    this.group = this.game.add.group();
    this.group.add(this);
    this.text = this.game.add.text(Math.floor(this.x + this.width / 400), Math.floor(this.y + this.height / 400), "", this.style);
    this.text.anchor.set(0.5);
    this.visible = false;
    this.text.visible = false;
    
    
};

this.Alert.prototype = Object.create(Phaser.Sprite.prototype);
this.Alert.prototype.constructor = this.Alert;


Alert.prototype.displayMessage = function(message) {
    this.game.world.bringToTop(this.group);
    this.text.parent.bringToTop(this.text);
    this.text.setText(message);
    this.visible = true;
    this.text.visible = true;
};

Alert.prototype.exitMessage = function(message) {
    this.text.visible = false;
    this.visible = false;
};



Alert.prototype.update = function(){
    if (this.text !== null){
        this.text.x = Math.floor(this.x + this.width / 400);
        this.text.y = Math.floor(this.y + this.height / 400);
    }
    
};