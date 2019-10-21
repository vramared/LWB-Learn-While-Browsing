chrome.alarms.clearAll();
chrome.storage.sync.clear();

var numOfWords, words, translations, notifCounter;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    numOfWords = request.length;
    words = request.sendWords;
    translations = request.sendTransl;
    chrome.browserAction.setPopup({
        popup: 'answerpop.html'
    });
    notifCounter = 0;
});

var question = {
    type: "basic",
    title: "What does this word mean?",
    message: "",
    iconUrl: "images/icon.png",
};


chrome.alarms.onAlarm.addListener(function(alarms) {
    question.message = words[notifCounter];

    chrome.notifications.create(question);
    var showWord = 'What does ' + question.message + ' mean?';

    chrome.storage.sync.set({
        'data': showWord,
        'quizAns': translations[notifCounter]
    }, function() {
        console.log('Value is set to ' + showWord);
    });

    notifCounter++;
    if (notifCounter == numOfWords) {
        chrome.alarms.clear('learnAlarm');

    }
});