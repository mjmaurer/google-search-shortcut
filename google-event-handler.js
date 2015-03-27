var DEBUG = true;

function printIfDebug(message) {
    DEBUG && window.console && console.log(message);
}

// State variables
var newPageUrl = null;
var searchText = null;


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Checks if (tab is defined) and (new url) and (is a google search page)
    if (typeof tab.url !== "undefined" && changeInfo.status == "complete" && (/.*?google.com.*?[#&\?]q=[^&]+/g).test(tab.url)) {
        printIfDebug("Processing url: " + tab.url);
        chrome.tabs.executeScript(tabId, {file:"jquery-2.1.3.min.js", runAt:"document_end"}, function() {
            chrome.tabs.executeScript(tabId, {file: "on-search-page.js", runAt:"document_end"}, function() {
                if (chrome.runtime.lastError) {
                    printIfDebug(chrome.runtime.lastError.message);
                } else {
                    printIfDebug("Google page script injected");
                }
            });
        })
    } else if (newPageUrl == tab.url && changeInfo.status == "loading" && typeof tab.url !== "undefined") {
        // Next page is loading or in the process of loading
        //TODO: document idle vs document end?
        chrome.tabs.executeScript(tabId, {file:"jquery-2.1.3.min.js", runAt:"document_end"}, function() {
            chrome.tabs.executeScript(tabId, {code:"var searchText = \"" + searchText + "\";", runAt:"document_end"}, function() {
                chrome.tabs.executeScript(tabId, {file:"on-new-page.js", runAt:"document_end"}, function() {
                    newPageUrl = null;
                    searchText = null;
                    if (chrome.runtime.lastError) {
                        printIfDebug(chrome.runtime.lastError.message);
                    } else {
                        printIfDebug("New page script injected");
                    }
                });
            });
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
            newPageUrl = message.newUrl;
            searchText = message.message;
            searchText = searchText.replace(/[^a-zA-Z0-9]+$/, "");
            searchText = searchText.replace(/^[^a-zA-Z0-9]+/, "");
            sendResponse(null);
        }
    });