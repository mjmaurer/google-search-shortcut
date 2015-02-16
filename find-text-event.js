var DEBUG = true;

function printIfDebug(message) {
    DEBUG && window.console && console.log(message);
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        alert(6);
        if (typeof message === "undefined") {
            printIfDebug("No message to find recieved from content script");
        } else if (typeof tabs.Tab === "undefined") {
            printIfDebug("Connection from content script not opened from Tab");
        } else if (typeof tabs.Tab.id === "undefined") {
            printIfDebug("Tab with content script has no ID");
        } else {
            // We have all the info we need validated
            //TODO: document idle vs document end?
            chrome.tabs.executeScript(tabs.Tab.id, {code:"window.find(message);", runAt:"document_end"}, function() {
                printIfDebug("Find-script injected");
            });
        }
    });