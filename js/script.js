/***!!! VARIABLES !!!***/
var puzzle = document.getElementById("puzzle");
var puzzlePieces = puzzle.children;
var shuffleButton = document.querySelector(".shuffle-button");

// Variable to track if puzzle in initial solved state
var startingState = true;

// Variables to track moves 
var counter = document.querySelector(".move-counter");
var moves = 0;

// Variables to track timer
var timer = document.querySelector(".timer");
var second = 0, minute = 0;
var interval;

// Variables store final time/moves
var finalTime;
var finalMoves;





  

/***!!! FUNCTIONS !!!***/
/** Initialize puzzle in solved state **/
function initialize(){
	var toppx = 0;
	var leftpx = 0;

	for(var i = 0; i < puzzlePieces.length; i++){
        puzzlePieces[i].className = "puzzle-piece";

		/* Set top and left for each piece */
		puzzlePieces[i].style.top = toppx + "px";
		puzzlePieces[i].style.left = leftpx + "px";

        /* Update top and left positions */
		if(leftpx == 390){ // Three left transitions of 130px equals 390. At 390px,...
			var toppx = toppx + 130; // ...shift 130px down and...
			var leftpx = 0; // ...back to 0px left
		}else{
			var leftpx = leftpx + 130; // 120px height of puzzle piece + 10px margin-bottom = 130px
        }

       	/* Set empty */
		if(i == puzzlePieces.length - 1){
			puzzlePieces[i].className = "empty";
			puzzlePieces[i].style.backgroundPosition = "";
		}
    }

    timer.innerHTML = "00:00";
	counter.innerHTML = moves;
}
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute + ":" + second;
        second++;
        if(second == 60){
            minute++;
            second = 0;
        }
    },1000);
}

/** Increment move counter **/
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
}
/** Shift square into empty space **/
function shiftSquare(square){
    if(square.className != "empty"){
        var emptySquare = getEmptyAdjacentSquare(square);

        if(emptySquare){
            var temptop = square.style.top;
            var templeft = square.style.left;
            var tempid = square.id;
            // Swap id and style
            square.style.top = emptySquare.style.top;
            square.style.left = emptySquare.style.left;
            square.id = emptySquare.id;

            emptySquare.style.top = temptop;
            emptySquare.style.left = templeft;
            emptySquare.id = tempid;
            
            moveCounter();
        }
    }
}
/** Get and return puzzle square by row and col **/
function getSquare(row, col){
    return document.getElementById("piece_" + row + "_" + col);
}
/** Return array of puzzle squares adjacent to current square **/
function getAdjacentSquares(square){
    var id = square.id.split("_");
    // Get square position
    var row = parseInt(id[1]);
    var col = parseInt(id[2]);
    var adj = [];

    // Get all adj
    if(row > 1){
        adj.push(getSquare(row - 1, col)); // Up
    }
    if(row < 4){
        adj.push(getSquare(row + 1, col)); // Down
    }
    if(col < 4){
        adj.push(getSquare(row, col + 1)); // Left
    }
    if(col > 1){
        adj.push(getSquare(row, col - 1)); // Right
    }
    return adj;

}
/** Get and return empty square **/
function getEmptySquare(){
    return puzzle.querySelector(".empty");
}
/** Get empty square if adjacent to current square **/
function getEmptyAdjacentSquare(square){
    // Gets all adj sqaures
    var adj = getAdjacentSquares(square);
    // Search for empty cell
    for(var i = 0; i < adj.length; i++){
        if(adj[i].className == "empty"){
            return adj[i];
        }
    }
    // Empty square not found
    return false;
}
/** Shuffle puzzle **/
function shuffle(){
    if(!startingState){
        return;
    }

    startingState = false;

    var adjacent, rand, randSquare;

    for(var i = 0; i < 300; i++){
        adjacent = getAdjacentSquares(getEmptySquare());
        rand = Math.floor(Math.random() * adjacent.length);
        randSquare = adjacent[rand];

        shiftSquare(randSquare);
    }
    startingState = true;

    //Restart timer and moves
    restartStats();
    clearInterval(interval);
    startTimer();
}
