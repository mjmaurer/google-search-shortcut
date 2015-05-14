//TODO sendMessage can send anything. Think about changing

// try window.load

// test webNavigation
// if it works for every new google search page:
// set onhashchange to setInterval for some amount of time
// and setTimeout for when to clear the interval

// TODO extra span of class ft appears

function escapeText(text) {
    return text.replace(/"/g, '\\\"').replace(/'/g, '\\\'').replace(/\//g, '\\\/');
}

// If these are defined, then we should clear them on a page update / hash change
if (typeof intervalUpdate !== 'undefined') {
    window.clearInterval(intervalUpdate);
}

if (typeof timeoutClear !== 'undefined') {
    window.clearTimeout(timeoutClear);
}

configureSearchPage = function() {
    if($('span.querySeg').length == 0) {
        $('span.st').html(function(index, old) {
            return '<span class="querySeg">' + old.replace(/(\s|&nbsp;|\.)+\.\.\.(\s|&nbsp;|\.)*/g, '</span> ... <span class="querySeg">') + '</span>';
        });

        $('span.querySeg').click(function(){
            var url = $(this).closest('.g').find("a").attr("href");
            var searchText = escapeText(this.textContent);
            chrome.runtime.sendMessage({newUrl:url, message:searchText}, function(response) {
                window.location.href = url;
            });
        });
    }
};

clearInterval = function() {
    window.clearInterval(intervalUpdate);
};

// Do it once initially
configureSearchPage();

var repeatTime = 200;
var numTimes = 20;

// TODO this is causing some error. See console
// Repeat configure for some number of times
var intervalUpdate = window.setInterval(configureSearchPage, repeatTime);
var timeoutClear = window.setTimeout(clearInterval, repeatTime * numTimes);