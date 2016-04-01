/**
 * 
 */
var io;
var gameSocket;
var parsedData;
var gameId;
var gameData = '{"gameId":"412b2a8d-a303-471a-8c26-bcba5ca50ba4","diceIds":[{"uniqueId":"551cb0ea-8f72-4edf-8cd2-aa5824a818b0","value":0},{"uniqueId":"e63124ca-eecf-4166-91a3-daf5db6a6e83","value":0}],"players":[{"piecesNames":["red","blue"],"playerName":"Player One","hasRolled":false,"index":0,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"red","state":0,"index":1,"x":118,"y":72,"x_home":118,"y_home":72,"imageId":"red_piece","uniqueId":"7d5dfd0c-4553-4a40-960f-cc0741751952","homeIndex":1},{"piece":"red","state":0,"index":1,"x":72,"y":118,"x_home":72,"y_home":118,"imageId":"red_piece","uniqueId":"15b8fb31-d4b8-453b-9fa5-0deb71c87bc2","homeIndex":1},{"piece":"red","state":0,"index":1,"x":168,"y":118,"x_home":168,"y_home":118,"imageId":"red_piece","uniqueId":"c3aed909-db1a-4b13-819e-560026d9d824","homeIndex":1},{"piece":"red","state":0,"index":1,"x":120,"y":168,"x_home":120,"y_home":168,"imageId":"red_piece","uniqueId":"1d589270-488f-4af7-9806-9367ae4a2431","homeIndex":1},{"piece":"blue","state":0,"index":14,"x":552,"y":72,"x_home":552,"y_home":72,"imageId":"blue_piece","uniqueId":"be26b859-dbbe-4eed-ba0b-1306063c61b4","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":503,"y":118,"x_home":503,"y_home":118,"imageId":"blue_piece","uniqueId":"843b1645-28cd-4b2b-9ac6-7876117c4777","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":600,"y":118,"x_home":600,"y_home":118,"imageId":"blue_piece","uniqueId":"c76b4c98-b011-4912-8654-150800cfff17","homeIndex":14},{"piece":"blue","state":0,"index":14,"x":552,"y":168,"x_home":552,"y_home":168,"imageId":"blue_piece","uniqueId":"ad48fb91-4992-4471-9e51-169c1a051494","homeIndex":14}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]},{"piecesNames":["yellow","green"],"playerName":"Player Two","hasRolled":false,"index":1,"playerMode":2,"endOfPlay":0,"pieces":[{"piece":"yellow","state":0,"index":27,"x":552,"y":503,"x_home":552,"y_home":503,"imageId":"yellow_piece","uniqueId":"bdd4985a-b781-4b09-81bb-1277a9d55a19","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":503,"y":552,"x_home":503,"y_home":552,"imageId":"yellow_piece","uniqueId":"89f5b924-3790-493a-8b3d-dc5dcaf079df","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":600,"y":552,"x_home":600,"y_home":552,"imageId":"yellow_piece","uniqueId":"9851ae14-11f7-4e99-895b-a6aadad624f9","homeIndex":27},{"piece":"yellow","state":0,"index":27,"x":552,"y":600,"x_home":552,"y_home":600,"imageId":"yellow_piece","uniqueId":"175d4eb0-9b92-4193-b00c-2f140c0a9c9a","homeIndex":27},{"piece":"green","state":0,"index":40,"x":118,"y":503,"x_home":118,"y_home":503,"imageId":"green_piece","uniqueId":"4013297f-3733-4d59-88f1-ad16fedbbfe2","homeIndex":40},{"piece":"green","state":0,"index":40,"x":72,"y":552,"x_home":72,"y_home":552,"imageId":"green_piece","uniqueId":"faa02b62-2d7b-4a6b-8799-c438c12e8713","homeIndex":40},{"piece":"green","state":0,"index":40,"x":168,"y":552,"x_home":168,"y_home":552,"imageId":"green_piece","uniqueId":"4328f76b-9d6b-4dcb-8b29-b53115112669","homeIndex":40},{"piece":"green","state":0,"index":40,"x":118,"y":600,"x_home":118,"y_home":600,"imageId":"green_piece","uniqueId":"e3ddfea7-3838-4a00-88f7-f78b53af81f6","homeIndex":40}],"diceObject":[],"turn":false,"selectedPieceId":null,"exitingGraphicsPositions":[740,780,820,860]}]}';

exports.initGame = function(gameio, socket){
	io = gameio;

	gameSocket = socket;
	gameSocket.emit('connected', 'You are connected!');
	gameSocket.on('createNewGame', createNewGame);
	gameSocket.on('saveNewGame', saveNewGame);
	gameSocket.on('join', joinGame);
	gameSocket.on('pieceSelection', pieceSelection);


	gameSocket.on('disconnect', disconnected);
};


function pieceSelection(data){
	console.log('--------------------------------------------------------');
	console.log(data + ' is selected. ');
};


function createNewGame(data){
	gameData = data;
	console.log(data);
	parsedData = JSON.parse(data);
	gameId = parsedData.gameId;
	console.log(gameId + ' ' + this.id);
	this.join(gameId.toString());
};




function joinGame(data, callback){
	var sock = this;
	//var room = gameSocket.manager.rooms["/" + gameId.toString()];

	console.log(gameId.toString() + ' ' + sock.id);
	//console.log(room);
	
	/*
    if( room != undefined )
    {
        sock.join(data.gameId);
        io.sockets.in(gameId).emit('playerJoinedRoom', 'new player joined');
        console.log('user is joining the game');
    	callback({ok:true});
    	sock.emit('join', gameData);

    } else {
        
        this.emit('error', 'This room does not exist.' );
    }
    */
    

};


function disconnected(){
	console.log('user disconnected');
};

function saveNewGame(data){
	gameData = data;
	var sock = this;
	console.log(data);
	sock.emit('saveNewGame', 'Game Saved Successfully');
};



