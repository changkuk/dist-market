
function changeStyle() {
    $(".btn").css("background-color", "#5473ff");
    $("input").attr("placeholder", "");
    $("input").css("color", "#333333");
}

function goLoginByButton() {
    var pin = $("#ex").val();
    if(pin == null || pin=="") {
        makeAlert('유효한 pin 번호를 입력해주세요.');
    } else {
        var root = 0;
        goLogin($("#ex").val(), root);
        
//        if(window.localStorage) {
//            window.localStorage.setItem("localpin", pin);
//            window.location.replace("tayoschedule.html?restart:false");
//        } else {
//            //이러면.... firebase 만 믿어야하는데..
//        }
        
    }
}

function goExperience() {
    window.location.replace("tayoschedule.html?restart:experience");
}
