function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function replaceNode(textNode, newNode) {
    var pNode = textNode.parentNode;
    pNode.replaceChild(newNode, textNode);
    return pNode;
}

function createHighlightedSpan(text) {
    var e = document.createElement("span");
    e.style.backgroundColor = "#FDFF47";
    e.appendChild(document.createTextNode(text));
    return e;
}

function highlightTextNode(node) {
    console.log(node.textContent);
    var newNode = createHighlightedSpan(node.textContent);
    return replaceNode(node, newNode);
}

function scrollAndHighlight(textQueue) {
    var scrollHere = null;
    var amountHighlighted = 0;

    // Search for start in first next node
    firstText = textQueue[0].textContent;
    curLetterPos = firstText.indexOf(searchText[0]);
    while (curLetterPos != -1) {
        matchLength = firstText.substring(curLetterPos).length;
        console.log("curLetterPos: " + curLetterPos);
        console.log("first: " + firstText.substring(curLetterPos));
        console.log(searchText.substring(0, matchLength));
        if (matchLength <= searchText.length
                && firstText.substring(curLetterPos) === searchText.substring(0, matchLength)) {
            amountHighlighted += matchLength;
            scrollHere = highlightTextNode(textQueue[0].splitText(curLetterPos));
        } else {
            curLetterPos = firstText.indexOf(searchText[0], curLetterPos + 1);
        }
    }

    if (scrollHere == null) {
        // TODO remove this
        alert("We've got problems");
    }

    for (k = 1; k < textQueue.length - 1; k++) {
        amountHighlighted += textQueue[k].textContent.length;
        highlightTextNode(textQueue[k]);
    }

    var leftover = searchText.length - amountHighlighted;
    if (leftover <= 0) {
        alert("Weve got problems 2");
    }
    textQueue[textQueue.length - 1].splitText(leftover);
    highlightTextNode(textQueue[textQueue.length - 1]);

    document.body.scrollTop = ($(scrollHere).offset().top - ($(window).height() - $(scrollHere).outerHeight(true)) / 2);
}

// Always keep enought text nodes in state so that the pattern can fit ending with the first
// character of the last textnode. That way, boyer moore should run properly

//TODO if whole pattern doesnt work, try breaking up based on periods. Search 'asdf' for this edge case
//TODO test timings with and without this function
function recursiveSearch(element, text) {
    if (element.children.length == 0 && element.textContent && element.textContent.replace(/\s+/gm," ").indexOf(text) != -1) {
        return element;
    }
    for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        if (child.textContent && child.textContent.replace(/\s+/gm," ").indexOf(text) != -1) {
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

function chopAndEscape(someText) {
    return someText.replace(/(\s|&nbsp;|\.)*/g, '').replace(/('|’)/g, "'");
}

function walkTheDOM(node, state) {
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'HEAD') return false;
    if (state.searchResult) {
        scrollAndHighlight(state.searchResult.nodesToHighlight);
        return true;
    }
    processNode(node, state);
    node = node.firstChild;
    while (node) {
        if (walkTheDOM(node, state)) {
            return true;
        }
        node = node.nextSibling;
    }
    return false;
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
    //console.log(pattern);

    this.searchCompleted = false;

    // Queue of text from textNodes
    var textQueue = [];
    // Flattened textQueue, so we dont have to join() every time
    var textView = "";

    // J is position in pattern, I is position in DOM
    // fLP is absolute position of first letter in textQueue
    // How many textNodes' chars are currently buffered?
    var i = pattern.length - 1,
        j = pattern.length - 1,
        firstLetterPos = 0,
        bufferedLength = 0;

    getFromText = function(i) {
        return (i - firstLetterPos) < textView.length ? textView[i - firstLetterPos] : null;
    }

    // Utility for getting from boyer moore table (works for wildcard)
    getLast = function(letter) {
        return letter in lastTable ? lastTable[letter] : pattern.length;
    }

    updateTextView = function() {
        textView = textQueue.map(function(node) {
            return chopAndEscape(node.textContent);
        }).join("");
    }

    addToTextView = function(newText) {
        var toAdd = chopAndEscape(newText);
        textView += toAdd;
        return toAdd
    }

    //TODO add suffix rule to boyer-moore
    this.processTextNode = function(textNode) {
        textQueue.push(textNode);
        bufferedLength += addToTextView(textNode.textContent).length;

        //console.log("Pattern len: " + pattern.length + ". Buffer len: " + bufferedLength);
        //console.log(textView);
        if (bufferedLength >= pattern.length) {
            while (getFromText(i) != null) {
                //console.log("TextView: " + textView);
                //console.log("Context: " + textView.substring(i - firstLetterPos, textView.length));
                //console.log(String(i) + " in text: " + getFromText(i) + ". " + String(j) + " in pattern: " + pattern[j]);
                while (j >= 0 && pattern[j] == getFromText(i)) {
                    //console.log(String(i) + " in text: " + getFromText(i) + ". " + String(j) + " in pattern: " + pattern[j]);
                    j--;
                    i--;
                }
                if (j == -1) {
                    while (i - firstLetterPos >= 0 && textQueue.length > 1) {
                        var removed = textQueue.shift();
                        var remLen = chopAndEscape(removed.textContent).length;
                        firstLetterPos += remLen;
                        bufferedLength -= remLen;
                        //console.log("Removed: " + removed.textContent);
                    }
                    updateTextView();
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
                    i += Math.max(pattern.length - j, letOffset);
                    j = pattern.length - 1;
                }
            }
        }

        // Dequeue first node if no longer needed
        // Shift up firstLetterPos
        while (i - firstLetterPos >= pattern.length) {
            var removed = textQueue.shift();
            var remLen = chopAndEscape(removed.textContent).length;
            firstLetterPos += remLen;
            bufferedLength -= remLen;
            //console.log("Removed: " + removed.textContent);
        }
        updateTextView();

        return false;
    };
}


searchText = chopAndEscape(searchText);
console.log(searchText);
//var containingEle = recursiveSearch(document.body, searchText);
if (!walkTheDOM(document.body, new SearchState(searchText))) {
    alert("Nothing found on page");
}
// scrollHere = document.getElementById(newId);
// document.body.scrollTop = ($(scrollHere).offset().top - ($(window).height() - $(scrollHere).outerHeight(true)) / 2);
// document.body.scrollTop = document.documentElement.scrollTop = offset;