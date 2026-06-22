const board = document.getElementById("board");

// 15x15 Ludo layout (simplified but real look)
const layout = [
  "red","red","red","red","red","","","","","","green","green","green","green","green",
  "red","","","","","green","","","","","","green","","",
  "red","","","","","green","","","","","","green","","",
  "red","","","","","green","","","","","","green","","",
  "red","","","","","green","","center","","","","green","","",
  "","","","","","","","","","","","","","",
  "","","","","","","","","","","","","","",
  "","","","","","","","","","","","","","",
  "","","","","","","","","","","","","","",
  "","","","","","","","","","","","","","",
  "yellow","yellow","yellow","yellow","yellow","","","","","","blue","blue","blue","blue","blue",
  "yellow","","","","","blue","","","","","","blue","","",
  "yellow","","","","","blue","","","","","","blue","","",
  "yellow","","","","","blue","","","","","","blue","","",
  "yellow","yellow","yellow","yellow","yellow","","","","","","blue","blue","blue","blue","blue"
];

layout.forEach(type => {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  if (type) {
    if (type === "center") {
      cell.classList.add("center");
    } else {
      cell.classList.add(type + "-zone");
    }
  }

  board.appendChild(cell);
});
