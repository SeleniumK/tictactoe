// "use strict"
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

var turn = {
  markCell: function(target, targetId){
    var marked = document.createElement('div')
    marked.setAttribute("class", "picked");
    marked.textContent = activePlayer.playerId;
    target.appendChild(marked);
  },
  changeActivePlayer: function(){
    if(activePlayer.winner){
      return;
    }
      if(activePlayer == playerX){
        activePlayer = playerO;
      } else if(activePlayer == playerO){
        activePlayer = playerX;
      }
      activePlayer.display();
  },
  makeMove: function(event){
    var target = event.target;
    var targetId = event.target.id.toString();
    if(!$(target).hasClass('cell')){
      return;
    }
    if(!$(target).hasClass('picked')){
      turn.markCell(target);
      checkBoard(targetId);
      activePlayer.selectedCells.push(targetId);
      turn.changeActivePlayer();
    }
  },
  endGame: function(){
    namePlate.textContent = "Game Over: "+ activePlayer.name + " Won!";
    board.removeEventListener("click", turn.makeMove);
  }
}

function checkWin(array){
  if(array.length === 3){
    activePlayer.winner = true;
    turn.endGame();
    for(var i = 0; i < array.length; i++){
    var cell = document.getElementById(array[i]);
    cell.setAttribute("class", "won");
    }
  }
}

function checkBoard(targetId){
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

  for(var i = 0; i < activePlayer.selectedCells.length; i++){
    var selectedCell = activePlayer.selectedCells[i];
    var selectedColumn = parseInt(selectedCell.substring(0, 1));
    var selectedRow = parseInt(selectedCell.substring(2, 3));

    if (selectedRow === selectedColumn) {
      leftCross.push(selectedCell);
      checkWin(leftCross);
    }
    if(selectedRow + selectedColumn === 2){
      rightCross.push(selectedCell);
      checkWin(rightCross);
    }
    if(currentColumn === selectedColumn){
      winColumn.push(selectedCell);
      checkWin(winColumn)
    }
    if(currentRow === selectedRow){
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
  },
  startGame: function(){
    gameInit.playerName();
    activePlayer = playerX;
    activePlayer.display();
    board.addEventListener('click', turn.makeMove);
  }
}

gameInit.startGame();
