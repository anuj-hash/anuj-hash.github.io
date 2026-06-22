import { db } from "./firebase-config.js";
import {
  ref,
  set,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ---------------------------
   GAME STATE
----------------------------*/
let roomId = "";
let playerName = "";
let players = [];
let currentTurnIndex = 0;
let diceValue = 0;

/* ---------------------------
   LUDO PATH (simplified loop track)
----------------------------*/
const path = Array(52).fill(0).map((_, i) => i);

/* ---------------------------
   TOKENS (each player 4 tokens)
----------------------------*/
let tokens = {};

/* ---------------------------
   CREATE BOARD UI
----------------------------*/
const board = document.getElementById("board");

for (let i = 0; i < 225; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
}

/* ---------------------------
   ROOM GENERATION
----------------------------*/
function generateRoom() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* ---------------------------
   CREATE ROOM
----------------------------*/
window.createRoom = async function () {
  playerName = document.getElementById("playerName").value;
  if (!playerName) return alert("Enter name");

  roomId = generateRoom();

  tokens[playerName] = [0, 0, 0, 0]; // 4 tokens

  await set(ref(db, "rooms/" + roomId), {
    players: [playerName],
    turn: 0,
    dice: 0,
    tokens: {
      [playerName]: [0, 0, 0, 0]
    }
  });

  enterGame();
};

/* ---------------------------
   JOIN ROOM
----------------------------*/
window.joinRoom = async function () {
  playerName = document.getElementById("playerName").value;
  roomId = document.getElementById("roomCode").value;

  if (!playerName || !roomId) return alert("Fill all fields");

  const roomRef = ref(db, "rooms/" + roomId);
  const snap = await get(roomRef);

  if (!snap.exists()) return alert("Room not found");

  let data = snap.val();

  players = data.players;

  if (!players.includes(playerName)) {
    players.push(playerName);
  }

  tokens[playerName] = [0, 0, 0, 0];

  await update(roomRef, {
    players: players,
    ["tokens/" + playerName]: [0, 0, 0, 0]
  });

  enterGame();
};

/* ---------------------------
   ENTER GAME
----------------------------*/
function enterGame() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("roomText").innerText = roomId;

  listenRoom();
}

/* ---------------------------
   REALTIME LISTENER
----------------------------*/
function listenRoom() {
  onValue(ref(db, "rooms/" + roomId), (snap) => {
    const data = snap.val();
    if (!data) return;

    players = data.players || [];
    diceValue = data.dice || 0;
    currentTurnIndex = data.turn || 0;
    tokens = data.tokens || {};

    document.getElementById("dice").innerText =
      diceValue ? diceValue : "🎲";

    renderTokens();
  });
}

/* ---------------------------
   ROLL DICE
----------------------------*/
window.rollDice = async function () {
  const currentPlayer = players[currentTurnIndex];

  if (playerName !== currentPlayer) {
    alert("Not your turn!");
    return;
  }

  const dice = Math.floor(Math.random() * 6) + 1;

  await update(ref(db, "rooms/" + roomId), {
    dice: dice
  });
};

/* ---------------------------
   MOVE TOKEN
   (click board cell to move)
----------------------------*/
board.addEventListener("click", async (e) => {
  const currentPlayer = players[currentTurnIndex];

  if (playerName !== currentPlayer) return;

  if (!diceValue) return;

  let t = tokens[playerName];

  // move first token (simple rule)
  t[0] += diceValue;

  if (t[0] > 51) t[0] = 51;

  tokens[playerName] = t;

  await update(ref(db, "rooms/" + roomId), {
    tokens: tokens,
    turn: (currentTurnIndex + 1) % players.length,
    dice: 0
  });
});

/* ---------------------------
   RENDER TOKENS ON BOARD
----------------------------*/
function renderTokens() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach(c => (c.innerHTML = ""));

  let index = 0;

  for (let p in tokens) {
    tokens[p].forEach(t => {
      if (cells[t]) {
        const dot = document.createElement("div");
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.borderRadius = "50%";
        dot.style.background = "red";
        dot.style.margin = "2px";
        cells[t].appendChild(dot);
      }
    });

    index++;
  }
}
