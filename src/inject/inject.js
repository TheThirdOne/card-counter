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
var prev = {};

function init(){
  // ----------------------------------------------------------
	// This part of the script triggers when page is done loading and the game starts
	console.log("Hello. This message was sent from scripts/inject.js");
	// ----------------------------------------------------------


}

function loop(){
  var rows = document.getElementById("game-leaderboard").children[0].children;
  if (turn === document.querySelector("#turn-counter").innerText) {
    return;
  }
  turn = document.querySelector("#turn-counter").innerText;
  for(let row of rows){
    let name = row.children[1].textContent;
    if(name === "Player"){
      continue;
    }
    let army = +row.children[2].textContent;
    let color = row.children[1].className.split(' ')[1];
    let prevArmy = prev[color] || 0;

    prev[color] = army;

    td = document.createElement('td');
    msg = document.createTextNode(army - prevArmy);
    row.appendChild(td);
    td.appendChild(msg);
    if (row.children.length > 4 + TURN_NUMBER) {
      row.removeChild(row.children[4]);
    }
  }
}



function end(){


  clearInterval(loopInterval);
}
