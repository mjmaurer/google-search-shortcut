//TODO sendMessage can send anything. Think about changing

// TODO extra span of class ft appears
$('span.st').html(function(index, old) {
    return '<span class="querySeg">' + old.replace('...', '</span> ... <span class="querySeg">') + '</span>';
});

// /[\s\u00A0]\.\.\. ?/g

$('span.querySeg').click(function(){
    var url = $(this).closest('.g').find("a").attr("href");
    alert(url);
    //chrome.runtime.sendMessage(url, function(response) {});
    // window.location.href = $(this).closest('.g').find("a").attr("href");
    //alert(this.textContent);
    //alert($(this).closest('.g').find("a").attr("href"));
});