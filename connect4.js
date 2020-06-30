/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// Get elements on left hand side of game
const currentPlayerTurn = document.getElementById('current-player-turn');
const currentPlayerPiece = document.getElementById('current-player-piece');

// Create board in JS to track pieces. Board is an empty array that we are filling with arrays for each row in the gameboard and setting each value in each row to null, to be filled as the game progresses

function makeBoard() {
  for (let i=0; i<HEIGHT; i++){
    board.push([]);
    for (let k=0; k<WIDTH; k++){
      board[i].push(null);
    }
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');
  
  // Create the top row above the game board to indicate where to drop pieces and allow for clicks
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  
  // Create tds and add to top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create rows and tds for htmlBoard, assign each cell an ID
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    row.className = 'main-board';
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // Given x, check each value in the column starting from the bottom and return the first empty spot (null). If they're all full, return null
  for (let i=5; i>=0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Given two coordinates, select the td where the game piece will be placed
  let targetTd = document.getElementById(`${y}-${x}`);
  // Create game piece (div), assign it a class, give it initial top value, and append it to the target td
  let gamePiece = document.createElement('div');
  gamePiece.classList.add('piece');
  currPlayer === 1 ? gamePiece.classList.add('p1') : gamePiece.classList.add('p2');
  gamePiece.style.top = -95* (y + 1) + "px";
  targetTd.append(gamePiece);  
}

/** Funcntions for end of game messages*/

function endGameWin() {
  return alert(`Player ${currPlayer} won!`);
}
function endGameTie() {
  return alert(`Tie Game!`);
}
function gameOver() {
  return alert(`Game is over! Click New Game to play again.`);
}

// Create New Game button and add eventListener 
const newGameBtn = document.getElementById('new-game-button');
newGameBtn.addEventListener('click', resetGame);

// New Game -- Reset in-memory board
function resetBoard() {
  for (let i=0; i<HEIGHT; i++){
    for (let k=0; k<WIDTH; k++){
      board[i][k] = null;
    }
  }
  return board;
}

// New Game -- Reset html board
function resetHTMLBoard() {
  const rows = document.querySelectorAll('.main-board td');
  for (let row of rows) {
    row.innerHTML = '';
  }
  return 
}

// Function to reset game on button click
function resetGame(evt) {
  resetBoard();
  resetHTMLBoard();
  currPlayer = 1;
  currentPlayerTurn.innerText = `Player ${currPlayer} Turn`;
  currentPlayerPiece.className = 'p1';
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (checkForWin() || checkForTie()){
    setTimeout(gameOver, 550);
    return
  }

  else {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;
  
  
  // check for win
  if (checkForWin()) {
     setTimeout(endGameWin, 500);
     return
  }

  // check for tie
  if (checkForTie()) {
    setTimeout(endGameTie, 500);
    return
  }


  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer ++ : currPlayer --;
  currentPlayerTurn.innerText = `Player ${currPlayer} Turn`;
  currentPlayerPiece.classList.toggle('p1');
  currentPlayerPiece.classList.toggle('p2');
  } 
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForTie() {
  for (let y=0; y<HEIGHT; y++) {
    if (board[y].includes(null)) {
        return false;
      }
      else return true;
    
  }
}

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // Setting criteria for a win--make sure the x and y values are valid (within board size) and that they all belong to the same player, resulting in a win
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Loop through all values in matrix array gameboard
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Create variables that will check four values in each direction a player can win
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // If any of the created variables meet the criteria for a win, return true;
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
