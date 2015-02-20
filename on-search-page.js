//TODO sendMessage can send anything. Think about changing

// TODO extra span of class ft appears
$('span.st').html(function(index, old) {
    return '<span class="querySeg">' + old.replace(/(\s|&nbsp;|\.)+\.\.\.(\s|&nbsp;|\.)*/g, '</span> ... <span class="querySeg">') + '</span>';
});

$('span.querySeg').click(function(){
    var url = $(this).closest('.g').find("a").attr("href");
    chrome.runtime.sendMessage({newUrl:url, message:this.textContent}, function(response) {
        window.location.href = url;
    });
    // window.location.href = $(this).closest('.g').find("a").attr("href");
    //alert(this.textContent);
    //alert($(this).closest('.g').find("a").attr("href"));
});