//TODO sendMessage can send anything. Think about changing

$('span.st').html(function(index, old) {
    return '<span class="querySeg">' + old.replace(/[\s\u00A0]\.\.\. ?/g, '</span> ... <span class="querySeg">') + '</span>';
});

$('span.querySeg').click(function(){
    chrome.runtime.sendMessage({textToFind: 'hello'}, function(response) {});
    window.location.href = $(this).closest('.g').find("a").attr("href");
    //alert(this.textContent);
    //alert($(this).closest('.g').find("a").attr("href"));
});