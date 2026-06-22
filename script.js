const board = document.getElementById("board");

// build board (15x15 = 225 cells)
for (let i = 0; i < 225; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
}

// generate room code
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// create room
function createRoom() {
  const name = document.getElementById("playerName").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  const room = generateCode();
  startGame(room);
}

// join room
function joinRoom() {
  const room = document.getElementById("roomCode").value;

  if (!room) {
    alert("Enter room code");
    return;
  }

  startGame(room);
}

// start game screen
function startGame(room) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  document.getElementById("roomText").innerText = room;
}

// dice roll
function rollDice() {
  const num = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice").innerText = num;
}
