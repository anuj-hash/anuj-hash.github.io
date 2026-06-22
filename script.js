const board = document.getElementById("board");
const diceEl = document.getElementById("dice");
const turnEl = document.getElementById("turn");

/* ======================
   GAME SETUP
====================== */

const colors = ["red","green","yellow","blue"];
let currentTurn = 0;
let dice = 0;

/* MAIN PATH (52 steps) */
const path = Array(52).fill(0);

/* TOKENS */
let tokens = {
  red: [-1,-1,-1,-1],
  green: [-1,-1,-1,-1],
  yellow: [-1,-1,-1,-1],
  blue: [-1,-1,-1,-1]
};

/* START POSITIONS */
const startPos = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

/* ======================
   BUILD BOARD
====================== */
for (let i = 0; i < 225; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  board.appendChild(cell);
}

/* ======================
   DICE ROLL
====================== */
window.rollDice = function () {
  dice = Math.floor(Math.random() * 6) + 1;
  diceEl.innerText = dice;

  alert("Click board to move token");
};

/* ======================
   MOVE TOKEN ON CLICK
====================== */
board.addEventListener("click", (e) => {
  if (!dice) return;

  const color = colors[currentTurn];

  let t = tokens[color];

  for (let i = 0; i < 4; i++) {
    if (t[i] === -1) {
      t[i] = startPos[color];
      break;
    } else {
      t[i] += dice;

      if (t[i] > 51) t[i] = 51;
      break;
    }
  }

  tokens[color] = t;

  render();

  nextTurn();
});

/* ======================
   NEXT TURN
====================== */
function nextTurn() {
  currentTurn = (currentTurn + 1) % 4;
  turnEl.innerText = "Turn: " + colors[currentTurn];
  dice = 0;
}

/* ======================
   RENDER TOKENS
====================== */
function render() {
  document.querySelectorAll(".cell").forEach(c => c.innerHTML = "");

  colors.forEach(color => {
    tokens[color].forEach(pos => {
      if (pos >= 0) {
        const token = document.createElement("div");
        token.classList.add("token");
        token.classList.add(color);

        document.querySelector(`[data-index="${pos}"]`)?.appendChild(token);
      }
    });
  });
}
