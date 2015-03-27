function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function highlightInElement(text) {
    var elementHtml = document.body.innerHTML.replace(/\s+/gm," ");
    var tags = [];
    var tagLocations= [];
    var htmlTagRegEx = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/;

    //Strip the tags from the elementHtml and keep track of them
    var htmlTag;
    while(htmlTag = elementHtml.match(htmlTagRegEx)){
        tagLocations[tagLocations.length] = elementHtml.search(htmlTagRegEx);
        tags[tags.length] = htmlTag;
        elementHtml = elementHtml.replace(htmlTag, '');
    }

    //Search for the text in the stripped html
    var textLocation = elementHtml.indexOf(text);
    if(textLocation != -1){
        var newId = "scrollHerePhrase"

        // Search for an unused id up to 7 times
        for(var i=0; i < 7 && document.getElementById(newId); i++) {
            newId += makeId();
        }

        //Add the highlight
        var highlightHTMLStart = '<span id="' + newId + '" style="background-color: yellow;">';
        var highlightHTMLEnd = '</span>';
        elementHtml = elementHtml.replace(text, highlightHTMLStart + text + highlightHTMLEnd);

        //plug back in the HTML tags
        var textEndLocation = textLocation + text.length;
        for(i=tagLocations.length-1; i>=0; i--){
            var location = tagLocations[i];
            if(location > textEndLocation){
                location += highlightHTMLStart.length + highlightHTMLEnd.length;
            } else if(location > textLocation){
                location += highlightHTMLStart.length;
            }
            elementHtml = elementHtml.substring(0,location) + tags[i] + elementHtml.substring(location);
        }

        //Update the innerHTML of the element
        document.body.innerHTML = elementHtml;

        scrollHere = document.getElementById(newId);
        document.body.scrollTop = ($(scrollHere).offset().top - ($(window).height() - $(scrollHere).outerHeight(true)) / 2);
        document.body.scrollTop = document.documentElement.scrollTop = offset;
    } else {
        alert("Not found");
    }
}

highlightInElement(searchText);