chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete" && document.getElementById("game-page") !== null) {
		clearInterval(readyStateCheckInterval);
		init();
		loopInterval = setInterval(loop, 100);
	}
	}, 10);
});


var loopInterval;
function init(){
  // ----------------------------------------------------------
	// This part of the script triggers when page is done loading and the game starts
	console.log("Hello. This message was sent from scripts/inject.js");
	// ----------------------------------------------------------

  
}

function loop(){
  
  console.log("test");
}



function end(){
  
  
  clearInterval(loopInterval);
}