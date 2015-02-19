//TODO sendMessage can send anything. Think about changing

$('span.st').html(function(index, old) {
    return '<span class="querySeg">' + old.replace('...', '</span>...<span class="querySeg">') + '</span>';
});

$('span.querySeg').click(function(){
    alert(this.textContent);
    alert($(this).closest('.g').find("a").attr("href"));
});