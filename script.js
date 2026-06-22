
/* =========================
   GAME STATE
========================= */
const board = document.getElementById("board");
const diceEl = document.getElementById("dice");
const turnEl = document.getElementById("turn");

const players = ["red","green","yellow","blue"];
let turn = 0;
let dice = 0;

/* 52-step Ludo loop */
const PATH = Array(52).fill(0);

/* token positions (-1 = home) */
let tokens = {
  red: [-1,-1,-1,-1],
  green: [-1,-1,-1,-1],
  yellow: [-1,-1,-1,-1],
  blue: [-1,-1,-1,-1]
};

/* start offsets */
const START = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

/* =========================
   BUILD BOARD
========================= */
for (let i = 0; i < 225; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.index = i;
  board.appendChild(cell);
}

/* =========================
   ROLL DICE
========================= */
window.rollDice = function () {
  dice = Math.floor(Math.random() * 6) + 1;
  diceEl.innerText = dice;
};

/* =========================
   MOVE TOKEN (mobile style tap)
========================= */
board.addEventListener("click", () => {
  if (!dice) return;

  const color = players[turn];

  let t = tokens[color];

  // find token to move
  for (let i = 0; i < 4; i++) {
    if (t[i] === -1) {
      t[i] = START[color];
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

/* =========================
   TURN SYSTEM
========================= */
function nextTurn() {
  turn = (turn + 1) % players.length;
  turnEl.innerText = "Turn: " + players[turn];
  dice = 0;
  diceEl.innerText = "0";
}

/* =========================
   RENDER TOKENS
========================= */
function render() {
  document.querySelectorAll(".cell").forEach(c => c.innerHTML = "");

  players.forEach(color => {
    tokens[color].forEach(pos => {
      if (pos >= 0) {
        const t = document.createElement("div");
        t.className = "token " + color;

        document.querySelector(`[data-index="${pos}"]`)
        ?.appendChild(t);
      }
    });
  });
}

/* first render */
render();
