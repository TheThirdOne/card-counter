const TURN_NUMBER = 2;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete" && document.getElementById("game-leaderboard") !== null) {
		clearInterval(readyStateCheckInterval);
		
		init();
		loopInterval = setInterval(loop, 100);
	}
	}, 100);
});


var loopInterval, turn;
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
    for(let i = 0; i < TURN_NUMBER; i++){
      row.appendChild(document.createElement('td'));
    }
  }
  prev.push(getScores());
  turn = document.querySelector("#turn-counter").innerText;
  
}

function loop(){
  if (turn === document.querySelector("#turn-counter").innerText) {
    return;
  }
  turn = document.querySelector("#turn-counter").innerText;
  
  console.log('Card counting for turn ' + turn);
  var scores = getScores();
  var last = prev[prev.length-1];
  prev.push(scores);
  var newColumns = new Map();
  for(let [color, {army, land}] of scores){
    let landChange = (prev.length > 5)?(land-prev[prev.length-5].get(color).land):1;
    newColumns.set(color, [army-last.get(color).army,landChange]);
  }
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
    row.children[5].textContent = values.get(color)[1];
  }
}




function end(){


  clearInterval(loopInterval);
}
