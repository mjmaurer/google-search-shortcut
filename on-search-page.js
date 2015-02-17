// Sends message to the background script from the current tab
function sendMessageFromTab(message) {
    chrome.tabs.getCurrent(function(currentTab) {
        if (typeof currentTab === 'undefined') { 
            // currentTab is optional parameter
            myVariable = 'default';
        } else {
            // Send message with text to find
            // chrome.runtime.sendMessage({textToFind: message}, function(response) {});
        }
    });
}

//TODO sendMessage can send anything. Think about changing
document.body.innerHTML = document.body.innerHTML.replace(/<em>/g, '<em onclick=\"'
        + 'chrome.runtime.sendMessage({textToFind: \'hello\'}, function(response) {});\">');