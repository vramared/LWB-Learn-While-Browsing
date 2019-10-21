document = "popup.html"

var startLearningButton = document.getElementById("startLearning");
formDiv = document.getElementById('word-form');
var buttonsDiv = document.getElementById('buttons');
var win = document.getElementById("popup");

var newForm = document.createElement('form');
var addWordsButton = document.createElement('button');
var submitButton = document.createElement('button');

if (startLearningButton) {
    startLearningButton.addEventListener("click", createForm);
}

function createForm() {

    newForm.setAttribute('method', 'post');
    formDiv.appendChild(newForm);
    startLearningButton.parentNode.removeChild(startLearningButton);

    addWordsButton.setAttribute('type', 'button');
    addWordsButton.innerHTML = 'Add 5 translations';
    buttonsDiv.appendChild(addWordsButton);

    submitButton.setAttribute('type', 'submit');
    submitButton.innerHTML = 'Submit';
    buttonsDiv.appendChild(submitButton);

}

if (addWordsButton) {

    addWordsButton.addEventListener("click", addTranslations);
}

var placeCounter = 0; //variable to ensure placeholders only appear in the first row of the translations

function addTranslations() {

    var wordCounter = 0;

    while (wordCounter < 5) {
        var insertWord = document.createElement('input');
        var insertTranslation = document.createElement('input');

        insertWord.setAttribute('type', 'text');
        insertWord.setAttribute('name', 'insert');

        insertTranslation.setAttribute('type', 'text');
        insertTranslation.setAttribute('name', 'insert');

        if (placeCounter == 0) {
            insertWord.setAttribute('placeholder', 'Word');
            insertTranslation.setAttribute('placeholder', 'Translation');
            placeCounter++;
        }

        newForm.appendChild(insertWord);
        newForm.appendChild(insertTranslation);
        wordCounter++;
    }

}

if (submitButton) {

    submitButton.addEventListener("click", readInput);
}

var wordsArr = [];
var translationsArr = [];
var formLength;
var activateAlarm = document.createElement('button');

var alarmMessage = document.createElement('p');
var alarmDiv = document.getElementById('alarm');
alarmMessage.innerHTML = 'Enter how often you would like to be given a new word (in minutes).';

var inputFreq = document.createElement('input');
inputFreq.setAttribute('type', 'text');
inputFreq.setAttribute('name', 'insert');
inputFreq.setAttribute('id', 'input-freq');

var freq;

function readInput() {

    formLength = 0;

    var i;
    for (i = 0; i < newForm.length; i++) {
        if (newForm.elements[i].value != '') {
            if (((i + 1) % 2) == 0) {
                translationsArr.push(newForm.elements[i].value);
            } else {
                wordsArr.push(newForm.elements[i].value);
            }
            formLength++;
        }

    }



    var centerDiv = document.getElementById('centerDiv');
    if (formLength % 2 != 0) {
        alert('Please enter a translation for each new word which you want to learn.');
    } else if (formLength == 0) {
        alert('Please enter at least one translation to continue.');
    } else {
        formLength /= 2;
        console.log(formLength);

        centerDiv.removeChild(document.getElementById('word-form'));

        buttonsDiv.removeChild(addWordsButton);
        buttonsDiv.removeChild(submitButton);

        activateAlarm.setAttribute('type', 'button');
        activateAlarm.innerHTML = 'Activate Alarm';
        buttonsDiv.appendChild(activateAlarm);

        alarmDiv.appendChild(alarmMessage);
        alarmDiv.appendChild(inputFreq);

        chrome.runtime.sendMessage({
            length: formLength,
            sendWords: wordsArr,
            sendTransl: translationsArr
        });
    }

}


if (activateAlarm) {
    activateAlarm.addEventListener("click", beginAlarm);
}

var cancelAlarmButton = document.createElement('button');
cancelAlarmButton.setAttribute('type', 'button');
cancelAlarmButton.innerHTML = 'Cancel Alarm';


function beginAlarm() {
    freq = inputFreq.value;
    console.log(parseInt(freq));
    if (!parseInt(freq)) {
        alert('Please enter an integer.');
    } else if (freq < 1) {
        alert('The alarm frequency must be at least at 1 minute intervals.');
    } else {
        chrome.alarms.create('learnAlarm', {
            delayInMinutes: parseFloat(freq),
            periodInMinutes: parseFloat(freq)
        });

        buttonsDiv.removeChild(activateAlarm);
        buttonsDiv.appendChild(cancelAlarmButton);
    }

}

if (cancelAlarmButton) {
    cancelAlarmButton.addEventListener("click", cancelAlarm);
}

function cancelAlarm() {
    chrome.alarms.clear('learnAlarm');
}