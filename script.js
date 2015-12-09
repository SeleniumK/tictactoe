var board = document.getElementById('board');
var namePlate = document.getElementById("namePlate");
var activePlayer;

function Player(name, playerId){
  this.name = name;
  this.playerId = playerId;
  this.selectedCells = [];
  this.winner = false;
  this.display = function(){
    namePlate.textContent = activePlayer.name + "'s Turn";
  }
}

var gameInit = {
  gameOver: false,
  playerX: null,
  playerO: null,
  playerName: function(){
    var player1 = prompt('Who is playing X\'s?');
    gameInit.playerX = new Player(player1, "X");
    var player2 = prompt('Who is playing O\'s?');
    gameInit.playerO = new Player(player2, "O");
  },
  startGame: function(){
    gameInit.playerName();
    activePlayer = gameInit.playerX;
    activePlayer.display();
    board.addEventListener('click', turn.makeMove);
  }
}

var turn = {
  numTurns: 0,
  markCell: function(target){
    target.setAttribute("class", "clicked");
    var marked = document.createElement('div');
    marked.setAttribute("class", "picked");
    marked.textContent = activePlayer.playerId;
    target.appendChild(marked);
  },
  changeActivePlayer: function(){

    if(activePlayer == gameInit.playerX){
      activePlayer = gameInit.playerO;
    } else if(activePlayer == gameInit.playerO){
      activePlayer = gameInit.playerX;
    }
    activePlayer.display();
  },
  makeMove: function(event){
    var target = event.target;
    var targetId = event.target.id.toString();
    var cellClass = target.className;
    if(cellClass == "row"){
      return;
    }
    if(cellClass != "clicked"){
      turn.markCell(target);
      turn.numTurns++;
      turn.checkBoard(targetId);
      turn.checkTie();
      if(!gameInit.gameOver){
        activePlayer.selectedCells.push(targetId);
        turn.changeActivePlayer();
      }
    }
  },
  checkBoard: function(targetId){
    var currentColumn = parseInt(targetId.substring(0, 1));
    var currentRow = parseInt(targetId.substring(2, 3));
    var winColumn = [targetId];
    var winRow = [targetId];
    var leftCross = [];
    var rightCross = [];
  //check for diagonals
    if(currentRow === currentColumn){
      leftCross.push(targetId);
    }
    if(currentRow + currentColumn === 2 ){
      rightCross.push(targetId);
    }
    //check for win
    for(var i = 0; i < activePlayer.selectedCells.length; i++){
      var selectedCell = activePlayer.selectedCells[i];
      var selectedColumn = parseInt(selectedCell.substring(0, 1));
      var selectedRow = parseInt(selectedCell.substring(2, 3));

      if (selectedRow === selectedColumn) {
        leftCross.push(selectedCell);
        turn.checkWin(leftCross);
      }
      if(selectedRow + selectedColumn === 2){
        rightCross.push(selectedCell);
        turn.checkWin(rightCross);
      }
      if(currentColumn === selectedColumn){
        winColumn.push(selectedCell);
        turn.checkWin(winColumn)
      }
      if(currentRow === selectedRow){
        winRow.push(selectedCell);
        turn.checkWin(winRow);
      }
    }
  },
  checkTie: function(){
    if(turn.numTurns === 9){
      turn.endGame();
    }
  },
  checkWin: function(array){
    var thisArray = array;
    if(thisArray.length === 3){
      activePlayer.winner = true;
      turn.endGame();
      for(var i = 0; i < thisArray.length; i++){
      var cell = document.getElementById(array[i]);
      cell.setAttribute("class", "won");
      }
    }
  },
  endGame: function(){
    if(turn.numTurns === 9){
      namePlate.textContent = "Game Over: It was a draw!";
    }
    else{
      namePlate.textContent = "Game Over: " + activePlayer.name + " Won!";
    }
    board.removeEventListener("click", turn.makeMove);
    gameInit.gameOver = true;
  }
}

gameInit.startGame();
