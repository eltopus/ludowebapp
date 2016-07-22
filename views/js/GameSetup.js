/**
 * http://usejsdoc.org/
 */

Ludo.GameSetup = function(game){
};

Ludo.GameSetup.prototype = {

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
			this.soundIcon = this.game.add.sprite((this.game.width / 2), 300, "soundIcon");
			this.soundIcon.anchor.set(0.5);
			this.soundIcon.scale.x = 0.4;
			this.soundIcon.scale.y = 0.4;
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
			}else{

				this.game.stage.backgroundColor = "#171642";

			}

			var cred = this.make.button((this.game.width / 2) - 350, (this.game.height /2) - 270, 'cred', null, this, 2, 1, 0);
			var cblue = this.make.button((this.game.width / 2) - 130, (this.game.height /2) - 270, 'cblue', null, this, 2, 1, 0);
			var cyellow = this.make.button((this.game.width / 2) + 100, (this.game.height /2) - 270, 'cyellow', null, this, 2, 1, 0);
			var cgreen = this.make.button((this.game.width / 2) + 340, (this.game.height /2) - 270, 'cgreen', null, this, 2, 1, 0);

			cred.anchor.x = 0.5;
			cred.anchor.y = 0.5;
			cblue.anchor.x = 0.5;
			cblue.anchor.y = 0.5;
			cgreen.anchor.x = 0.5;
			cgreen.anchor.y = 0.5;
			cyellow.anchor.x = 0.5;
			cyellow.anchor.y = 0.5;


			this.buttonGroup = this.add.group();
			this.buttonGroup.add(cred);
			this.buttonGroup.add(cblue);
			this.buttonGroup.add(cyellow);
			this.buttonGroup.add(cgreen);

			this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
			this.game.stateTransition.configure({ duration: 1000, ease: Phaser.Easing.Linear.None, properties: { alpha: 0, scale: { x: 1.4, y: 1.4 } }});
			
			var isSelected = function(cbtn){
				return (cbtn.scale.x === 0.5 && cbtn.scale.y === 0.5);
			};
			
			var selectBtn = function(cbtn){
				cbtn.scale.x = 0.5;
				cbtn.scale.y = 0.5;
			};
			
			var unselectBtn = function(cbtn){
				cbtn.scale.x = 1;
				cbtn.scale.y = 1;
			};

			var selectColors = function(color){
				console.log(color);

				if ("c" + color === cred.key)
				{
					
					if (isSelected(cred)){
						unselectBtn(cred);
						//document.getElementById("redBtn").style.opacity = "1";
					}else{
						selectBtn(cred);
						//document.getElementById("redBtn").style.opacity = "0.5";
					}
					
					return;
				}

				if ("c" +color === cblue.key){
					
					
					if (isSelected(cblue)){
						unselectBtn(cblue);
						//document.getElementById("blueBtn").style.opacity = "1";
					}else{
						selectBtn(cblue);
						//document.getElementById("blueBtn").style.opacity = "0.5";
					}
					
					return;
				}

				if ("c" + color === cyellow.key){
					
					
					if (isSelected(cyellow)){
						unselectBtn(cyellow);
						//document.getElementById("yellowBtn").style.opacity = "1";
					}else{
						selectBtn(cyellow);
						//document.getElementById("yellowBtn").style.opacity = "0.5";
					}
					return;
				}

				if ("c" + color === cgreen.key){
					
					if (isSelected(cgreen)){
						unselectBtn(cgreen);
						//document.getElementById("greenBtn").style.opacity = "1";
					}else{
						selectBtn(cgreen);
						//document.getElementById("greenBtn").style.opacity = "0.5";
					}
					return;
				}
			};


			this.gameObj = new GameObj();
			var gameObj = this.gameObj;

			$('.dropdown-menu > li').click(function() {
				var $toggle = $(this).parent().siblings('.dropdown-toggle');
				$toggle.html($(this).text() + "<span class=\"caret\"></span>");

				if ($(this).text() === "2-PLAYER"){
					console.log( "2-PlayerMode " + $(this).text());
					gameObj.playerMode = 2;
					gameObj.resetColors();
					unselectBtn(cred);
					unselectBtn(cblue);
					unselectBtn(cyellow);
					unselectBtn(cgreen);
				}
				else if ($(this).text() === "4-PLAYER"){
					console.log( "4-PlayerMode " + $(this).text());
					gameObj.playerMode = 4;
					gameObj.resetColors();
					unselectBtn(cred);
					unselectBtn(cblue);
					unselectBtn(cyellow);
					unselectBtn(cgreen);
				}

			});

			$('#redBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					$(this).toggleClass("clicked");
					if (gameObj.addPlayerColors("red")){
						selectColors("red");
					}else{
						alertMessage("Number of Selected Colors Allowed Reached!", "Error!", true);
					}
					
				}

			});

			$('#blueBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					if (gameObj.addPlayerColors("blue")){
						selectColors("blue");
					}else{
						alertMessage("Number of Selected Colors Allowed Reached!", "Error!", true);
					}
					
				}
			});

			$('#yellowBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					if (gameObj.addPlayerColors("yellow")){
						selectColors("yellow");
					}else{
						alertMessage("Number of Selected Colors Allowed Reached!", "Error!", true);
					}
					
				}
			});

			$('#greenBtn').parent().on("click", function () {
				if (gameObj.playerMode === 0){
					alertMessage("Please select Player Mode", "Missing Player Mode", true);
				}else{
					if (gameObj.addPlayerColors("green")){
						selectColors("green");
					}else{
						alertMessage("Number of Selected Colors Allowed Reached!", "Error!", true);
					}
					
				}
			});



			var socket = this.socket;
			var state = this.game.state;
			var isMobile = this.isMobile;
			var menuMusic = this.menuMusic;

			$('#createBtn').parent().on("click", function () {
				gameObj.playerName = $('#playerName').val();
				var message = gameObj.verifyCreateGame();
				console.log("Message " + message);

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




		colorChooser : function(){

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

		update: function(){
			if (this.isMobile === false){
				this.filter.update();
			}
		}

};