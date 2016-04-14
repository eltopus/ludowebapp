window.onload = function() {
	
	var game = new Phaser.Game(900, 720, Phaser.Auto, 'gameContainer');
	game.state.add('Boot', Ludo.Boot);
	game.state.add('Preloader', Ludo.Preloader);
	game.state.add('StartMenu', Ludo.StartMenu);
	game.state.add('Game', Ludo.Game);
	game.state.start('Boot');
};