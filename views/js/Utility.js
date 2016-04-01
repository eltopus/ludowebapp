var groups = [];
var groupIndex = -1;
var diceDisplayStyle = { font: "25px Revalia", fill: "#00ffff", wordWrap: true, wordWrapWidth: 100, align: "center" };
var playerTurnDisplayStyle = { font: "20px Revalia", fill: "#00ffff", wordWrap: true, wordWrapWidth: 200, align: "center" };

createPieceGroups = function(game){
    
    for (var i = 0; i < 17; ++i){
        groups[i] = game.add.group();
    }
};

getNextGroup = function(){
    
    if (groupIndex == groups.length){
        groupIndex = 0;
        return groups[groupIndex];
    }
    ++groupIndex;
    
    return groups[groupIndex];
}

    
var redConfig = {
    
    'x' : [118, 72, 168, 120], 
    
    'y' : [72, 118, 118, 168 ],
    
    name : "red",
    
    imageId : "red_piece",
    
    uniqueId : null,
    
    isMovable : false,
    
    state : 0,
    
    index : 1,
    
    isSelectable : false
};

var blueConfig = {
    
    'x' : [552, 503, 600, 552], 
    
    'y' : [72, 118, 118, 168 ],
    
    name : "blue",
    
    imageId : "blue_piece",
    
    uniqueId : null,
    
    isMovable : false,
    
    state : 0,
    
    index : 14,
    
    isSelectable : false
};

var yellowConfig = {
    
    'x' : [552, 503, 600, 552], 
    
    'y' : [503, 552, 552, 600 ],
    
    name : "yellow",
    
    imageId : "yellow_piece",
    
    uniqueId : null,
    
    isMovable : false,
    
    state : 0,
    
    index : 27,
    
    isSelectable : false
};

var greenConfig = {
    
    'x' : [118, 72, 168, 118], 
    
    'y' : [503, 552, 552, 600 ],
    
    name : "green",
    
    imageId : "green_piece",
    
    uniqueId : null,
    
    isMovable : false,
    
    state : 0,
    
    index : 40,
    
    isSelectable : false
};


createUUID = function() {

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
};

var activePath  = {
            //     0   1   2   3    4    5     6     7     8    9        
            'x': [ 0, 48, 96, 144, 192, 240,  288,  288, 288, 288,
                  
                //10    11    12    13    14   15    16   17  18   19
                  288,  288,  336,  384,  384, 384, 384, 384, 384, 432, 
                  
                // 20   21   22   23   24    25    26  
                  480, 528, 576, 624, 672,  672,  672, 
                  
                // 27    28   29    30    31      32   33    34     35      
                  624,   576, 528,  480,  432,   384,  384,  384,   384,   
                  
                // 36   37    38     39   40   41    42   43   44   45 
                  384,  384,  336,  288,  288, 288,  288, 288, 288, 240, 
                  
                //46    47  48  49  50 51  52  
                  192, 144, 96, 48,  0, 0, 0],
            
            //     0    1     2    3     4    5    6    7       8     9      10 
            'y': [288, 288,  288, 288,  288, 288, 237, 189.6, 142.2, 94.8,  47.4,  
                  
                //11  12   13   14   15    16    17      18    19  
                  0,  0,   0,   48,  95,  142.5, 190,   237.5, 288, 
                  
                // 20    21    22    23  24    25  26
                  288,  288,  288,  288, 288, 336, 384, 
                  
                // 27    28    29    30     31    32    33   34    35       
                  384,  384,  384,  384,   384,  432,  480,  528,  576,  
                
                // 36   37    38    39   40   41   42   43    44   
                  624,  672,  672,  672, 624, 576, 528, 480, 432, 
                  
                // 45  46   47   48   49   50  51    52
                  384, 384, 384, 384, 384, 384, 336, 285]
        };

var redPath =    {    'x' : [48,  96, 144, 192, 240,  288],
                      
                                'y' : [336, 336, 336, 336, 336, 336]
                              };
var bluePath =   {   'x' : [336, 336, 336, 336, 336, 336],
                      
                                'y' :  [48,  96,  144, 192, 240, 288]
                      };
var yellowPath = { 'x':[624, 576, 528, 480, 432, 384],
                      
                                'y' :  [336,  336,  336, 336, 336, 336]
                      };
var greenPath = { 'x': [336,  336,  336, 336, 336, 336],
                      
                                'y' :  [624,  572,  528, 480, 432, 384]
                      };


setBlueParameter = function(piece){
    
    piece.awaitingExit();
    piece.index = 4;
    piece.x = 336;
    piece.y = 240;
};

setGreenParameter1 = function(piece){
    
    piece.awaitingExit();
    piece.index = 1;
    piece.x = 336;
    piece.y = 572;
};

setGreenParameter2 = function(piece){
    
    piece.awaitingExit();
    piece.index = 0;
    piece.x = 336;
    piece.y = 624;
};
