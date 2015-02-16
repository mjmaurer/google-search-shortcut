function sendMessage(p1, p2) {
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {});
}

document.body.innerHTML = document.body.innerHTML.replace(/<em>/g, '<em onclick=send-word.js>');