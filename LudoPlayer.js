
exports.LudoPlayer = function(uniqueId, screenName, data, callback){

	var parsedData = JSON.parse(data);
	
	if (screenName.length == 0)
	{
		parsedData.gameId = uniqueId;
		parsedData.complete = false;
		parsedData.whoJoined = 1;
		var playerName = parsedData.players[0].playerName;
		var playerMode = parsedData.players[0].playerMode;
		parsedData.playerMode = playerMode;
		parsedData.playerNames = [];
		parsedData.playerNames.push(playerName);
		callback(parsedData);
		
	}else{
		
		parsedData.gameId = uniqueId;
		parsedData.players[0].playerName = screenName;
		parsedData.complete = false;
		parsedData.whoJoined = 1;
		var playerMode = parsedData.players[0].playerMode;
		parsedData.playerMode = playerMode;
		parsedData.playerNames = [];
		parsedData.playerNames.push(screenName);
		callback(parsedData);
	}
	
};
