const TURN_NUMBER = 5;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete" && document.getElementById("game-page") !== null) {
		clearInterval(readyStateCheckInterval);
		init();
		loopInterval = setInterval(loop, 100);
	}
	}, 10);
});


var loopInterval, turn;
var prev = new Map();;

function init(){
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      // code for top stuff
      continue;
    }
    for(let i = 0; i < TURN_NUMBER; i++){
      row.appendChild(document.createElement('td'));
    }
  }
  prev = getScores();
  
}

function loop(){
  if (turn === document.querySelector("#turn-counter").innerText) {
    return;
  }
  turn = document.querySelector("#turn-counter").innerText;
  
  var scores = getScores();
  var newColumns = new Map();
  for(let [color, {army, land}] of scores){
    console.log(color,army,land);
    newColumns.set(color, [army-prev.get(color).army]);
  }
  prev = scores;
  setExtraColumns(newColumns);
}


function getScores(){
  var out = new Map();
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      continue;
    }
    let color = row.children[1].className.split(' ')[1];
    let army = +row.children[2].textContent;
    let land = +row.children[3].textContent;
    out.set(color,{army,land});
  }
  return out;
}


function setExtraColumns(values){
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      continue;
    }
    let color = row.children[1].className.split(' ')[1];
  
    row.children[4].textContent = values.get(color)[0];
  }
}




function end(){


  clearInterval(loopInterval);
}
