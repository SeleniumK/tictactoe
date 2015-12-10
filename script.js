var activePlayer;

var pageManage = {
  namePlate: document.getElementById("namePlate"),
  hide: function(element){
    element.setAttribute("class", "hidden");
  },
  show: function(element){
    element.removeAttribute("class", "hidden");
  }
}

function Player(name, playerId){
  this.name = name;
  this.playerId = playerId;
  this.selectedCells = [];
  this.winner = false;
  this.display = function(){
   pageManage.namePlate.textContent = activePlayer.name + "'s Turn";
  }
}

var gameInit = {
  gameOver: false,
  playerX: null,
  playerO: null,
  newGame: function(){
    var newGame = document.getElementById('newGame');
    pageManage.show(newGame);
    newGame.addEventListener("submit", gameInit.startGame);
  },
  startGame: function(event){
    event.preventDefault();
    gameInit.playerX = new Player(event.target.playerX.value, "X");
    gameInit.playerO = new Player(event.target.playerO.value, "O");
    activePlayer = gameInit.playerX;
    boardManage.setBoard();
  },
  playAgain: function(){
    var startNew = document.getElementById("startNew");
    pageManage.show(startNew);
    startNew.addEventListener("click", function(){
      boardManage.clearBoard();
      gameInit.newGame();
    });
  }
}

var boardManage = {
  board: document.getElementById('board'),
  gameOver: false,
  freeCells: document.getElementsByClassName("cell"),
  clickedCells: [],
  clearBoard: function(event){
    pageManage.hide(startNew);
    for(var i = 0; i < boardManage.clickedCells.length; i++){
      var cellHandle = document.getElementById(boardManage.clickedCells[i]);
      cellHandle.setAttribute("class", "cell");
      cellHandle.removeChild(cellHandle.firstChild);
    }
    pageManage.namePlate.textContent = "";
    boardManage.gameOver = false;
    boardManage.clickedCells = [];
  },
  setBoard: function(){
    pageManage.hide(newGame);
    activePlayer.display();
    boardManage.board.addEventListener('click', turn.makeMove);
  }
}

var turn = {
  markCell: function(target){
    target.setAttribute("class", "clicked");
    var marked = document.createElement('div');
    marked.setAttribute("class", "picked");
    marked.textContent = activePlayer.playerId;
    target.appendChild(marked);
  },
  updateCellTrack: function(targetId, target){
    activePlayer.selectedCells.push(targetId);
    boardManage.clickedCells.push(targetId);
  },
  changeActivePlayer: function(){
    if(boardManage.gameOver){
      return;
    }
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
      turn.checkBoard(targetId);
      turn.checkTie();
      turn.updateCellTrack(targetId, target);
      if(!boardManage.gameOver){
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
    if(boardManage.clickedCells.length === 9){
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
    if(boardManage.clickedCells.length === 9){
      pageManage.namePlate.textContent = "Game Over: It was a draw!";
    }
    else{
      pageManage.namePlate.textContent = "Game Over: " + activePlayer.name + " Won!";
    }
    boardManage.board.removeEventListener("click", turn.makeMove);
    boardManage.gameOver = true;
    gameInit.playAgain();
  }
}

gameInit.newGame();
