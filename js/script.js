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




/***!!! IMPLEMENTATION !!!***/
puzzle.addEventListener("click", function(e) { // Listen for click on puzzle pieces
    if(startingState){
        puzzle.className = "animate";
        shiftSquare(e.target);
    }
});
shuffleButton.addEventListener("click", shuffle); // Listen for click on shuffle
initialize(); // Initialize puzzle position


  

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

            /*if(startingState){
                checkSolved();
            }*/
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

function restartStats(){
    second = 0;
    minute = 0;
    timer.innerHTML = "00:00";
    moves = 0;
    counter.innerHTML = moves;
}
/** Check order of squares to confirm solved **/
function checkSolved(){
    startingState = true;
    // If empty cell not in proper position for solution, assume not solved and return
    if(getSquare(4, 4).className != "empty"){
        return;
    }

    var k = 1;
    // Check all squares in correct position
    for(var i = 1; i <= 4; i++){
        for(var j = 1; j <= 4; j++){
            if(k <= 15 && getSquare(i, j).innerHTML != k.toString()){ // Compares k (starting from 1) to numbered innerHTML value of each square 
                return; // Order not correct
            }
            k++;
        }
    }

    /** Executes below only after confirmed solved **/
    // Store final time and moves
    finalTime = timer.innerHTML;
    finalMoves = counter.innerHTML;
    // Display time/moves and re-shuffles puzzle after few seconds
    setTimeout(function(){
        if(confirm("Time: " + finalTime + "\nMoves: " + finalMoves)){
            shuffle();
        }
    }, 1200);
    
    // Reset timer
    moves = 0; // IS THIS NEEDED?
    second = 0;
    minute = 0;
    timer.innerHTML = "0 mins 0 secs";
    counter.innerHTML = moves + " Move(s)";
}