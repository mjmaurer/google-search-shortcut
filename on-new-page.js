function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function scrollAndHighlight(textQueue) {

}

// Always keep enought text nodes in state so that the pattern can fit ending with the first
// character of the last textnode. That way, boyer moore should run properly

//TODO if whole pattern doesnt work, try breaking up based on periods. Search 'asdf' for this edge case
//TODO test timings with and without this function
function recursiveSearch(element, text) {
    if (element.children.length == 0 && element.textContent !== undefined && element.textContent.replace(/\s+/gm," ").indexOf(text) != -1) {
        return element;
    }
    for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        if (child.textContent !== undefined && child.textContent.replace(/\s+/gm," ").indexOf(text) != -1) {
            return recursiveSearch(child, text) || child;
        }
    }
    return false;
}

function processNode(node, state) {
    if (node.nodeType === 3 && node.textContent !== undefined && node.textContent.trim().length > 0) {
        var text = node.textContent;
        if (state.processTextNode(node)) {
            console.log("FOUND IT");
        }
    }
}

function walkTheDOM(node, state) {
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'HEAD') return false;
    if (state.searchResult) {
        scrollAndHighlight(state.searchResult.nodesToHighlight);
        return;
    }
    processNode(node, state);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, state);
        node = node.nextSibling;
    }
}

function SearchState(pattern) {

    // Build boyer-moore table
    buildLastTable = function() {
        lastTable = [];
        alphabet = new Set(pattern);
        alphabet.forEach(function(letter) {
            lastTable[letter] = Math.max(pattern.length - pattern.lastIndexOf(letter) - 1, 1);
        });
        return lastTable;
    };

    var lastTable = buildLastTable();
    console.log(pattern);

    this.searchCompleted = false;

    // Queue of text from textNodes
    var textQueue = [];
    // Flattened textQueue, so we dont have to join() every time
    var textView = "";

    // How many textNodes' chars are currently buffered?
    var bufferedLength = 0;

    // J is position in pattern, I is position in DOM
    // fLP is absolute position of first letter in textQueue
    var i = pattern.length - 1,
        j = pattern.length - 1,
        firstLetterPos = 0;

    getFromText = function(i) {
        return (i - firstLetterPos) < textView.length ? textView[i - firstLetterPos] : null;
    }

    // Utility for getting from boyer moore table (works for wildcard)
    getLast = function(letter) {
        return letter in lastTable ? lastTable[letter] : pattern.length;
    }

    updateTextView = function() {
        textView = textQueue.map(function(node) {
            return node.textContent;
        }).join("");
    }

    //TODO add suffix rule to boyer-moore
    this.processTextNode = function(textNode) {
        textQueue.push(textNode);
        updateTextView();
        bufferedLength += textNode.textContent.length;

        if (bufferedLength >= pattern.length) {
            while (getFromText(i) != null) {
                console.log("TextView: " + textView);
                console.log(String(i) + " in text: " + getFromText(i) + ". " + String(j) + " in pattern: " + pattern[j]);
                console.log("Context: " + textView.substring(i - firstLetterPos, textView.length));
                while (j >= 0 && pattern[j] == getFromText(i)) {
                    j--;
                    i--;
                } 
                if (j == -1) {
                    this.searchResult = {
                        nodesToHighlight : textQueue,
                        firstPos : i - firstLetterPos + 1,
                    };
                    return true;
                } else {
                    var letOffset = getLast(getFromText(i));
                    // The max is needed for the case where
                    // the shift actually causes us to compare things weve
                    // already compared
                    i += Math.min(j, Math.max(pattern.length - j, letOffset));
                    j = pattern.length - 1;
                }
            }
        }

        // Dequeue first node if no longer needed
        // Shift up firstLetterPos
        if (bufferedLength - textQueue[0].length >= pattern.length) {
            var removed = textQueue.shift();
            firstLetterPos += removed.length;
            bufferedLength -= removed.length;
            updateTextView();
        }

        return false;
    };
}

var containingEle = recursiveSearch(document.body, searchText);
if (false) {
    alert("Nothing found on page");
} else {
    walkTheDOM(document.body, new SearchState(searchText));
}
// scrollHere = document.getElementById(newId);
// document.body.scrollTop = ($(scrollHere).offset().top - ($(window).height() - $(scrollHere).outerHeight(true)) / 2);
// document.body.scrollTop = document.documentElement.scrollTop = offset;