//TODO sendMessage can send anything. Think about changing

$("em").click(function(){
    var result = "";
    var current = this.previousSibling;
    while (current != null) {
        sep = current.textContent.split(" ... ");
        if (sep.length == 1) {
            result = sep[0] + result;
        } else {
            result = sep[sep.length-1] + result;
            break;
        }
        current = current.previousSibling;
    }
    result = result + this.textContent;
    current = this.nextSibling;
    while (current != null) {
        sep = current.textContent.split(/[\s\u00A0]... ?/);
        if (sep.length == 1) {
            result = result + sep[0];
        } else {
            result = result + sep[0];
            break;
        }
        current = current.nextSibling;
    }
    alert($(this).closest('.g').find("a").attr("href"));
});