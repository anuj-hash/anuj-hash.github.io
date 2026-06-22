import { db } from "./firebase-config.js";
import {
  ref,
  set,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* =========================
   GAME STATE
========================= */
let roomId = "";
let playerName = "";
let players = [];

let dice = 0;
let turn = 0;

/* 4 tokens per player (-1 = home) */
let tokens = {};

/* =========================
   LUDO MAIN PATH (52 cells)
========================= */
const PATH_LENGTH = 52;

/* Each player start offset */
const START_POS = [0, 13, 26, 39];

/* =========================
   CREATE BOARD UI (visual only)
========================= */
const board = document.getElementById("board");

for (let i = 0; i < PATH_LENGTH; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.setAttribute("data-index", i);
  board.appendChild(cell);
}

/* =========================
   ROOM GENERATION
========================= */
function generateRoom() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* =========================
   CREATE ROOM
========================= */
window.createRoom = async function () {
  playerName = document.getElementById("playerName").value;
  if (!playerName) return alert("Enter name");

  roomId = generateRoom();

  players = [playerName];

  tokens[playerName] = [-1, -1, -1, -1];

  await set(ref(db, "rooms/" + roomId), {
    players,
    turn: 0,
    dice: 0,
    tokens
  });

  enterGame();
};

/* =========================
   JOIN ROOM
========================= */
window.joinRoom = async function () {
  playerName = document.getElementById("playerName").value;
  roomId = document.getElementById("roomCode").value;

  if (!playerName || !roomId) return alert("Fill fields");

  const snap = await get(ref(db, "rooms/" + roomId));
  if (!snap.exists()) return alert("Room not found");

  const data = snap.val();

  players = data.players || [];
  tokens = data.tokens || {};

  if (!players.includes(playerName)) {
    players.push(playerName);
  }

  tokens[playerName] = [-1, -1, -1, -1];

  await update(ref(db, "rooms/" + roomId), {
    players,
    tokens
  });

  enterGame();
};

/* =========================
   ENTER GAME
========================= */
function enterGame() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  document.getElementById("roomText").innerText = roomId;

  listenRoom();
}

/* =========================
   REALTIME LISTENER
========================= */
function listenRoom() {
  onValue(ref(db, "rooms/" + roomId), (snap) => {
    const data = snap.val();
    if (!data) return;

    players = data.players || [];
    tokens = data.tokens || {};
    dice = data.dice || 0;
    turn = data.turn || 0;

    document.getElementById("dice").innerText = dice || "🎲";

    renderTokens();
  });
}

/* =========================
   ROLL DICE
========================= */
window.rollDice = async function () {
  const currentPlayer = players[turn];

  if (playerName !== currentPlayer) {
    alert("Not your turn");
    return;
  }

  const value = Math.floor(Math.random() * 6) + 1;

  await update(ref(db, "rooms/" + roomId), {
    dice: value
  });
};

/* =========================
   MOVE TOKEN (click board)
========================= */
board.addEventListener("click", async (e) => {
  if (!dice) return;

  const currentPlayer = players[turn];
  if (playerName !== currentPlayer) return;

  let t = tokens[playerName];

  /* find first movable token */
  for (let i = 0; i < 4; i++) {
    if (t[i] === -1) {
      t[i] = START_POS[players.indexOf(playerName)];
      break;
    } else {
      t[i] += dice;

      if (t[i] > PATH_LENGTH - 1) {
        t[i] = PATH_LENGTH - 1;
      }
      break;
    }
  }

  tokens[playerName] = t;

  await update(ref(db, "rooms/" + roomId), {
    tokens,
    turn: (turn + 1) % players.length,
    dice: 0
  });
});

/* =========================
   RENDER TOKENS
========================= */
function renderTokens() {
  document.querySelectorAll(".cell").forEach(c => c.innerHTML = "");

  const colors = ["red","blue","green","yellow","purple","orange","pink","cyan"];

  players.forEach((p, pi) => {
    tokens[p]?.forEach(pos => {
      if (pos >= 0 && pos < PATH_LENGTH) {
        const token = document.createElement("div");
        token.style.width = "10px";
        token.style.height = "10px";
        token.style.borderRadius = "50%";
        token.style.background = colors[pi % colors.length];
        token.style.display = "inline-block";
        token.style.margin = "1px";

        document.querySelector(`[data-index="${pos}"]`)?.appendChild(token);
      }
    });
  });
}
