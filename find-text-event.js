var DEBUG = true;

function printIfDebug(message) {
    DEBUG && window.console && console.log(message);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (typeof tab.url !== "undefined" && (/.*?google.com.*?[#&\?]q=[^&]+/g).test(tab.url)) {
        printIfDebug("Processing url: " + tab.url);
        chrome.tabs.executeScript(tabId, {file:"on-search-page.js", runAt:"document_end"}, function() {
            if (chrome.runtime.lastError) {
                printIfDebug(chrome.runtime.lastError.message);
            } else {
                printIfDebug("Update script injected");
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        if (typeof message === "undefined") {
            printIfDebug("No message to find recieved from content script");
        } else if (typeof sender.tab === "undefined") {
            printIfDebug("Connection from content script not opened from Tab");
        } else if (typeof sender.tab.id === "undefined") {
            printIfDebug("Tab with content script has no ID");
        } else {
            // We have all the info we need validated
            //TODO: document idle vs document end?
            chrome.tabs.executeScript(sender.tab.id, {code:"window.find(\"hello\");", runAt:"document_end"}, function() {
                if (chrome.runtime.lastError) {
                    printIfDebug(chrome.runtime.lastError.message);
                } else {
                    printIfDebug("Script injected");
                }
            });
        }
    });