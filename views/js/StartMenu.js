
Ludo.StartMenu = function(game){
};

Ludo.StartMenu.prototype = {

		init : function(isMobile){
			this.gameMode = 2;
			this.loadGame = false;
			this.socket = null;
			this.isMobile = isMobile;
			this.menuMusic = null;
		},

		create: function() {
			this.filter = null;
			this.sprite = null;
			this.soundIcon = this.game.add.sprite(850, 30, "soundIcon");
			this.soundIcon.anchor.set(0.5);
			this.soundIcon.scale.x = 0.2;
			this.soundIcon.scale.y = 0.2;
			this.soundIcon.inputEnabled = true;
			this.soundIcon.input.enableDrag();
			this.soundIcon.events.onInputDown.add(this.muteMusic, this);


			if (this.isMobile === false){
				this.sprite = this.game.add.sprite();
				this.sprite.width = 900;
				this.sprite.height = 720;
				this.filter = this.game.add.filter('Fire', 900, 720);
				this.filter.alpha = 0.0;
				this.sprite.filters = [ this.filter ];
				//Change style attribute for Desktop Application
				var $elem = $('#orient');
				$elem.attr('style', $elem.attr('style') + '; ' + 'padding-top: 100px; !important');
			}else{

				this.game.stage.backgroundColor = "#171642";

			}



			this.two_player = this.make.button((this.game.width / 2) - 360, (this.game.height /2) - 5, 'two-player', this.twoPlayer, this, 2, 1, 0);
			this.four_player = this.make.button((this.game.width / 2) + 180, (this.game.height /2) - 5, 'four-player', this.fourPlayer, this, 2, 1, 0);
			this.start_game = this.make.button((this.game.width / 2) - 90, this.game.height / 4, 'start-game', this.startGame, this, 2, 1, 0);
			this.load_game = this.make.button((this.game.width / 2) - 85, this.game.height /2, 'load-game', this.retrieveGame, this, 2, 1, 0);

			this.cred = this.make.button((this.game.width / 2) - 350, (this.game.height /2) + 270, 'cred', this.colorChooser, this, 2, 1, 0);
			this.cblue = this.make.button((this.game.width / 2) - 130, (this.game.height /2) + 270, 'cblue', this.colorChooser, this, 2, 1, 0);
			this.cyellow = this.make.button((this.game.width / 2) + 100, (this.game.height /2) + 270, 'cyellow', this.colorChooser, this, 2, 1, 0);
			this.cgreen = this.make.button((this.game.width / 2) + 340, (this.game.height /2) + 270, 'cgreen', this.colorChooser, this, 2, 1, 0);

			this.cred.anchor.x = 0.5;
			this.cred.anchor.y = 0.5;
			this.cblue.anchor.x = 0.5;
			this.cblue.anchor.y = 0.5;
			this.cgreen.anchor.x = 0.5;
			this.cgreen.anchor.y = 0.5;
			this.cyellow.anchor.x = 0.5;
			this.cyellow.anchor.y = 0.5;

			this.cred.onInputDown.add(this.selectColor, this);
			this.cblue.onInputDown.add(this.selectColor, this);
			this.cyellow.onInputDown.add(this.selectColor, this);
			this.cgreen.onInputDown.add(this.selectColor, this);


			this.two_player.onInputDown.add(this.down, this);
			this.four_player.onInputDown.add(this.down, this);
			this.load_game.onInputDown.add(this.down, this);


			this.buttonGroup = this.add.group();
			this.buttonGroup.add(this.two_player);
			this.buttonGroup.add(this.four_player);
			this.buttonGroup.add(this.start_game);
			this.buttonGroup.add(this.load_game);
			this.buttonGroup.add(this.cred);
			this.buttonGroup.add(this.cblue);
			this.buttonGroup.add(this.cyellow);
			this.buttonGroup.add(this.cgreen);

			this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
			this.game.stateTransition.configure({ duration: 1000, ease: Phaser.Easing.Linear.None, properties: { alpha: 0, scale: { x: 1.4, y: 1.4 } }});

			this.gameCodeBg = this.game.add.nineSlice(this.game.width / 2, 450, 'input', 170, 40);
			this.gameCodeBg.anchor.set(0.5);
			this.gameCode = this.game.add.inputField((this.game.width / 2) - 80, 450 - 17, {
				font: '18px Arial',
				fill: '#212121',
				fillAlpha: 0,
				fontWeight: 'bold',
				width: 150,
				height: 150,
				max: 10,
				padding: 4,
				borderWidth: 1,
				borderColor: '#000',
				borderRadius: 6,
				placeHolder: '     Game Code',
				textAlign: 'center'
			});

			this.gameCodeBg.alpha = 0.0;
			this.gameCode.alpha = 0.0;

			this.screenNameBg = this.game.add.nineSlice((this.game.width / 2) , (this.game.height /2) + 150, 'input', 170, 40);
			this.screenNameBg.anchor.set(0.5);
			this.screenName = this.game.add.inputField((this.game.width / 2) - 80 , (this.game.height /2) + 130, {
				font: '18px Arial',
				fill: '#212121',
				fillAlpha: 0,
				fontWeight: 'bold',
				width: 150,
				height: 150,
				max: 10,
				padding: 4,
				borderWidth: 1,
				borderColor: '#000',
				borderRadius: 6,
				placeHolder: '    Screen Name',
				textAlign: 'center'
			});

			this.screenNameBg.alpha = 0.0;
			this.screenName.alpha = 0.0;

			this.twoPlayerScreenNameBg = this.game.add.nineSlice((this.game.width / 2) - 275, 450, 'input', 170, 40);
			this.twoPlayerScreenNameBg.anchor.set(0.5);
			this.twoPlayerScreenName = this.game.add.inputField((this.game.width / 2) - 360  ,450 - 17, {
				font: '18px Arial',
				fill: '#212121',
				fillAlpha: 0,
				fontWeight: 'bold',
				width: 150,
				height: 150,
				max: 10,
				padding: 4,
				borderWidth: 1,
				borderColor: '#FF0000',
				borderRadius: 6,
				backgroundColor : '#FF0000',
				placeHolder: '    Screen Name',
				textAlign: 'center'
			});

			this.twoPlayerScreenNameBg.alpha  = 0.0;
			this.twoPlayerScreenName.alpha = 0.0;

			this.fourPlayerScreenNameBg = this.game.add.nineSlice((this.game.width / 2) + 265, 450, 'input', 170, 40);
			this.fourPlayerScreenNameBg.anchor.set(0.5);
			this.fourPlayerScreenName = this.game.add.inputField((this.game.width / 2) + 180  ,450 - 17, {
				font: '18px Arial',
				fill: '#212121',
				fillAlpha: 0,
				fontWeight: 'bold',
				width: 150,
				height: 150,
				max: 10,
				padding: 4,
				borderWidth: 1,
				borderColor: '#000',
				borderRadius: 6,
				placeHolder: '     Screen Name',
				textAlign: 'center'
			});

			this.fourPlayerScreenNameBg.alpha = 0.0;
			this.fourPlayerScreenName.alpha = 0.0;
			this.colors = [];
			this.gameObj = new GameObj();

			/*
			$('.btn').click(function(e) {
			    $('.btn').not(this).removeClass('active');    
			    $(this).toggleClass('active');
			    e.preventDefault();
			    //alert("ME IS YOU");
			});
			 */
			var gameObj = this.gameObj;

			$('.dropdown-menu > li').click(function() {
				var $toggle = $(this).parent().siblings('.dropdown-toggle');
				$toggle.html($(this).text() + "<span class=\"caret\"></span>");

				if ($(this).text() === "2-PLAYER"){
					//console.log( "2-PlayerMode " + $(this).text());
					gameObj.playerMode = 2;
				}
				else if ($(this).text() === "4-PLAYER"){
					//console.log( "4-PlayerMode " + $(this).text());
					gameObj.playerMode = 4;
				}

			});

			$('#redBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					gameObj.addPlayerColors("red");
				}

			});

			$('#blueBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					gameObj.addPlayerColors("blue");
				}
			});

			$('#yellowBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					gameObj.addPlayerColors("yellow");
				}
			});

			$('#greenBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					gameObj.addPlayerColors("green");
				}
			});

			var socket = this.socket;
			var state = this.game.state;
			var isMobile = this.isMobile;
			var menuMusic = this.menuMusic;

			$('#createBtn').parent().on("click", function () {
				gameObj.playerName = $('#playerName').val();
				var message = gameObj.verifyCreateGame();
				//console.log("Message " + message);

				if (message === "ok")
				{


					//$('#main.hidden').css('visibility','visible').hide().fadeIn().removeClass('hidden');
					if (socket === null)
					{
						socket = io();
						socket.on('disconnected', function(message){
							alertMessage(message + ' has disconnected.', "Diconnection",  false);
						});

					}

					socket.on("disconnect", function(){
						socket.emit('disconnect', {gameId : gameId, screenName : loadScreenName});
					});

					switch (gameObj.playerMode)
					{
					case 2:
					{
						socket.emit('createTwoPlayerMultiplayerGame', {screenName : gameObj.playerName, colors : gameObj.playerColors}, function (data){

							if (data.ok)
							{
								 $("#main").fadeOut(1000);
								 //$("#main").hide( "slide", { direction: "up"  }, 2000 );
								state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, true, isMobile, menuMusic);
							}
							else
							{
								alertMessage(data.message, "Error", true);
							}
						});

						break;
					}
					case 4:
					{	socket.emit('createFourPlayerMultiplayerGame', {screenName : gameObj.playerName, colors : gameObj.playerColors}, function (data){
						if (data.ok)
						{
							 $("#main").fadeOut(1000);
							state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, true, isMobile, menuMusic);
						}
						else
						{
							alertMessage(data.message, "Error", true);
						}
					});
					break;
					}
					}
				}else{
					alertMessage(message, "Error", true);
				}

			});

			$('#joinGameBtn').parent().on("click", function () {
				gameObj.joinPlayerName = $('#joinPlayerName').val();
				gameObj.gameCode = $('#gameCode').val();
				var message = gameObj.verifyJoinGame();
				if (message === "ok"){
					
					if (socket === null)
					{
						socket = io();
						socket.on('disconnected', function(message){
							alertMessage(message + ' has disconnected.', "Diconnection",  false);
						});

					}

					socket.on("disconnect", function(){
						socket.emit('disconnect', {gameId : gameId, screenName : loadScreenName});
					});

					socket.emit('connectMultiplayerGame', {screenName :  gameObj.joinPlayerName, gameId : gameObj.gameCode}, function (data){

						if (data.ok)
						{	
							if (data.inprogress)
							{
								if (menuMusic !== null){
									menuMusic.destroy();
								}

								if (data.screenName === 'ADMIN'){
									 $("#main").fadeOut(1000);
									state.start('Game', true, false, data, true, socket, data.setSessionTurn, false, isMobile, data.sockId, data.screenName, true);
								}else{
									 $("#main").fadeOut(1000);
									socket.emit('playerReconnected', {gameId : gameObj.gameCode, screenName : data.screenName });
									state.start('Game', true, false, data, true, socket, data.setSessionTurn, data.owner, isMobile, data.sockId, data.screenName, true);
								}
							}
							else
							{
								 $("#main").fadeOut(1000);
								state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, data.owner, isMobile, menuMusic);
							}

						}
						else
						{
							alertMessage(data.message, "Error", true);
						}
					});
				}else{
					
					alertMessage(message, "Error", true);
				}

			});

		},

		twoPlayer : function(){
			this.two_player.alpha = 0.5;
			this.four_player.alpha = 1;
			this.load_game.alpha = 1;
			this.gameMode = 2;
			this.loadGame = false;
			this.gameCodeBg.alpha = 0.0;
			this.gameCode.alpha = 0.0;
			this.screenNameBg.alpha = 0.0;
			this.screenName.alpha = 0.0;

			this.twoPlayerScreenNameBg.alpha  = 0.5;
			this.twoPlayerScreenName.alpha = 0.5;

			this.fourPlayerScreenNameBg.alpha = 0.0;
			this.fourPlayerScreenName.alpha = 0.0;

		},

		fourPlayer : function(){
			this.four_player.alpha = 0.5;
			this.two_player.alpha = 1;
			this.load_game.alpha = 1;
			this.gameMode = 4;
			this.loadGame = false;
			this.gameCodeBg.alpha = 0.0;
			this.gameCode.alpha = 0.0;
			this.screenNameBg.alpha = 0.0;
			this.screenName.alpha = 0.0;
			this.twoPlayerScreenNameBg.alpha  = 0.0;
			this.twoPlayerScreenName.alpha = 0.0;
			this.fourPlayerScreenNameBg.alpha = 0.5;
			this.fourPlayerScreenName.alpha = 1;

			this.twoPlayerScreenNameBg.alpha  = 0.0;
			this.twoPlayerScreenName.alpha = 0.0;

			this.verifyChosenColors();

		},

		retrieveGame : function()
		{
			this.load_game.alpha = 0.5;
			this.four_player.alpha = 1.0;
			this.two_player.alpha = 1.0;
			this.loadGame = true;
			this.gameCodeBg.alpha = 0.5;
			this.gameCode.alpha = 1.0;
			this.screenNameBg.alpha = 0.5;
			this.screenName.alpha = 1.0;
			this.twoPlayerScreenNameBg.alpha  = 0.0;
			this.twoPlayerScreenName.alpha = 0.0;

			this.fourPlayerScreenNameBg.alpha = 0.0;
			this.fourPlayerScreenName.alpha = 0.0;

			this.twoPlayerScreenNameBg.alpha  = 0.0;
			this.twoPlayerScreenName.alpha = 0.0;
		},


		down: function(p)
		{
			if (p.key == "two-player"){

			}
			else if (p.key == "four-player"){

			}
			else if (p.key == "load-game"){

			}
		},

		selectColor : function(p)
		{
			if (p.key == "cred"){
				if (this.cred.scale.x === 0.5 && this.cred.scale.y === 0.5){
					this.cred.scale.x = 1;
					this.cred.scale.y = 1;
					this.removeColor("red");
				}else{
					this.cred.scale.x = 0.5;
					this.cred.scale.y = 0.5;
					this.colors.push("red");
					this.verifyChosenColors();
				}

			}
			else if (p.key == "cblue"){
				if (this.cblue.scale.x === 0.5 && this.cblue.scale.y === 0.5){
					this.cblue.scale.x = 1;
					this.cblue.scale.y = 1;
					this.removeColor("blue");
				}else{
					this.cblue.scale.x = 0.5;
					this.cblue.scale.y = 0.5;
					this.colors.push("blue");
					this.verifyChosenColors();
				} 
			}
			else if (p.key == "cgreen"){
				if (this.cgreen.scale.x === 0.5 && this.cgreen.scale.y === 0.5){
					this.cgreen.scale.x = 1;
					this.cgreen.scale.y = 1;
					this.removeColor("green");
				}else{
					this.cgreen.scale.x = 0.5;
					this.cgreen.scale.y = 0.5;
					this.colors.push("green");
					this.verifyChosenColors();
				} 

			}
			else if (p.key == "cyellow"){
				if (this.cyellow.scale.x === 0.5 && this.cyellow.scale.y === 0.5){
					this.cyellow.scale.x = 1;
					this.cyellow.scale.y = 1;
					this.removeColor("yellow");
				}else{
					this.cyellow.scale.x = 0.5;
					this.cyellow.scale.y = 0.5;
					this.colors.push("yellow");
					this.verifyChosenColors();
				} 
			}
		},

		removeColor : function(color){
			for (var i = 0; i < this.colors.length; ++i){
				if (this.colors[i] === color){
					this.colors.splice (i, 1);
					break;
				}
			}
		},

		verifyChosenColors : function(){
			if (this.gameMode === 2)
			{
				if (this.colors.length > 2)
				{
					var color = this.colors[0];
					this.unsetColor(color);
				}
			}
			else if (this.gameMode === 4){
				if (this.colors.length > 1)
				{
					var color = this.colors[0];
					this.unsetColor(color);
				}
			}
		},

		unsetColor : function(color){
			switch (color){
			case "red":
				this.cred.scale.x = 1;
				this.cred.scale.y = 1;
				this.removeColor("red");
				break;
			case "blue":
				this.cblue.scale.x = 1;
				this.cblue.scale.y = 1;
				this.removeColor("blue");
				break;
			case "green":
				this.cgreen.scale.x = 1;
				this.cgreen.scale.y = 1;
				this.removeColor("green");
				break;
			case "yellow":
				this.cyellow.scale.x = 1;
				this.cyellow.scale.y = 1;
				this.removeColor("yellow");
				break;
			default:
				break;
			}

		},

		colorChooser : function(){

		},

		startGame: function(pointer){

			var loadGame = this.loadGame;
			var gameId = this.gameCode.value.toString().trim();
			var twoPlayerScreenName = this.twoPlayerScreenName.value.toString().trim();
			var fourPlayerScreenName = this.fourPlayerScreenName.value.toString().trim();
			var loadScreenName = this.screenName.value.toString().trim();
			var state = this.game.state;
			var isMobile = this.isMobile;
			var menuMusic = this.menuMusic;

			if (loadGame)
			{

				if (!gameId || 0 === gameId.length){
					alertMessage("Please enter game id", "Error", true);
					return;
				}

				if (loadScreenName === 'twoplayer' || loadScreenName === 'fourplayer'){
					alertMessage("Please Enter Valid Screen Name", "Error", true);
					return;
				}

				if (loadScreenName.length < 1 ){
					alertMessage("Please Enter Valid Screen Name", "Error", true);
					return;
				}



				if (this.socket === null){
					this.socket = io();
					this.socket.on('disconnected', function(message){
						alertMessage(message + ' has disconnected.', "Diconnection",  false);
					});

				}
				var socket = this.socket;

				this.socket.on("disconnect", function(){
					socket.emit('disconnect', {gameId : gameId, screenName : loadScreenName});
				});


				this.socket.emit('connectMultiplayerGame', {screenName :  loadScreenName, gameId : gameId}, function (data){

					if (data.ok)
					{	

						if (data.inprogress)
						{
							if (menuMusic !== null){
								menuMusic.destroy();
							}



							if (data.screenName === 'ADMIN'){
								state.start('Game', true, false, data, true, socket, data.setSessionTurn, false, isMobile, data.sockId, data.screenName, true);
							}else{
								socket.emit('playerReconnected', {gameId : gameId, screenName : data.screenName });
								state.start('Game', true, false, data, true, socket, data.setSessionTurn, data.owner, isMobile, data.sockId, data.screenName, true);
							}

						}
						else
						{
							state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, data.owner, isMobile, menuMusic);
						}

					}
					else
					{
						alertMessage(data.message, "Error", true);
					}
				});
			}
			else
			{
				if (this.validateTextInput() === false)
				{
					alertMessage("Please Enter Valid Screen Name", "Error", true);
					return;
				}

				if (this.colors.length < 2 && this.gameMode === 2)
				{
					alertMessage("Please Choose at least 2 colors!", "Error", true);
					return;
				}

				if (this.colors.length < 1 && this.gameMode === 4)
				{
					alertMessage("Please Choose at least 1 color!", "Error", true);
					return;
				}


				if (this.socket === null){
					this.socket = io();
					this.socket.on('disconnected', function(message){
						alertMessage(message + ' has disconnected.', "Disconnection", false);
					});
				}

				var socket = this.socket;

				switch (this.gameMode){
				case 2:
					socket.emit('createTwoPlayerMultiplayerGame', {screenName : twoPlayerScreenName, colors : this.colors}, function (data){

						if (data.ok)
						{

							state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, true, isMobile, menuMusic);
						}
						else
						{
							alertMessage(data.message, "Error", true);
						}
					});
					break;

				case 4:
					socket.emit('createFourPlayerMultiplayerGame', {screenName : fourPlayerScreenName, colors : this.colors}, function (data){
						if (data.ok)
						{
							state.start('WaitMenu', true, false, data, true, socket, data.setSessionTurn, true, isMobile, menuMusic);
						}
						else
						{
							alertMessage(data.message, "Error", true);
						}

					});
					break;
				}	
			}
		},

		validateTextInput : function()
		{

			var str1 = this.twoPlayerScreenName.value.toString().trim();
			var str2 = this.fourPlayerScreenName.value.toString().trim();


			if (str1.length > 1 || str2.length > 1)
			{
				if (str1 === 'twoplayer' || str1 === 'fourplayer' || str2 === 'twoplayer' || str2 === 'fourplayer') {
					return false;
				}

				return true;

			}

			return false;

		},

		muteMusic : function(){

			/*
			if (this.socket === null){
				this.socket = io();
				this.socket.emit('loadGame', "name", function(message){
					alertMessage(message, "Game Loading...", false);
				});
			}else{
				this.socket.emit('loadGame', "name", function(message){
					alertMessage(message, "Game Loading...", false);
				});
			}
			 */

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


		update: function(){
			if (this.isMobile === false){
				this.filter.update();
			}
		}

};