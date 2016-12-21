const EXTRA_COLUMNS = 3;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete" && document.getElementById("game-leaderboard") !== null) {
		clearInterval(readyStateCheckInterval);
		init();
		loopInterval = setInterval(loop, 100);
	}
	}, 100);
});

var loopInterval, turn, prevTurn, cityEstimates, previousArmyChanges;
var prev = [];

function init(){
  console.log('Initializing card counting');
  var rows = document.getElementById("game-leaderboard").children[0].children;
  previousArmyChanges = new Map();
  cityEstimates = new Map();
  for(let row of rows){
    let name = row.children[1].textContent;
    
    for(let i = 0; i < EXTRA_COLUMNS; i++){
      row.appendChild(document.createElement('td'));
    }
    if(name === "Player"){
      row.children[4].textContent = "Army change";
      row.children[5].textContent = "Land change";
      row.children[6].textContent = "Cities?";
      continue;
    }
    let color = row.children[1].className.split(' ')[1];
    previousArmyChanges.set(color,[1,1,1,1,1]);
    cityEstimates.set(color,1);
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
  var temp = new Map();
  for(let [color, {army, land}] of scores){
    try{
      let landChange = land-last.get(color).land;
      let armyChange = army-last.get(color).army;
      if(turn%25 === 0){
        armyChange-=land;
      }
      temp.set(color,[armyChange,landChange]);
    }catch(e){
      console.log(prev,last,e);
    }
  }
      
  for(let [color, [armyC, landC]] of temp){
    try{
      let raw = armyC;
      if(landC !== 0){
        for(let [color2, [armyC2, landC2]] of temp){
          if(color === color2){
            continue;
          }
          if(landC2 !== -landC){
            continue;
          }
          if(Math.abs((armyC-cityEstimates.get(color))-(armyC2-cityEstimates.get(color2)) < 3)){
            console.log(armyC-cityEstimates.get(color),armyC2-cityEstimates.get(color2), 'estimating that it has ', armyC-(armyC2-cityEstimates.get(color2)), 'production');
            armyC = armyC-(armyC2-cityEstimates.get(color2));
            break;
          }
        }
      }
      let previous = previousArmyChanges.get(color);
      previous.pop();
      previous.unshift(armyC);
      let cities= mode(previous);
      cityEstimates.set(color,mode(previous));
      newColumns.set(color, [raw,landC,cities]);
    }catch(e){
      newColumns.set(color, [0,0,0]);
      console.log(prev,last,e);
    }
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

function mode(arr){
  var hist = {};
  for(let i = 0; i < arr.length; i++){
    hist[arr[i]] = (hist[arr[i]]||0)+1;
  }
  var max = hist[arr[0]], k = 0;
  for(let i = 1; i < arr.length; i++){
    if(hist[arr[i]] > max){
      max = hist[arr[i]];
      k = i;
    }
  }
  return arr[k];
}
function mean(arr){
  return ''+arr.reduce((a,b)=>a+b,0)+'/'+arr.length;
}
function median(arr){
  return [...arr].sort((a,b)=>b-a)[5];
}