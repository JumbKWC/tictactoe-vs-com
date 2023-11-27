const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const resetBtn = document.querySelector("#resetBtn");
const historyBtn = document.querySelector("#historyBtn");
const history = document.getElementById("history");
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let logs = [];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  resetBtn.addEventListener("click", restartGame);
  historyBtn.addEventListener("click", function () {
    history.classList.toggle("hidden");
  });
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");

  if (options[cellIndex] != "" || !running) {
    return;
  }

  updateCell(this, cellIndex);
  logs.push({ player: currentPlayer, position: cellIndex });
  //   console.log(logs);
  displayHistory();
  checkWinner();
  if (running === true) {
    computerMove();
  }
}

function computerMove() {
  let availableMoves = [];
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") {
      availableMoves.push(i);
    }
  }
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  const computerIndex = availableMoves[randomIndex];

  options[computerIndex] = currentPlayer;
  document.getElementsByClassName("cell")[computerIndex].innerText =
    currentPlayer;

  //   updateCell(this, randomIndex);
  logs.push({ player: currentPlayer, position: computerIndex });
  displayHistory();
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins`;
    running = false;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw !`;
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  logs = [];
  displayHistory();
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));
  running = true;
}

function displayHistory() {
  if (logs && logs.length > 0) {
    history.innerHTML = "<strong>History</strong><br>";
    logs.forEach((move, index) => {
      const { player, position } = move;
      const moveNumber = index + 1;
      history.innerHTML += `Move ${moveNumber}: Player ${player} at position ${position}<br>`;
    });
  } else {
    history.innerHTML = "";
  }
}
