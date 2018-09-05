document = 'answerpop.html';

var currentWord, currentTranslation;
var para = document.getElementById('show-word');


chrome.storage.sync.get(['data', 'quizAns'], function(items) {
	currentTranslation = items.quizAns;
	if(items.data == null) {
		para.innerHTML = 'Wait for your first notification.';
	}
	else {
		para.innerHTML = items.data;
		runLWB();
	}
	
});


function runLWB() {

	var userAns = document.createElement('input');
	userAns.setAttribute('type', 'text');
	userAns.setAttribute('name', 'insert');

	var answerDiv = document.getElementById('answer-box');
	answerDiv.appendChild(userAns);

	var submitAns = document.createElement('button');
	submitAns.setAttribute('type', 'button');
	submitAns.setAttribute('style', 'margin-left: 10px;')
	submitAns.innerHTML = 'Submit Answer';
	answerDiv.appendChild(submitAns);

	var alarmCancel = document.createElement('button');
	alarmCancel.setAttribute('type', 'button');
	alarmCancel.innerHTML = 'Cancel Alarm';
	answerDiv.appendChild(alarmCancel);

	var reset = document.createElement('button');
	reset.setAttribute('type', 'button');
	reset.innerHTML = 'Reset';
	answerDiv.appendChild(reset);

	if(alarmCancel) {
		alarmCancel.addEventListener('click', clearAlarms);
	}

	function clearAlarms() {
		chrome.alarms.clearAll();
		answerDiv.removeChild(alarmCancel);
	}

	if(reset) {
		reset.addEventListener('click', resetLWB);
	}

	function resetLWB() {
		chrome.storage.sync.clear();
		chrome.alarms.clearAll();
		chrome.browserAction.setPopup({popup: 'popup.html'});
		window.close();
	}

	if(submitAns) {
		submitAns.addEventListener('click', displayResult);
	}

	var ratio = document.createElement('p');
	answerDiv.appendChild(ratio);
	

	function displayResult() {
		
		if(userAns.value == currentTranslation) {
			alert('Correct Answer');
			window.close();
		}
		else {
			alert('Wrong Answer');
		}
	}

}
