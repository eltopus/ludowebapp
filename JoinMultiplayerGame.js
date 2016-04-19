
exports.JoinMultiplayerGame = function(gameData, screenName, callback){

	var parsedData = JSON.parse(gameData);
	var index = parsedData.whoJoined;
	
	
	if (isNotFull(parsedData))
	{
		
		validatePlayerName(screenName, parsedData.players, function(augmentedName){
				
			var whoJoined = index + 1;
			var complete = isComplete(parsedData, whoJoined);
			parsedData.players[index].playerName = augmentedName;
			parsedData.whoJoined = whoJoined;
			parsedData.complete = complete;
			parsedData.playerNames.push(augmentedName);
			callback(parsedData);
		});
		
	}
	else
	{
		callback(null, null);
		
	}

	
	function isNotFull(existingGameData){
		return (existingGameData.whoJoined < existingGameData.playerMode);
	};
	
	function isComplete(existingGameData, whoJoinedIndex){
		return (whoJoinedIndex == existingGameData.playerMode);
	};
	
	function validatePlayerName(playerName, players, callback){
		for (var i = 0; i < players.length; ++i){
			if (playerName == players[i].playerName){
				playerName  = playerName.concat('1');
				break;
			}
		}
		console.log('FinalPlayerName: ' + playerName);
		callback(playerName);
	};
	
};
