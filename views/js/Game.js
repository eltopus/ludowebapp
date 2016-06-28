
var tempPlayer = null;
Ludo.Game = function (game) {
};


Ludo.Game.prototype = {

		init : function (gameData, saveFlag, socket, myTurn, owner, isMobile, sockId, screenName, rejoin)
		{

			this.savedGameId = gameData.gameId;
			this.gameData = gameData;
			this.saveFlag = saveFlag;
			this.socket = socket;
			this.newGameId = gameData.gameId;
			this.playerMode = gameData.playerMode;
			this.myTurn = myTurn;
			this.access = myTurn;
			this.owner = owner;
			this.isMobile = isMobile;
			this.sockId = sockId;
			this.playerName = screenName;
			this.rejoin = rejoin;
			
			this.gameMusic = null;
			if (this.isMobile === false){

				/*
				this.gameMusic = this.game.add.audio('gameMusic', 1, true);
				if (this.gameMusic.isPlaying == false){ 
					this.gameMusic.play('',0,1,true); 
				} 
				 */
			}else{
				/*
				var stayAwake = setInterval(function () {
				    location.href = location.href; //try refreshing
				    window.setTimeout(window.stop, 0); //stop it soon after
				}, 30000);
				 */

				var gameId = this.gameData.gameId;
				var sock = this.socket;
				window.addEventListener("focus", function(evt){
					sock.emit('browserInFocus', gameId, function(status){

						//alert(status);
					});
				}, false);
				window.addEventListener("blur", function(evt){
					sock.emit('browserInBackground', gameId, function(status){
						//alert(status);
					});
				}, false);
			}

		},


		create: function(){

			this.redneckRoll = null;
			this.shakeAndroll = null;
			this.ding = null;
			if (this.isMobile === false)
			{
				this.redneckRoll = this.game.add.audio('redneckRoll', 5, false);
				this.shakeAndroll = this.game.add.audio('shakeAndroll', 5, false);
				this.ding = this.game.add.audio('ding', 5, false);
			}else{
				this.redneckRoll = this.game.add.audio('redneckRoll', 1, false);
				this.shakeAndroll = this.game.add.audio('shakeAndroll', 1, false);
				this.ding = this.game.add.audio('ding', 1, false);
			}

			this.iddleState = 0;
			this.activeState = 1;
			this.awaitingExitState = 2;
			this.exitState = 3;
			this.cursors = null;
			this.playerTurnText = null;
			this.display = null;
			this.diceBtn = null;
			this.dieValueOne = null;
			this.dieValueTwo = null;
			this.play = null;
			this.offset = null;
			this.tween = null;
			this.bmd = null;
			this.dieValueOne = 1;
			this.dieValueTwo = 1;
			this.filter = null;
			this.playerOne = ["red", "blue"];
			this.playerTwo = ["yellow", "green"];
			this.playerRed = ["red"];
			this.playerBlue = ["blue"];
			this.playerGreen = ["green"];
			this.playerYellow = ["yellow"];
			this.gameId = this.getUuid();
			this.diceObjects = [];
			this.errorX = 810;
			this.errorY = 600;



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

			if (this.isMobile === false){
				this.filter = new Phaser.Filter(this.game, null, this.sideFragmentSrc);
				this.filter.setResolution(220, 720);
				this.sprite = this.game.add.sprite();
				this.sprite.width = 220;
				this.sprite.height = 720;
				this.sprite.x = 720;
				this.sprite.filters = [ this.filter ];
			}


			this.diceBtn = this.make.button(760, 450, 'diceBtn', this.rollDice, this, 2, 1, 0);
			this.diceBtn.alpha = 0.5;
			this.diceBtn.scale.x = 0.2;
			this.diceBtn.scale.y = 0.2;
			this.play = this.make.button(760, 560, 'play', this.playDice, this, 2, 1, 0);
			this.play.alpha = 0.5;
			this.play.visible = false;


			this.updateBtn = this.make.button(795, 320, 'updateBtn', this.saveGame, this, 2, 1, 0);
			this.updateBtn.alpha = 0.5;
			this.updateBtn.scale.x = 0.6;
			this.updateBtn.scale.y = 0.6;

			this.savebutton = this.make.button(720, 320, 'savebutton', this.generateGameJson, this, 2, 1, 0);
			this.savebutton.alpha = 0.5;
			this.savebutton.scale.x = 0.3;
			this.savebutton.scale.y = 0.3;

			this.restartBtn = this.make.button(750, 670, 'restart', this.restart, this, 2, 1, 0);
			this.restartBtn.alpha = 0.5;
			this.restartBtn.scale.x = 0.7;
			this.restartBtn.scale.y = 0.7;

			this.play.onInputOver.add(this.over, this);
			this.play.onInputOut.add(this.out, this);
			this.play.onInputUp.add(this.up, this);
			this.play.onInputDown.add(this.down, this);

			this.diceBtn.onInputOver.add(this.over, this);
			this.diceBtn.onInputOut.add(this.out, this);
			this.diceBtn.onInputUp.add(this.up, this);
			this.diceBtn.onInputDown.add(this.down, this);
		




			//Play Button and Text display group
			buttonGroup = this.add.group();
			buttonGroup.add(this.savebutton);
			buttonGroup.add(this.restartBtn);
			buttonGroup.add(this.updateBtn);
			buttonGroup.add(this.play);
			buttonGroup.add(this.diceBtn);

			this.rule = new Rules(this, this.play, this.myTurn);
			this.buildWorld();
			this.controller = new DiceController(this, this.savedGameId, this.myTurn, this.gameData.diceIds);
			this.ludo = this.buildPlayers(this.playerMode, this.controller, this.saveFlag);
			this.action = new Action(this, this.controller);
			this.populateWorld(this.ludo);
			this.gameIdText = null;
			this.currentPlayer = null;

			if (this.saveFlag)
			{
				this.newGameId = this.savedGameId;
				this.gameIdText = this.add.text(725, 410, "Game ID: " + this.savedGameId, gameIdDisplayStyle);
				this.gameId = this.gameData.gameId;
				for (var i = 0; i < this.ludo.length; ++i)
				{
					if (this.ludo[i].myTurn())
					{
						this.currentPlayer = this.ludo[i];
						if (this.controller.setDiceValue(this.currentPlayer)){
							this.play.visible = true;
							this.diceBtn.visible = false;
							this.currentPlayer.rolled();
							this.currentPlayer.playerTurn();
							break;
						}
					}  
				}
			}else
			{
				this.currentPlayer = this.ludo[0];
				this.gameIdText = this.add.text(725, 410, "Game ID: ", gameIdDisplayStyle);
			}


			if (this.currentPlayer === null){
				this.currentPlayer = this.ludo[0];
			}


			if (this.currentPlayer.selectedPiece !== null){
				this.select(this.currentPlayer.selectedPiece, this);
			}

			for (var j = 0; j < this.ludo.length; ++j){
				if (this.currentPlayer !== this.ludo[j]){
					this.ludo[j].deSelectAll();
					this.ludo[j].exitAll();
				}
			}

			this.currentPlayer.exitAll();

			this.diceDisplayText = this.add.text(720, 0, "D-One: 0 D-Two: 0", diceDisplayStyle);
			this.playerTurnText = this.add.text(720, 286, this.currentPlayer.playerName+"'s Turn", playerTurnDisplayStyle);
			this.graphics = this.game.add.graphics(0, 0);

			if (this.saveFlag){

				for (var k = 0; k < this.ludo.length; ++k){
					this.ludo[k].drawSavedExitedPieces(this.graphics);
				}
			}


			this.gameio = new Socket(this);
			this.game.input.onTap.add(this.onTap, this);

			if (!this.saveFlag)
			{
				//this.createNewGame();
			}


			this.soundIcon = this.game.add.sprite(850, 30, "soundIcon");
			this.soundIcon.anchor.set(0.5);
			this.soundIcon.alpha = 0.7;
			this.soundIcon.scale.x = 0.2;
			this.soundIcon.scale.y = 0.2;
			this.soundIcon.inputEnabled = true;
			this.soundIcon.input.enableDrag();
			this.soundIcon.events.onInputDown.add(this.muteMusic, this);

			tempPlayer = this.currentPlayer;

			if (this.myTurn){
				this.playDing();
				this.currentPlayer.playerTurn();
			}



			//Update Game when player disconnects
			var currentPlayer = this.currentPlayer;
			var controller = this.controller;
			var ludo = this.ludo;
			var playerMode = this.playerMode;
			var gameId = this.newGameId;
			this.socket.on('disconnected', function(message){
				if (currentPlayer!== null){
					var gamedef = new Gamedef(controller, gameId);
					gamedef.savedef(ludo);
					gamedef.gameMode = playerMode;
					currentPlayer.updateGameOnDisconnection(gamedef);
					//console.log("Sending updates..." + JSON.stringify(gamedef));
				}
			});

			if (this.rejoin){
				//console.log("Updation player turn for: " + this.playerName);
				//this.updatePlayerTurnOnRejoin();
			}

			this.redPlayerConnection = this.getConnectionText(70, 30, "red");
			this.bluePlayerConnection = this.getConnectionText(650, 30, "blue");
			this.yellowPlayerConnection = this.getConnectionText(650, 700, "yellow");
			this.greenPlayerConnection = this.getConnectionText(70, 700, "green");
		},


		generateGameJson : function(){

			if (this.isMobile === false){

				var data = JSON.stringify(this.getUpdatedGame());
				var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
				window.open(url, '_blank');
				window.focus();
			}

		},

		getConnectionText : function(x, y, color){

			var text = this.getConnectionTextPlayerName(color);

			var isConnected = this.game.add.text(x, y, text);
			isConnected.anchor.setTo(0.5);
			isConnected.font = 'Revalia';
			isConnected.fontSize = 20;
			var grd = isConnected.context.createLinearGradient(0, 0, 0, isConnected.canvas.height);
			grd.addColorStop(0, '#8ED6FF');   
			grd.addColorStop(1, '#004CB3');
			isConnected.fill = grd;

			isConnected.align = 'center';
			isConnected.stroke = '#000000';
			isConnected.strokeThickness = 2;
			isConnected.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

			isConnected.inputEnabled = true;
			isConnected.input.enableDrag();

			return isConnected;
		},

		getConnectionTextPlayerName : function(color){

			var playerName = "CONNECTED";
			for (var i = 0; i < this.gameData.players.length; ++i)
			{
				var player = this.gameData.players[i];
				if (this.playerHasColor(player, color))
				{
					playerName = player.playerName;
					break;
				}

			}
			return playerName;
		},

		playerHasColor : function(player, color){

			var containsColor = false;
			var playerColors = player.piecesNames;

			for (var i = 0; i < playerColors.length; ++i){
				if (playerColors[i] == color){
					containsColor = true;
				}
			}

			return containsColor;
		},

		connectionNotificationAlert : function(playerName, status){

			for (var i = 0; i < this.gameData.players.length; ++i)
			{
				var player = this.gameData.players[i];
				if (player.playerName === playerName){
					var pieces = player.pieces;
					for (var j = 0; j < pieces.length; ++j){
						var pieceName = pieces[j].piece;
						this.displayConnectionAlert(pieceName, status);
					}

					break;
				}

			}

		},

		displayConnectionAlert : function (piece, status){
			switch(piece){
			case 'red':
			{
				if (status){
					this.redPlayerConnection.visible = true;
				}else{
					this.redPlayerConnection.visible = false;
				}
				break;
			}
			case 'blue':
			{
				if (status){
					this.bluePlayerConnection.visible = true;
				}else{
					this.bluePlayerConnection.visible = false;
				}
				break;
			}
			case 'yellow':
			{
				if (status){
					this.yellowPlayerConnection.visible = true;
				}else{
					this.yellowPlayerConnection.visible = false;
				}
				break;
			}
			case 'green':
			{
				if (status){
					this.greenPlayerConnection.visible = true;
				}else{
					this.greenPlayerConnection.visible = false;
				}
				break;

			}
			default:
				break;
			}

		},


		updatePlayerTurnOnRejoin : function(){

			for (var player in this.gameData.players){
				if (player.playerName === this.playerName && player.turn === true){
					this.myTurn = true;
					//console.log("Updating player turn for: " + this.playerName);
				}

			}
		},

		onTap : function(pointer, doubleTap) {

			if (doubleTap)
			{
				if (this.scale.isFullScreen)
				{
					this.scale.stopFullScreen();
				}
				else
				{
					this.scale.startFullScreen(false);
				}

			}

		},


		rollDiceEmission : function(diceObject){
			this.playShakeAndRoll();
			this.diceObjects.push(diceObject);
			this.diceBtn.visible = false;
			if (this.diceObjects.length > 1){
				this.controller.rollDice(this.currentPlayer, false, this.diceObjects);
				this.diceObjects = [];
			}
			//console.log(this.sockId);
		},

		playRedneckRoll : function(){
			this.redneckRoll.play();
		},

		playShakeAndRoll : function(){
			this.shakeAndroll.play();
		},

		rollDice : function(diceObject){
			if (this.myTurn){
				this.playShakeAndRoll();
				this.controller.rollDice(this.currentPlayer, true, diceObject);
				this.diceBtn.visible = false;
			}
		},


		playDice : function(){
			if (this.myTurn){
				this.currentPlayer.play(null);
			}


		},

		playDiceEmission : function(playerPlayed){
			this.currentPlayer.play(playerPlayed);
		},

		restartEmission : function(){
			if (this.currentPlayer !== null){
				this.currentPlayer.releasePlay();
			}
		},

		restart: function(){

			if (confirm("Forefiet turn?") === true) {
				if (this.myTurn && this.currentPlayer !== null)
				{
					this.currentPlayer.releasePlay();
					this.socket.emit('releaseGame', {gameId : this.savedGameId});

				}
			} 
		},

		saveGame : function(data){


			if (!this.currentPlayer.hasMovingPiece())
			{

				var ludo = this.ludo;
				var currentPlayer = this.currentPlayer;
				var play = this.play;
				var diceBtn = this.diceBtn;
				var select = this.select;
				var controller = this.controller;
				var cgame = this;
				var playerName = this.playerName;
				var myTurn = this.myTurn;
				var playDing = this.playDing;
				var playDong = this.playDong;

				if (!data.players)
				{
					if (this.currentPlayer.hasRolled === false){
						this.socket.emit('updateGame', this.gameId, function(gameData){
							if (gameData !== null)
							{
								//console.log("UpdatedGame: "+ JSON.stringify(gameData));
								for (var i = 0; i < ludo.length; ++i)
								{
									ludo[i].updatePlayer(gameData.players);
									if (ludo[i].myTurn())
									{
										currentPlayer = ludo[i];
										currentPlayer.selectAll();
										if (controller.setDiceValue(currentPlayer)){
											play.visible = true;
											diceBtn.visible = false;
											currentPlayer.rolled();
											if (currentPlayer.playerName === playerName && myTurn === false){
												myTurn = true;
												playDing();

											}else{
												myTurn = false;
												playDong();
											}
										}    
									}    
									else
									{
										ludo[i].deSelectAll();
									}  
								}

								if (currentPlayer.selectedPiece !== null){
									select(currentPlayer.selectedPiece, cgame);
								}

								alertMessage("Game Updated Successfully!", "Success", false);
							}else{
								alertMessage("Game Update failed!", "Error!", false);
							}

						});

					}


				}else{
					for (var i = 0; i < ludo.length; ++i)
					{
						ludo[i].updatePlayer(data.players);
						if (ludo[i].myTurn())
						{
							currentPlayer = ludo[i];
							currentPlayer.selectAll();
							if (controller.setDiceValue(currentPlayer)){
								play.visible = true;
								diceBtn.visible = false;
								currentPlayer.rolled(); 
								if (currentPlayer.playerName == playerName && myTurn === false){
									myTurn = true;
									playDing();
								}
								else{
									myTurn = false;
									playDong();
								}
							}    
						}    
						else
						{
							ludo[i].deSelectAll();
						}  
					}

					if (currentPlayer.selectedPiece !== null){
						select(currentPlayer.selectedPiece, cgame);
					}

				}

			}

		},


		createNewGame : function(){

			/*
        var gamedef = new Gamedef(this.controller, this.gameId);
        gamedef.savedef(this.ludo);
        var gameIdText = this.gameIdText;
        var gameData = JSON.stringify(gamedef);
        this.newGameId = this.randomString(5);
        var preparedData = {gameData : gameData, gameId : this.newGameId};
        this.socket.emit('createNewGame', preparedData, function (data){	
        	gameIdText.setText("Game ID: " + data.gameId.toString());
        });
			 */

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

			}
			else{
				//world is built from saved game
			}

		},

		buildPlayers : function(mode, controller, retrieveflag){
			createPieceGroups(this.game);
			var players = [];

			if (retrieveflag === false)
			{
				switch(mode)
				{
				case 2:
					var playerOne = new Player(this, "Player One", false, this.playerOne, 0, this.playerMode, controller); 
					playerOne.error = new Error(this, this.errorX, this.errorY);
					playerOne.buildPieces(this);
					var playerTwo = new Player(this, "Player Two", false, this.playerTwo, 1, this.playerMode, controller);
					playerTwo.error = new Error(this, this.errorX, this.errorY);
					playerTwo.buildPieces(this);
					players.push(playerOne);
					players.push(playerTwo);
					break;

				case 4:
					var playerRed = new Player(this, "Player Red", false, this.playerRed, 0, this.playerMode, controller);
					playerRed.error = new Error(this, this.errorX, this.errorY);
					playerRed.buildPieces(this);
					var playerBlue = new Player(this, "Player Blue", false, this.playerBlue, 1, this.playerMode, controller);
					playerBlue.error = new Error(this, this.errorX, this.errorY);
					playerBlue.buildPieces(this);

					var playerYellow = new Player(this, "Player Yellow", false, this.playerYellow, 2, this.playerMode, controller); 
					playerYellow.error = new Error(this, this.errorX, this.errorY);
					playerYellow.buildPieces(this);
					var playerGreen = new Player(this, "Player Green", false, this.playerGreen, 3, this.playerMode, controller);
					playerGreen.error = new Error(this, this.errorX, this.errorY);
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
				var obj = this.gameData.players; 
				for (var i = 0; i < obj.length; ++i)
				{
					var player = new Player(this, obj[i].playerName, obj[i].turn, obj[i].piecesNames, obj[i].index, obj[i].playerMode, controller, this.gameData.gameId);
					player.setPieces(this, obj[i].pieces, obj[i].playerName);
					player.setDice(obj[i].diceObject);
					player.setSelectedPieceById(obj[i].selectedPieceId);
					player.exitingGraphicsPositions = obj[i].exitingGraphicsPositions;
					player.error = new Error(this, this.errorX, this.errorY);
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
					piece.scale.x = 1.1;
	                piece.scale.y = 1.1;
	                piece.anchor.y = -0.07;
	                piece.anchor.x = -0.07;
					piece.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
					piece.bmd.addToWorld();
					if (!pieces[j].isExited()){
						piece.group.add(piece);
					}
				} 
			}
		},

		select: function(piece, pointer) {

			if (this.myTurn){
				if (this.currentPlayer.selectedPiece === null){
					if (this.currentPlayer.setSelectedPiece(piece)){
						
						this.game.world.bringToTop(piece.group);
						

					}

				}
				else{

					if (this.currentPlayer.selectedPiece.parent == piece.parent){
						this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
						
					}else{

						if (piece.key != "board"){
							if (this.currentPlayer.setSelectedPiece(piece)){
								

								this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
								
							}  
						}  
					}
				} 
			}

		},


		selectEmiision: function(piece, pointer) {


			if (this.currentPlayer.selectedPiece === null){
				if (this.currentPlayer.setSelectedPiece(piece)){
					
					this.game.world.bringToTop(piece.group);
					

				}

			}
			else{

				if (this.currentPlayer.selectedPiece.parent == piece.parent){
					this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
					
				}else{

					if (piece.key != "board"){
						if (this.currentPlayer.setSelectedPiece(piece)){
							
							this.game.world.bringToTop(this.currentPlayer.selectedPiece.group);
							
						}  
					}  
				}
			} 


		},



		selectPieceEmissionById: function(pieceId) {
			var currentSelectedPiece = this.currentPlayer.getSelectedPieceById(pieceId);
			if (currentSelectedPiece !== null){
				this.selectEmiision(currentSelectedPiece, null);
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
			else if (p.key == "diceBtn"){
				this.diceBtn.scale.x = 0.23;
	        	this.diceBtn.scale.y = 0.23;
			}

		},
		out: function(p){

			if (p.key == "play"){
				this.play.scale.x = 1;
				this.play.scale.y = 1;
			}
			else if (p.key == "diceBtn"){
				this.diceBtn.scale.x = 0.2;
	            this.diceBtn.scale.y = 0.2;
			}
		},

		up: function(p){
			if (p.key == "play"){
				this.play.alpha = 0.5;
			}
			else if (p.key == "diceBtn"){
				this.diceBtn.alpha = 0.5;
			}
		},

		down: function(p){

			if (p.key == "play"){
				this.play.alpha = 1;
			}
			else if (p.key == "diceBtn"){
				this.diceBtn.alpha = 1;
			}
		},
	    
		getNextActivePiece : function(){
			this.currentPlayer.getNextSelectedPiece();
		},

		unselectUnplayedDie : function(){
			this.controller.unSelectUnplayedDie();
		},

		checkPlayCompleted : function(playerName, peck){
			if (peck !== null){

			}

			if (this.currentPlayer.hasAllPiecesExited()){
				alertMessage("Winner is " + this.currentPlayer.playerName, "Winner!", true);
				this.socket.emit('endOfGame', {gameId : this.savedGameId});
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

		randomString : function (length) {
			return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
		},

		updateGame : function(data){

			if (!this.currentPlayer.hasMovingPiece()){

				var gameData = data.gameData;
				var screenName = data.screenName;
				if (gameData !== null)
				{
					for (var i = 0; i < this.ludo.length; ++i)
					{
						this.ludo[i].updatePlayer(gameData.players);
						if (this.ludo[i].myTurn())
						{

							this.currentPlayer = this.ludo[i];
							this.currentPlayer.selectAll();
							if (this.controller.setDiceValue(this.currentPlayer)){
								this.play.visible = true;
								this.diceBtn.visible = false;
								this.currentPlayer.rolled();  
							} 
							if (this.playerName === this.ludo[i].playerName){
								this.myTurn = true;
								this.playDing();
							}
						}    
						else
						{
							this.ludo[i].deSelectAll();
						}  

					}

					if (this.currentPlayer.selectedPiece !== null){
						this.select(this.currentPlayer.selectedPiece, this);
					}

					alertMessage("Game was Updated Successfully by " + screenName, "Success", false);
				}

			}

		},

		muteMusic : function(){
			if (this.game.sound.mute === true){
				this.game.sound.mute = false;
				this.soundIcon.scale.x = 0.2;
				this.soundIcon.scale.y = 0.2;
			}else{
				this.game.sound.mute = true;
				this.soundIcon.scale.x = 0.1;
				this.soundIcon.scale.y = 0.1;
			}
		},

		unlock : function(callback){
			if (!this.currentPlayer.hasMovingPiece()){
				callback(true, this.access);
			}
		},

		playDing : function(){
			this.ding.play();
			this.playerTurnText.fill = '#00ffff';
			this.gameIdText.fill = '#00ffff';
			this.diceDisplayText.fill = '#00ffff';
		},

		playDong : function(){
			this.playerTurnText.fill = '#F70C0C';
			this.gameIdText.fill = '#F70C0C';
			this.diceDisplayText.fill = '#F70C0C';
		},

		getUpdatedGame : function(){

			var gamedef = new Gamedef(this.controller, this.gameData.gameId);
			gamedef.savedef(this.ludo);
			gamedef.gameMode = this.gameData.gameMode;
			return gamedef;

		},




		update: function() {

			if (this.isMobile === false){
				this.filter.update();
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

			if (tempPlayer != this.currentPlayer && !tempPlayer.hasMovingPiece())
			{
				if (this.playerName === 'ADMIN'){

				}else{
					tempPlayer.emitNextPlayer(this.getUpdatedGame());
					this.myTurn = false;
				}

				//console.log("UpdatedGame: " + JSON.stringify(this.getUpdatedGame()));
				tempPlayer = this.currentPlayer;
			}
		}

};