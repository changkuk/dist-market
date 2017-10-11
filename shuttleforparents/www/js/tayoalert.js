function closeAlert() {
    $("div").remove("div.tayoAlert");
}
function makeAlert(str) {
    var result = "<div class='tayoAlert' onclick='closeAlert()'><div class='alertContent'><table><tr><td>"+str+"</td></tr></table></div></div>"
    $("body").append(result);
}
