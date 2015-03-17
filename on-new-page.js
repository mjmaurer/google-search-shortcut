var text = searchText;
var elementHtml = document.body.innerHTML;
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


// TODO: also replace and unreplace newlines
//Search for the text in the stripped html
var textLocation = elementHtml.search(text);
alert(4);
if(textLocation){
    //Add the highlight
    var highlightHTMLStart = '<span id="scrollHere" style="background-color: yellow;">';
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
}

//Update the innerHTML of the element
document.body.innerHTML = elementHtml;

scrollHere = document.getElementById("scrollHere");
document.body.scrollTop = ($(scrollHere).offset().top - ($(window).height() - $(scrollHere).outerHeight(true)) / 2);
document.body.scrollTop = document.documentElement.scrollTop = offset;
