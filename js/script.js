var puzzle = document.getElementById("puzzle");
var puzzlePieces = puzzle.children;

(function(){

	initialize(); //Initialize puzzle position

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
	}

}());