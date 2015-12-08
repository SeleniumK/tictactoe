var board = document.getElementById('board');
var activePlayer;


function Player(name, playerId, markedSpots){
  var self = this;
  this.name = name;
  this.playerId = playerId;
  this.selectedCells = [];
  this.winner = false;
  this.markCell = function(target, targetId){
    var marked = document.createElement('div')
    marked.setAttribute("class", "picked");
    marked.textContent = activePlayer.playerId;
    target.appendChild(marked);
  };
  this.changeActivePlayer = function(){
    if(activePlayer == playerX){
      activePlayer = playerO;
    } else if(activePlayer == playerO){
      activePlayer = playerX;
    }
  };
  this.makeMove = function(event){
    var target = event.target;
    var targetId = event.target.id.toString();
    console.log(targetId);
    if(!$(target).hasClass('cell')){
      return;
    }
    if(!$(target).hasClass('picked')){
      self.markCell(target);
      checkBoard(targetId);
      console.log("Did I win? " + activePlayer.winner);
      activePlayer.selectedCells.push(targetId);
      self.changeActivePlayer();
    }
  };
}

function checkWin(array){
  if(array.length === 3){
    activePlayer.winner = true;
  }
}

function checkBoard(targetId){
  var currentColumn = targetId.substring(0, 1);
  var currentRow = targetId.substring(2, 3);
  var winColumn = [targetId];
  var winRow = [targetId];
  var leftCross = [];
  var rightCross = [];

  if(currentRow === currentColumn){
    leftCross.push(targetId);
  }
  if((parseInt(currentRow) + parseInt(currentColumn)) === 2 ){
    rightCross.push(targetId);
  }

  for(var i = 0; i < activePlayer.selectedCells.length; i++){
    var selectedCell = activePlayer.selectedCells[i];
    var selectedColumn = selectedCell.substring(0, 1);
    var selectedRow = selectedCell.substring(2, 3);

    if (selectedRow == selectedColumn) {
      leftCross.push(selectedCell);
      checkWin(leftCross);
    }
    if((parseInt(selectedRow) + parseInt(selectedColumn)) === 2){
      rightCross.push(selectedCell);
      checkWin(rightCross);
    }
    if(currentColumn == selectedColumn){
      winColumn.push(selectedCell);
      checkWin(winColumn)
    }
    if(currentRow == selectedRow){
      winRow.push(selectedCell);
      checkWin(winRow);
    }
  }
}


var gameInit = {
  playerX: null,
  playerO: null,
  playerName: function(){
    var player1 = prompt('Who is playing X\'s?');
    playerX = new Player(player1, "X");
    var player2 = prompt('Who is playing O\'s?');
    playerO = new Player(player2, "O");
  }
}

function playGame(){
  gameInit.playerName();
  activePlayer = playerX;
  board.addEventListener('click', activePlayer.makeMove);
}

playGame();
