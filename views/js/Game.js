Ludo.Game = function(game){};


Ludo.Game.prototype = {
    
    
    create: function(){
    	this.save;
        this.iddleState = 0;
        this.activeState = 1;
        this.awaitingExitState = 2;
        this.exitState = 3;
        this.cursors;
        this.playerTurnText;
        this.display;
        this.dice;
        this.dieValueOne;
        this.dieValueTwo;
        this.play;
        this.shadow;
        this.shadowGroup;
        this.offset;
        this.tween;
        this.bmd = null;
        this.dieValueOne = 1;
        this.dieValueTwo = 1;
        this.playerMode;
        this.filter;
        this.alertDisplay;
        this.playerOne = ["red", "blue"];
        this.playerTwo = ["yellow", "green"];
        this.playerRed = ["red"];
        this.playerBlue = ["blue"];
        this.playerGreen = ["green"];
        this.playerYellow = ["yellow"];
        //this.save = this.cache.getJSON('save');
        this.saveFlag;
        this.gameId = this.getUuid();
        this.socket;
        this.diceObjects = [];
        
        
        
        this.sideFragmentSrc = [

            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform vec2      mouse;",

            "#define MAX_ITER 4",

            "void main( void )",
            "{",
                "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

                "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
                "vec2 i = p;",
                "float c = 1.0;",
                "float inten = .05;",

                "for (int n = 0; n < MAX_ITER; n++)",
                "{",
                    "float t = time * (1.0 - (3.0 / float(n+1)));",

                    "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                    "sin(t - i.y) + cos(t + i.x));",

                    "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                    "p.y / (cos(i.y+t)/inten)));",
                "}",

                "c /= float(MAX_ITER);",
                "c = 1.5 - sqrt(c);",

                "vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);",

                "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",

                "gl_FragColor = texColor;",
            "}"
        ];
     
        this.filter = new Phaser.Filter(this.game, null, this.sideFragmentSrc);
        this.filter.setResolution(220, 720);
        this.sprite = this.game.add.sprite();
        this.sprite.width = 220;
        this.sprite.height = 720;
        this.sprite.x = 720;
        this.sprite.filters = [ this.filter ];
       
        
        this.dice = this.make.button(760, 450, 'dice', this.rollDice, this, 2, 1, 0);
        this.dice.alpha = 0.5;
        this.play = this.make.button(760, 560, 'play', this.playDice, this, 2, 1, 0);
        this.play.alpha = 0.5;
        this.play.visible = false;
        this.savebutton = this.make.button(760, 320, 'savebutton', this.saveGame, this, 2, 1, 0);
        this.savebutton.alpha = 0.5;
        this.savebutton.scale.x = 0.4;
        this.savebutton.scale.y = 0.4;
        this.restartBtn = this.make.button(750, 670, 'restart', this.restart, this, 2, 1, 0);
        this.restartBtn.alpha = 0.5;
        this.restartBtn.scale.x = 0.7;
        this.restartBtn.scale.y = 0.7;
        
        this.play.onInputOver.add(this.over, this);
        this.play.onInputOut.add(this.out, this);
        this.play.onInputUp.add(this.up, this);
        this.play.onInputDown.add(this.down, this);
        this.play.onInputDown.add(this.down, this);

        this.dice.onInputOver.add(this.over, this);
        this.dice.onInputOut.add(this.out, this);
        this.dice.onInputUp.add(this.up, this);
        //this.restartBtn.onInputDown.add(this.restart, this);
            
        //Play Button and Text display group
        buttonGroup = this.add.group();
        buttonGroup.add(this.dice);
        buttonGroup.add(this.play);
        buttonGroup.add(this.savebutton);
        buttonGroup.add(this.restartBtn);
        
        this.rule = new Rules(this, this.play);
        this.alertDisplay = this.add.sprite(750, 150, 'alertDisplay');
        this.alertDisplay.alpha = 0.7;
        this.alertDisplay.visible = false;
        this.buildWorld();
        this.controller = new DiceController(this.game);
        this.ludo = this.buildPlayers(this.playerMode, this.controller, this.saveFlag);
        this.action = new Action(this, this.controller);
        this.populateWorld(this.ludo);
        this.currentPlayer = null;
        if (this.saveFlag){
            this.gameId = this.save.gameId;
            var diceUniqueIds = this.save.diceIds;
            this.controller.setDiceUniqueId(diceUniqueIds);
            for (var i = 0; i < this.ludo.length; ++i)
            {
                if (this.ludo[i].myTurn())
                {
                    this.currentPlayer = this.ludo[i];
                    if (this.controller.setDiceValue(this.currentPlayer)){
                        this.play.visible = true;
                        this.currentPlayer.rolled();
                        break;
                    }
                }  
            }
        }else{
            this.currentPlayer = this.ludo[0];
        }
        
        
        //Underscore**************************************************************************************
        var result = _.filter(this.ludo, function(something) {
            //console.log(something.playerName);
        });
        
        
        if (this.currentPlayer == null){
            this.currentPlayer = this.ludo[0];
        }
        
        
        if (this.currentPlayer.selectedPiece != null){
            this.select(this.currentPlayer.selectedPiece, this);
        }
        
        for (var i = 0; i < this.ludo.length; ++i){
            if (this.currentPlayer != this.ludo[i]){
                this.ludo[i].deSelectAll();
                this.ludo[i].exitAll();
            }
        }
        
        this.currentPlayer.exitAll();
        
        this.diceDisplayText = this.add.text(720, 0, "D-One: 0 D-Two: 0", diceDisplayStyle);
        this.playerTurnText = this.add.text(720, 300, this.currentPlayer.playerName+"'s Turn", playerTurnDisplayStyle);
        this.graphics = this.game.add.graphics(0, 0);
        
        if (this.saveFlag){
            
            for (var i = 0; i < this.ludo.length; ++i){
                this.ludo[i].drawSavedExitedPieces(this.graphics);
            }
        }
        
        
        if (!this.saveFlag)
        {
        	this.createNewGame();
        }
        this.error = new Error(this, 800, 150);
        
        
        
        this.gameio = new Socket(this);
        this.game.stage.disableVisibilityChange = true;
        
    },
    
    
    showError : function(){
    	this.error.resetAlpha(this.game);
    	this.error.showError(this.game);
    },
    
    rollDiceEmission : function(diceObject){
    	this.diceObjects.push(diceObject);
    	
    	if (this.diceObjects.length > 1){
    		this.controller.rollDice(this.currentPlayer, false, this.diceObjects);
    		this.diceObjects = [];
    	}
    },
    
    
    rollDice : function(diceObject){
    	this.controller.rollDice(this.currentPlayer, true, diceObject);
    },
    
    
    playDice : function(){
        this.currentPlayer.play(null);
    },
    
    playDiceEmission : function(playerPlayed){
        this.currentPlayer.play(playerPlayed);
    },
    
    restart: function(){
      
    	
    	/*
        if (confirm("Restart game?") == true) {
            groupIndex = 0;
            this.game.state.start('StartMenu'); 
        } 
        */
       
    },
    
    saveGame : function(){
        var gamedef = new Gamedef(this.controller, this.gameId);
        gamedef.savedef(this.ludo);
        var data = JSON.stringify(gamedef);
        this.socket.emit('saveNewGame', data);
        
        this.socket.on('saveNewGame', function(data){
            alert(data);
        });
    },
    
    
    createNewGame : function(){
        var gamedef = new Gamedef(this.controller, this.gameId);
        gamedef.savedef(this.ludo);
        var data = JSON.stringify(gamedef);
        this.socket.emit('createNewGame', data);
        
        this.socket.on('connected', function(data){
            console.log('User created new game: ' + data);
        });
    },
    
    
    buildWorld: function(world) {
        
        if (!world){
            
            arena = this.add.sprite(0, 0,'board');
            arena.inputEnabled = true;
            this.physics.arcade.enable(arena);
            arena.body.enable = false;
            boardGroup = this.add.group();
            boardGroup.add(arena);

            this.bmd = this.add.bitmapData(this.game.width, this.game.height);
            this.bmd.addToWorld();

            this.cursors = this.input.keyboard.createCursorKeys(); 

            this.shadow = this.add.sprite(0, 0, 'red_piece');
            this.shadow.tint = 0x000000;
            this.shadow.alpha = 0.5;
            this.shadow.scale.x = 0.1;
            this.shadow.scale.y = 0.1;
            this.shadow.anchor.y = 0.02;
            this.offset = new Phaser.Point(1, 1);
            this.shadowGroup = this.add.group();
            this.shadowGroup.add(this.shadow);
            
        }
        else{
            //world is built from saved game
        }
        
    },
    
    buildPlayers : function(mode, controller, retrieveflag){
        createPieceGroups(this.game);
        var players = [];
        
        if (retrieveflag == false)
        {
            switch(mode)
            {
                case 2:
                    var playerOne = new Player(this, "Player One", false, this.playerOne, 0, this.playerMode, controller); 
                    playerOne.buildPieces(this);
                    var playerTwo = new Player(this, "Player Two", false, this.playerTwo, 1, this.playerMode, controller);
                    playerTwo.buildPieces(this);
                    players.push(playerOne);
                    players.push(playerTwo);
                    break;
            
                case 4:
                    var playerRed = new Player(this, "Player Red", false, this.playerRed, 0, this.playerMode, controller); 
                    playerRed.buildPieces(this);
                    var playerBlue = new Player(this, "Player Blue", false, this.playerBlue, 1, this.playerMode, controller);
                    playerBlue.buildPieces(this);
                    
                    var playerYellow = new Player(this, "Player Yellow", false, this.playerYellow, 2, this.playerMode, controller); 
                    playerYellow.buildPieces(this);
                    var playerGreen = new Player(this, "Player Green", false, this.playerGreen, 3, this.playerMode, controller);
                    playerGreen.buildPieces(this);
                    
                    players.push(playerRed);
                    players.push(playerBlue);
                    players.push(playerYellow);
                    players.push(playerGreen);
                    break;
            }  
            
            
        }
        else
        {
            var obj = this.save.players;
            for (var i = 0; i < obj.length; ++i)
            {
                var player = new Player(this.game, obj[i].playerName, obj[i].turn, obj[i].piecesNames, obj[i].index, obj[i].playerMode, controller);
                player.setPieces(this, obj[i].pieces, obj[i].playerName);
                player.setDice(obj[i].diceObject);
                player.setSelectedPieceById(obj[i].selectedPieceId);
                player.exitingGraphicsPositions = obj[i].exitingGraphicsPositions;
                players.push(player);
            } 
            
        }
        
        return players;
    },
    
    populateWorld: function(players) {
        
        for (var i = 0; i < players.length; ++i)
        {
            var pieces = players[i].playerPieces;
            for (var j = 0; j < pieces.length; ++j)
            {
                piece = pieces[j];
                this.physics.enable(piece, Phaser.Physics.ARCADE);
                piece.body.fixedRotation = true;
                piece.inputEnabled = true;
                piece.events.onInputDown.add(this.select, this);
                piece.scale.x = 0.1;
                piece.scale.y = 0.1;
                piece.anchor.y = 0.02;
                piece.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
                piece.bmd.addToWorld();
                if (!pieces[j].isExited()){
                    piece.group.add(piece);
                }
            } 
        }
    },
    
    select: function(piece, pointer) {
        
        if (this.currentPlayer.selectedPiece == null){
            if (this.currentPlayer.setSelectedPiece(piece)){
                this.shadow.visible = true;
                this.shadow.x = piece.x;
                this.shadow.y = piece.y;
                this.game.world.bringToTop(piece.group);
                this.game.world.bringToTop(this.shadowGroup);
                
            }
            
        }
        else{
            
            if (this.currentPlayer.selectedPiece.parent == piece.parent){
                this.shadow.visible = true;
                this.shadow.x = piece.x;
                this.shadow.y = piece.y; 
                this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
                this.game.world.bringToTop(this.shadowGroup);
            }else{
                
                if (piece.key != "board"){
                    if (this.currentPlayer.setSelectedPiece(piece)){
                        this.shadow.visible = true;
                        this.shadow.x = piece.x;
                        this.shadow.y = piece.y;
                
                        this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
                        this.game.world.bringToTop(this.shadowGroup);
                    }  
                }  
            }
        } 
    },
    
    

    selectPieceEmissionById: function(pieceId) {
        var currentSelectedPiece = this.currentPlayer.getSelectedPieceById(pieceId);
        if (currentSelectedPiece != null){
        	this.select(currentSelectedPiece, null);
        }
    },
    
    setSelectedDieById : function(diceObject) {
    	this.currentPlayer.setSelectedDieById(diceObject.uniqueId);
    },
    
    setUnSelectedDieById : function(diceObject) {
    	this.currentPlayer.setUnSelectedDieById(diceObject.uniqueId);
    },
    
    over: function(p){
        if (p.key == "play"){
            this.play.scale.x = 1.1;
            this.play.scale.y = 1.1;
        }
        else if (p.key == "dice"){
            this.dice.scale.x = 1.1;
            this.dice.scale.y = 1.1;
        }
        
    },
    out: function(p){
        
        if (p.key == "play"){
            this.play.scale.x = 1;
            this.play.scale.y = 1;
        }
        else if (p.key == "dice"){
            this.dice.scale.x = 1;
            this.dice.scale.y = 1;
        }
    },
    
    up: function(p){
        if (p.key == "play"){
            this.play.alpha = 0.5;
        }
        else if (p.key == "dice"){
            this.dice.alpha = 0.5;
        }
    },
    
    down: function(p){
        
        if (p.key == "play"){
            this.play.alpha = 1;
        }
        else if (p.key == "dice"){
            this.dice.alpha = 1;
        }
    },
    
    getNextActivePiece : function(){
        this.currentPlayer.getNextSelectedPiece();
    },
    
    unselectUnplayedDie : function(){
        this.controller.unSelectUnplayedDie();
    },
    
    checkPlayCompleted : function(playerName, peck){
        if (peck != null){
            
        }
        
        if (this.currentPlayer.hasAllPiecesExited()){
            alert("Winner is " + this.currentPlayer.playerName);
            this.currentPlayer.resetAllPiecesExited();
        }
        
        this.unselectUnplayedDie();
        
        if (this.currentPlayer.belongsTo(playerName)){
            this.currentPlayer = this.rule.applyNextPlayerRule(this.currentPlayer);
        }
        
    },
    
    drawExitingGrahics : function(piece)
    {
        this.currentPlayer.drawExitedPiece(piece, this.graphics);
    },
    
   getUuid : function(){
       var s = [];
       var hexDigits = "0123456789abcdef";
       for (var i = 0; i < 36; i++) {
           s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    
       }
       s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
       s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
       s[8] = s[13] = s[18] = s[23] = "-";
       var uuid = s.join("");
       return uuid;
   },
    
    
    update: function() {
        
        this.filter.update();
        if (this.currentPlayer.selectedPiece != null && this.currentPlayer.selectedPiece.visible && !this.currentPlayer.selectedPiece.isExited()){
            this.shadow.visible = true;
            this.shadow.x = this.currentPlayer.selectedPiece.x;
            this.shadow.y = this.currentPlayer.selectedPiece.y; 
        }
        else{
            this.shadow.visible = false;
        }
        
        
        if (this.currentPlayer.diceCompleted()){
            this.currentPlayer = this.rule.applyDiceRules(this.currentPlayer);
            this.currentPlayer.diceCompletionReset();
        } 
        
        var valueOne = 0;
        d1 = this.controller.dice[0];
        d1.group.forEach(function(item) { 
            valueOne += item.value(); 
        });
        this.dieValueOne  = valueOne;
        
        var valueTwo = 0;
        d2 = this.controller.dice[1];
        d2.group.forEach(function(item) { 
            valueTwo += item.value(); 
        });
        this.dieValueTwo = valueTwo;
        
        this.diceDisplayText.setText("D-One: " + this.dieValueOne + " D-Two: " + this.dieValueTwo);
        this.playerTurnText.setText(this.currentPlayer.playerName+"'s Turn");
        
        if (this.currentPlayer.hasMovingPiece()){
            this.play.visible = false;
        }
        else{
            //this.play.visible = true;
        }
    }
        
}