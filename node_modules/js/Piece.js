Piece = function (game, x, y, name, imageId, uniqueId, isMovable, state, index, isSelectable, group, playerName) {

        
    Phaser.Sprite.call(this, game, x, y, imageId);
    this.piecePath = activePath;
    this.redHomePath =  redPath;
    this.blueHomePath = bluePath;
    this.yellowHomePath = yellowPath;
    this.greenHomePath = greenPath;             
    this.x_home = x;      
    this.y_home = y;       
    this.piece = name;     
    this.imageId = imageId;      
    this.uniqueId = uniqueId;       
    this.isMovable = isMovable;      
    this.state = state;   
    this.index = index;      
    this.homeIndex = index     
    this. i = 0;      
    this.graph = null;     
    this.bmd = null;      
    this.isSelectable = isSelectable;      
    this.tween;     
    this.playerName = playerName;
    this.group = group; 
    this.isTweening = false;
    this.game = game;
    this.iddleState = 0;
    this.activeState = 1;
    this.awaitingExitState = 2;
    this.exitState = 3;
    this.moving = false;
    this.path = null;
};

this.Piece.prototype = Object.create(Phaser.Sprite.prototype);
this.Piece.prototype.constructor = this.Piece;


Piece.prototype.moveForward = function(pointsArray)
{
    this.startMoving();
    this.tween = this.game.add.tween(this).to({
          x: pointsArray.x,
          y: pointsArray.y,
     }, 2000,Phaser.Easing.Linear.None, true).interpolation(function(v, k){
          return Phaser.Math.linearInterpolation(v, k);
     }); 
    
    this.tween.onComplete.add(this.onCompleteMovement, this); 
};

Piece.prototype.moveToStart = function(path)
{
    switch(this.piece){
        case "red":
            this.startMoving();
            this.tween = this.game.add.tween(this).to( { x: 49, y: 287 }, 1000, Phaser.Easing.Linear.None, true);
            this.active();
            this.isSelectable = true;
            if (!path){
                this.tween.onComplete.add(this.onCompleteMovement, this);
            }
            else{
                this.path = path;
                this.tween.onComplete.add(this.onContinueMovement, this);  
            }
 
            break;
 
        case "blue":
            this.startMoving();
            this.tween = this.game.add.tween(this).to( { x: 384, y: 48 }, 1000, Phaser.Easing.Linear.None, true);  
            this.active();
            this.isSelectable = true;
            if (!path){
                this.tween.onComplete.add(this.onCompleteMovement, this);
            }
            else{
                this.path = path;
                this.tween.onComplete.add(this.onContinueMovement, this);  
            } 
            break;
               
        case "green":
            this.startMoving();   
            this.tween = this.game.add.tween(this).to( { x: 287, y: 622 }, 1000, Phaser.Easing.Linear.None, true);
            this.active();
            this.isSelectable = true; 
            if (!path){
                this.tween.onComplete.add(this.onCompleteMovement, this);
            }
            else{
                this.path = path;
                this.tween.onComplete.add(this.onContinueMovement, this);  
            }
            break;
              
        case "yellow":
            this.startMoving();
            this.tween = this.game.add.tween(this).to( { x: 624, y: 385 }, 1000, Phaser.Easing.Linear.None, true);   
            this.active();
            this.isSelectable = true;   
            if (!path){
                this.tween.onComplete.add(this.onCompleteMovement, this);
            }
            else{
                this.path = path;
                this.tween.onComplete.add(this.onContinueMovement, this);  
            }
            break;
    } 
};

Piece.prototype.moveBackHome = function(){
    this.iddle(); 
    this.isSelectable = false;
    this.index = this.homeIndex;
    var tween = this.game.add.tween(this).to( { x: this.x_home, y: this.y_home }, 2000, Phaser.Easing.Linear.None, true);   
};

Piece.prototype.plotPath = function(dieValue){
    
    this.bmd.clear();      
    points = {};  
    pathX = [];  
    pathY = [];  
    
    start = this.index;
    stop = start + dieValue + 1;     
    remainder = 0;
                 
    if (stop > 52){
                
        remainder = (stop % 52);   
        for (k = start; k < 52; ++k){
            pathX.push(this.piecePath.x[k]);  
            pathY.push(this.piecePath.y[k]);   
        }    
    }
            
    if (remainder > 0){
        this.index = remainder - 1;
        start = 0;
        stop = remainder;            
    }

    this.index = stop - 1;
 
    for (k = start; k < stop; ++k){
        pathX.push(this.piecePath.x[k]);    
        pathY.push(this.piecePath.y[k]);   
    }

    //Analyze go home *************************************************************************************8
            
    var goHome = this.analyzeMovement(pathX, pathY);
   
    if (goHome > 0){
                
        var newPathX = [];  
        var newPathY = [];
                
        for (var i = 0; i < goHome; ++i){
            newPathX.push(pathX[i]);
            newPathY.push(pathY[i]);     
        }
       
        var homePath = this.getHomePath(this);
        var homeValue = (dieValue - goHome) + 1;
        this.index = homeValue - 1;
                
        if (homeValue > 6){
            homeValue = 6;   
            this.exit();
        }       
        else{      
            this.awaitingExit();      
        }

                
        for (var i = 0; i < homeValue; ++i){
            newPathX.push(homePath.x[i]);
            newPathY.push(homePath.y[i]);   
        }
                     
        if (homeValue == 6){   
            this.exit();   
        }    
        points.x = newPathX;    
        points.y = newPathY;
    }else{        
        points.x = pathX; 
        points.y = pathY; 
    }
               
    for (var p = 0; p < points.x.length; p++) {   
        this.bmd.rect(points.x[p]-3, points.y[p]-3, 6, 6, 'rgba(0, 0, 90, 1)');     
    } 
    
    return points;
};

