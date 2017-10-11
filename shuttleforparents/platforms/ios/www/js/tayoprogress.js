function progressStop() {
    //    alert("STOP progressStop :: id :"+progressId);
    if(progressId) {
        clearInterval(progressId);
        progressId = null;
    }
    $("div").remove("div.progressModal");
}

var progressId = null;
function progressStart() {
    var result = "<div class='progressModal'><div class='progressContent'><p>셔틀타요를 시작합니다.<br/>잠시만 기다리세요.</p><div class='loadingimg'><img class='loadingimg' src='img/loading.png' srcset='img/loading@2x.png 2x, img/loading@3x.png 3x'></img></div></div></div>"
    $("body").append(result);
    progressId = setInterval(frame, 400);
    function frame() {
        if ($("div.loadingimg").offset().left > $("div.progressContent").width()-82) {
            $("div.loadingimg").css("left", $("div.progressContent").offset().left);
        } else {
            $("div.loadingimg").css("left", $("div.loadingimg").offset().left + 1);
        }
    }
}
