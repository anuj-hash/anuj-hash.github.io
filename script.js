import { db } from "./firebase-config.js";
import {
  ref,
  set,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let roomId = "";
let playerName = "";

// generate room
function generateRoom() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// CREATE ROOM
window.createRoom = async function () {
  playerName = document.getElementById("playerName").value;

  if (!playerName) return alert("Enter name");

  roomId = generateRoom();

  await set(ref(db, "rooms/" + roomId), {
    players: {
      [playerName]: true
    },
    dice: 0,
    turn: playerName
  });

  enterGame(roomId);
};

// JOIN ROOM
window.joinRoom = async function () {
  playerName = document.getElementById("playerName").value;
  roomId = document.getElementById("roomCode").value;

  if (!playerName || !roomId) {
    return alert("Fill all fields");
  }

  const roomRef = ref(db, "rooms/" + roomId);
  const snap = await get(roomRef);

  if (!snap.exists()) return alert("Room not found");

  await update(roomRef, {
    ["players/" + playerName]: true
  });

  enterGame(roomId);
};

// ENTER GAME
function enterGame(room) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  document.getElementById("roomText").innerText = room;

  listenRoom(room);
}

// REALTIME LISTENER
function listenRoom(room) {
  onValue(ref(db, "rooms/" + room), (snap) => {
    const data = snap.val();
    if (!data) return;

    document.getElementById("dice").innerText = data.dice || "🎲";
  });
}

// ROLL DICE
window.rollDice = async function () {
  const num = Math.floor(Math.random() * 6) + 1;

  await update(ref(db, "rooms/" + roomId), {
    dice: num
  });
};

// BUILD BOARD
const board = document.getElementById("board");

for (let i = 0; i < 225; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
}
