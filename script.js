const board = document.getElementById("board");

/* 15x15 Ludo King style layout map */
const layout = [
  "red-home","red-home","red-home","red-home","red-home","","","","","","green-home","green-home","green-home","green-home","green-home",
  "red-home","red-home","red-home","red-home","red-home","","","","","","green-home","green-home","green-home","green-home","green-home",
  "red-home","red-home","red-home","red-home","red-home","","","","","","green-home","green-home","green-home","green-home","green-home",
  "red-home","red-home","red-home","red-home","red-home","","path","","path","","green-home","green-home","green-home","green-home","green-home",
  "","","","","","","path","center","path","","","","","","",
  "","","","","","","path","center","path","","","","","","",
  "yellow-home","yellow-home","yellow-home","yellow-home","yellow-home","","path","","path","","blue-home","blue-home","blue-home","blue-home","blue-home",
  "yellow-home","yellow-home","yellow-home","yellow-home","yellow-home","","path","","path","","blue-home","blue-home","blue-home","blue-home","blue-home",
  "yellow-home","yellow-home","yellow-home","yellow-home","yellow-home","","path","","path","","blue-home","blue-home","blue-home","blue-home","blue-home",
  "yellow-home","yellow-home","yellow-home","yellow-home","yellow-home","","","","","","blue-home","blue-home","blue-home","blue-home","blue-home",
  "","","","","","","","","","","","","","",""
];

layout.forEach(type => {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  if (type) {
    cell.classList.add(type);
  }

  board.appendChild(cell);
});