Piece.prototype.getHomePath = function(){
            
    homePath = null;     
    switch(this.piece){
        case "red":
            homePath = this.redHomePath;
            break;
        case "blue":
            homePath = this.blueHomePath;
            break;
        case "green":
            homePath = this.greenHomePath;
            break;
        case "yellow":
            homePath = this.yellowHomePath;
            break;
    }      
    return homePath;
};


Piece.prototype.plotExitpath = function(dieValue){
    
    this.bmd.clear();         
    points = {};
    pathX = [];
    pathY = [];
            
    var start = this.index;
    var stop = start + dieValue + 1;
            
            
    if (stop > 6){
        this.isMovable = false;
        return null;
    }
    else{
        var homePath = this.getHomePath();
        for (var i = start; i < stop; ++i){
            pathX.push(homePath.x[i]);
            pathY.push(homePath.y[i]);
        }
        
        points.x = pathX;  
        points.y = pathY; 
                
        this.index = stop - 1;
        
        if (stop == 6){
            this.exit();
        }
        
                
        for (var p = 0; p < points.x.length; p++){
            
            this.bmd.rect(points.x[p]-3, points.y[p]-3, 6, 6, 'rgba(0, 0, 90, 1)');
        }
            
        return points;
    }
};

Piece.prototype.analyzeMovement = function(pathX, pathY){
            
    var home = -1;      
    switch(this.piece){ 
        case "red":
            for (var i = 0; i < pathX.length; ++i){
                if (pathX[i] == 0 && pathY[i] == 288){
                    home = i;
                    break; 
                }     
            } 
            break;
                
        case "blue":
                  
            for (var i = 0; i < pathX.length; ++i){  
                if (pathX[i] == 384 && pathY[i] == 0){
                    home = i;
                    break;   
                }     
            }       
            break;
                
        case "green":
                   
            for (var i = 0; i < pathX.length; ++i){ 
                if (pathX[i] == 288 && pathY[i] == 672){
                    home = i;
                    break;     
                }    
            }     
            break;  
            
        case "yellow":
            for (var i = 0; i < pathX.length; ++i){
                if (pathX[i] == 672 && pathY[i] == 384){
                    home = i;
                    break;   
                }
            } 
            break;   
    }           
    return home;  
};

Piece.prototype.startMoving = function(){
    this.moving = true;
};

Piece.prototype.stopMoving = function(){
    this.moving = false;
};

Piece.prototype.isMoving = function(){
    return this.moving;
};

Piece.prototype.isIddle = function(){
    return (this.state == 0);
};

Piece.prototype.iddle = function(){
    this.state = 0;
};

Piece.prototype.isActive = function(){
    return (this.state == 1);
};

Piece.prototype.active = function(){
    this.state = 1;
};

Piece.prototype.isAwaitingExit = function(){
    return (this.state == 2);
};

Piece.prototype.awaitingExit = function(){
    this.state = 2;
};

Piece.prototype.isExited = function(){
    return (this.state == 3);
};

Piece.prototype.exit = function(){
    this.state = 3;
};


Piece.prototype.checkCollision = function(){
    for (var i = 0; i < this.game.ludo.length; ++i){
        if (this.game.ludo[i].playerName != this.playerName){
            var activePieces = this.game.ludo[i].getActivePieces();
            for (var j = 0; j < activePieces.length; ++j){
                if (this.isActive() && activePieces[j].index == this.index){
                    activePieces[j].moveBackHome();
                    return activePieces[j].uniqueId;
                }
            }
        }
    }
    return null;
};


Piece.prototype.onCompleteMovement = function()
{
    this.stopMoving();
    this.path = null;
    this.bmd.clear(); 
    var peck = this.checkCollision();
    if (peck != null){
        this.exit();
        this.visible = false;
        this.game.getNextActivePiece();
        this.game.unselectUnplayedDie();
    }
    
    if (this.isExited()){
        this.visible = false;
        this.game.unselectUnplayedDie();
        this.game.getNextActivePiece();
        this.game.drawExitingGrahics(this);
    }
    
    this.game.checkPlayCompleted(this.playerName, peck);
};

Piece.prototype.onContinueMovement = function()
{
    this.moveForward(this.path);
};