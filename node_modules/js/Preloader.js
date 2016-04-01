Ludo.Preloader = function(game) {
    this.board = null;
    this.titlescreen = null;
    this.ready = false;
};

Ludo.Preloader.prototype = {
    
    preload: function() {
    },
    
    create: function() {
      
    },
    
    update: function() {
        this.ready = true;
        this.state.start('StartMenu');
    }
    
    
    
};