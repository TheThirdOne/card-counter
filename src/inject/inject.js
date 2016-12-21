const EXTRA_COLUMNS = 2;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete" && document.getElementById("game-leaderboard") !== null) {
		clearInterval(readyStateCheckInterval);
		init();
		loopInterval = setInterval(loop, 100);
	}
	}, 100);
});

var loopInterval, turn, prevTurn;
var prev = [];

function init(){
  console.log('Initializing card counting');
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      row.appendChild(document.createElement('td'));
      row.appendChild(document.createElement('td'));
      row.children[4].textContent = "Army change";
      row.children[5].textContent = "Land change";
      continue;
    }
    for(let i = 0; i < EXTRA_COLUMNS; i++){
      row.appendChild(document.createElement('td'));
    }
  }
  prev.push(getScores());
}

function loop(){
  turn = +document.querySelector("#turn-counter").innerText.split(' ')[1];
  if (turn === prevTurn || turn < 2) {
    return;
  }

  console.log('Card counting for turn ' + turn);
  var scores = getScores();
  var last = prev[prev.length-1];
  prev.push(scores);
  var newColumns = new Map();
  for(let [color, {army, land}] of scores){
    let landChange = (prev.length > 5)?(land-prev[prev.length-5].get(color).land):1;
    let armyChange = army-last.get(color).army;
    newColumns.set(color, [armyChange,landChange]);
  }
  prevTurn = turn;
  setExtraColumns(newColumns);
}

// Reads the scores from the scoreboard
//  outputs a map from color to {army,land}
function getScores(){
  var out = new Map();
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      continue;
    }
    let color = row.children[1].className.split(' ')[1];
    let army = +row.children[2].textContent; // The + is used to convert to a number
    let land = +row.children[3].textContent;
    out.set(color,{army,land});
  }
  return out;
}

// Sets the additional columns
//  Values is a map from color to [column 1, column 2, ...]
function setExtraColumns(values){
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      continue;
    }
    let color = row.children[1].className.split(' ')[1];
    for(let i = 0; i < EXTRA_COLUMNS; i++){
      row.children[4+i].textContent = values.get(color)[i];
    }
  }
}

function end(){
  clearInterval(loopInterval);
}
