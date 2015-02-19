//TODO sendMessage can send anything. Think about changing

var searchTerms = document.getElementsByTagName("em");

var findAndSend = function(element) {
    
    // var result = "";
    // var current = element.previousSibling;
    // while (current != null) {
    //     sep = current.textContent.split(" ... ");
    //     if (sep.length == 1) {
    //         result = sep[0] + result;
    //     } else {
    //         result = sep[sep.length-1] + result;
    //         break;
    //     }
    //     current = current.previousSibling;
    // }
    // result = result + element.textContent;
    // current = element.nextSibling;
    // while (current != null) {
    //     sep = current.textContent.split(/[\s\u00A0]... ?/);
    //     if (sep.length == 1) {
    //         result = result + sep[0];
    //     } else {
    //         result = result + sep[0];
    //         break;
    //     }
    //     current = current.nextSibling;
    // }
    alert(result);
}


// Change this to jquery
for(i=0; i < searchTerms.length; i++) {
    searchTerms.item(i).setAttribute("onclick", "(" + findAndSend.toString() + ")(this)");
}