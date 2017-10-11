var temp = null;
var data = null;
var inventory = null;
var schedule = null;
var carnum = null;
var istoday = null;
var personid = null;
var childname = null;
var curday = null;
var phonenum = null;
var in_sid = null;

var inventory2 = null;
var schedule2 = null;
var carnum2 = null;
var phone1 = null;
var phone2 = null;

var secondLoad = false; // 하원안타요 유도후. 계속, 두번째 로딩값들을 유지하기 위해서

// 학원안가요. 이번버전에서 빠짐
//var notgoingbtn_on = true;
var skipbtn_on = true;
var callbtn_on = true;
var m_timer = null; // 1분마다 페이지 다시 로딩
var m_timerInterval = 60000; // 1분마다 페이지 다시 로딩
var m_waitingTime = null;//getRealTime 몇분 남았는지...

$(document).ready(function(){
    $("body").bind('touchmove', function(e){e.preventDefault()}); //스크롤방지
                  
    temp = location.href.split("?");
    data = temp[1].split("&");
    inventory = data[0].split(":");
                  
    if(inventory[1] == "experience") {
        skipbtn_on = false;
        $("#skipbtn").attr("src", "img/skipbus-dim.png");
        $("#skipbtn").attr("srcset", "img/skipbus-dim@2x.png 2x, img/skipbus-dim@3x.png");
        callbtn_on = false;
        $("#callbtn").attr("src", "img/calldriver-dim.png");
        $("#callbtn").attr("srcset", "img/calldriver-dim@2x.png 2x, img/calldriver-dim@3x.png");
        getRealtime();
        getRouteMap();
        makeSibButton();
        $(".text_in_box_div").text("셔틀타요");
        $("#realheader").text("셔틀타요");
        return;
    }

    schedule = data[1].split(":");
    carnum = data[2].split(":");
    istoday = data[3].split(":");
    personid = data[4].split(":");
    childname = data[5].split(":");
    curday = data[6].split(":");
    phonenum = phone1 = data[7].split(":");
    in_sid = data[8].split(":");
                  
    if(data.length > 9) {
        inventory2 = data[9].split(":");
        schedule2 = data[10].split(":");
        carnum2 = data[11].split(":");
        phone2 = data[12].split(":");
    }

    getLoadInfo(schedule);
    getRealtime(inventory);
    getRouteMap(inventory);
    makeSibButton();
    $(".text_in_box_div").text(carnum[1]+"호차");
    $("#realheader").text(carnum[1]+"호차");

    $("#skipbtn").attr("src", "img/skipbus.png");
    $("#skipbtn").attr("srcset", "img/skipbus@2x.png 2x, img/skipbus@3x.png");
// 학원안가요. 이번버전에서 빠짐
//    $("#notgoingbtn").attr("src", "img/not_going.png");
//    $("#notgoingbtn").attr("srcset", "img/not_going@2x.png 2x, img/not_going@3x.png");

    if (istoday[1] == "true") { //오늘
        $("#callbtn").attr("src", "img/calldriver.png");
        $("#callbtn").attr("srcset", "img/calldriver@2x.png 2x, img/calldriver@3x.png");
        $("#callbtn").attr("onclick", "onCallbtn()");
//        $(".caller").attr("href", "tel:"+phonenum[1]);
    } else { //오늘외
        callbtn_on = false;
        $("#callbtn").attr("src", "img/calldriver-dim.png");
        $("#callbtn").attr("srcset", "img/calldriver-dim@2x.png 2x, img/calldriver-dim@3x.png");
    }
});

function closeModal() {
    $(".pinModal").hide();
}
function goToComingSchedule() {
    $(".pinModal").hide();
    secondLoad = true;
    getLoadInfo(schedule2);
    FINISH_ROUTE = false;
    FINISH_REALTIME = false;
    getRealtime(inventory2);
    $("table.route tr").remove();
    getRouteMap(inventory2);
    $(".text_in_box_div").text(carnum2[1]+"호차");
    $("#realheader").text(carnum2[1]+"호차");
    
    $("#skipbtn").attr("src", "img/skipbus.png");
    $("#skipbtn").attr("srcset", "img/skipbus@2x.png 2x, img/skipbus@3x.png");
    if (istoday[1] == "true") { //오늘
        $("#callbtn").attr("src", "img/calldriver.png");
        $("#callbtn").attr("srcset", "img/calldriver@2x.png 2x, img/calldriver@3x.png");
        $("#callbtn").attr("onclick", "onCallbtn()");
        phonenum = phone2;
    } else { //오늘외
        callbtn_on = false;
        $("#callbtn").attr("src", "img/calldriver-dim.png");
        $("#callbtn").attr("srcset", "img/calldriver-dim@2x.png 2x, img/calldriver-dim@3x.png");
    }
}
function onReloadTimer() {
    if(secondLoad == false)
        getRealtime(inventory);
    else
        getRealtime(inventory2);
    
    if(m_waitingTime != null)
    pageReMake();
}

function pageReMake() {
//    if(cur_ret_code == 202) { //출발전입니다. 오늘 ~ 출발지 출발직전까지,
//        beforeStart();
//    } else
    if(cur_ret_code == 200) { // 서버로부터 승차지점 00분전부터 옴.
        $(".getontime").show();
        beforeSevenMin();
    } else if(cur_ret_code == 201) { // 승차 ~ 도착지 도착시점까지,
        $(".getontime").hide();
        leaveShuttle();
        clearInterval(m_timer);
        m_timer = null;
    }
}

function onSkipbusbtn() {
    if(inventory[1] == "experience") {
        return;
    }
    var canChange = true; //오늘인지 아닌지
    var today = new Date();
    switch(today.getDay()) {
        case 0:
            if(curday[1] == "sun")
                canChange = false;
            break;
        case 1:
            if(curday[1] == "mon")
                canChange = false;
            break;
        case 2:
            if(curday[1] == "tue")
                canChange = false;
            break;
        case 3:
            if(curday[1] == "wed")
                canChange = false;
            break;
        case 4:
            if(curday[1] == "thu")
                canChange = false;
            break;
        case 5:
            if(curday[1] == "fri")
                canChange = false;
            break;
        case 6:
            if(curday[1] == "sat")
                canChange = false;
            break;
    }
    if(false == skipbtn_on && false == canChange) {
        makeAlert('당일은 변경할 수가 없습니다.');
    }
    if(canChange || true == skipbtn_on) {
        if(secondLoad == true)//하원차량
            var l_scheduleid = schedule2;
        else
            var l_scheduleid = schedule;
        
        // 서버에 알려줘야겠지.
        // 앞으로 계속 비활성화 되어야하니까.... 어딘가 저장을 해야겠지...
        $.ajax({url:"https://api.edticket.com/api/todayLoad",
               method: "POST",
//               data: $.param({sid:parseInt(in_sid[1]), scheduletable_id:parseInt(schedule[1])}),
               data: $.param({scheduletable_id:l_scheduleid[1], sid:in_sid[1]}),
               success:function(result, status, xhr){
               var ret = JSON.parse(xhr.responseText);
//               alert(ret.code +":"+ret.msg);
               if(200 == ret.code) {//if(false == skipbtn_on) {
                    skipbtn_on = true;
                    $("#skipbtn").attr("src", "img/skipbus.png");
                    $("#skipbtn").attr("srcset", "img/skipbus@2x.png 2x, img/skipbus@3x.png");
               } else if(201 == ret.code) { //} else {
                    skipbtn_on = false;
                    $("#skipbtn").attr("src", "img/skipbus-dim.png");
                    $("#skipbtn").attr("srcset", "img/skipbus-dim@2x.png 2x, img/skipbus-dim@3x.png");
               }
               // 관련된 하원스케쥴이 있으면 modal 띄워줘.
               },
               error:function(status, err) {
                    makeAlert('스케쥴 정보가 존재하지 않습니다.');
               }
               });
        if(inventory2 && secondLoad == false)
            $(".pinModal").show();
    }
}

function getLoadInfo(scheduleid) {
    mURL ="https://api.edticket.com/api/checkLoadState?sid="+in_sid[1]+"&scheduletable_id="+scheduleid[1];
    $.ajax({url:mURL, success:function(result, status, xhr){
           var ret = JSON.parse(xhr.responseText);
           if(ret.code == 200) {
                skipbtn_on = true;
                $("#skipbtn").attr("src", "img/skipbus.png");
                $("#skipbtn").attr("srcset", "img/skipbus@2x.png 2x, img/skipbus@3x.png");
           } else if (201 == ret.code) {
                skipbtn_on = false;
                $("#skipbtn").attr("src", "img/skipbus-dim.png");
                $("#skipbtn").attr("srcset", "img/skipbus-dim@2x.png 2x, img/skipbus-dim@3x.png");
           } else if (400 == ret.code || 401 == ret.code) {
                makeAlert(ret.msg);
           }
           },
           
           error:function(status, err) {
                makeAlert('현재 상황을 알 수가 없습니다. 나중에 다시 시도해주세요.');
           }
           });
}
/*
 // 학원안가요. 이번버전에서 빠짐

function onNotgoingbtn() {
    if(notgoingbtn_on) {
        notgoingbtn_on = false;
        $("#notgoingbtn").attr("src", "img/not_going-dim.png");
        $("#notgoingbtn").attr("srcset", "img/not_going-dim@2x.png 2x, img/not_going-dim@3x.png");
        // 서버에 알려줘야겠지.
        // 앞으로 계속 비활성화 되어야하니까.... 어딘가 저장을 해야겠지...
    }
}
 */

function onCallbtn(in_num) {
    window.location.href='tel:'+phonenum[1];
}

function makeTabTitle(in_code, in_str) {
    var temptext = in_str.split(" ");
    var tempstr = temptext[0];
    if(in_code == 201 || in_code == 202 || in_code == 200 || in_code == 204) {
        tempstr += "<br>";
        for(var i=1; i<temptext.length; i++) {
            if(i < temptext.length-1)
                tempstr += temptext[i]+" ";
            else
                tempstr += temptext[i];
        }
    }
    if(in_code == 203) { //운행스케쥴이 종료되었습니다.
        tempstr += " "+temptext[1];
        tempstr += "<br>";
        for(var i=2; i<temptext.length; i++) {
            if(i < temptext.length-1)
                tempstr += temptext[i]+" ";
            else
                tempstr += temptext[i];
        }
    }
    $("p.tabtitle").html(tempstr);
}
var cur_ret_code = null;

//"http://curtis-tayotayo.edticket.com/api/getRealtimeLocation?sid=616"
//"http://api.edticket.com/api/getRealtimeLocation?sid=616"
function getRealtime(inventoryid) {
    if(inventory[1] == "experience") {
        mURL ="https://api.edticket.com/api/experienceGetRealtimeLocation";
    } else {
        mURL ="https://api.edticket.com/api/getRealtimeLocation?sid="+in_sid[1]+"&inventory_id="+inventoryid[1]+"&pin_number="+window.localStorage.getItem("localpin");
    }
//    mURL = "http://api.edticket.com/api/getRealtimeLocationDebug?debug_id=200"; // 디버깅용
//    mURL = "http://api.edticket.com/api/getRealtimeLocation?rawhm=1642&hm=16:42&d=%EC%9B%94&today=20170921&sid=781&debug=1&inventory_id=1071"
    
    $.ajax({url:mURL, success:function(result, status, xhr){
           var ret = JSON.parse(xhr.responseText);
//           if(ret.code == 401||ret.code == 400||ret.code==204||ret.code==203||ret.code==202||ret.code==201||ret.code==200) {
//                $("p.tabtitle").text(ret.msg);// 운행정보
//           }
           FINISH_REALTIME = true;
           makeTabTitle(ret.code, ret.msg);
           cur_ret_code = ret.code;
           if(ret.code==203 || ret.code == 204) {//운행종료, 스케쥴없음
                if(m_timer) {
                   clearInterval(m_timer);
                   m_timer = null;
                }
               $(".fixedbus").css("display", "inline");
               $(".movingdiv").css("display", "none");
               $("p.ending_msg").text(ret.msg);
               $("div.endroute").css("display", "block");
               $("div.route").css("display", "none");
           } else if (ret.code == 200 || ret.code == 201 || ret.code == 202) {//도착7분전,출발즉시,출발전
               $("div.endroute").css("display", "none");
               $("div.route").css("display", "block");
               if(m_timer && ret.code == 201) {//201 출발
// 버스 정리하고 타이머 정리해야겠다.
//                   clearInterval(m_timer);
//                   m_timer = null;
               } else {
                   if(inventory[1] == "experience") {
                       if(FINISH_ROUTE && FINISH_REALTIME)
                           beforeStart();
                   } else
                   if (istoday[1] == "true") { //오늘
                       createTimer();
//                       beforeStart();//시점이 안맞아서 tabtitle 찍고나서 찍어야겠다.
                   }
               }
               if(ret.code == 200) {
                   m_waitingTime = ret.waittime;
               }
           } else {//화면에 아무것도 안나오는 상태.. 이런건 올 수 없지만......
               $("div.endroute").css("display", "none");
               $("div.route").css("display", "none");
           }
           },
           
           error:function(status, err) {
               makeAlert('현재 상황을 알 수가 없습니다. 나중에 다시 시도해주세요.');
           }
           });
}

function createTimer() {
    if(m_timer == null && FINISH_REALTIME && FINISH_ROUTE) {
        beforeStart();
        m_timer = setInterval(onReloadTimer, m_timerInterval);
    }
}
//bus image 'img/bus.png'
//<img class="bus_img" src='img/bus.png' srcset='img/bus@2x.png 2x, img/bus@3x.png 3x'/></td>

//아이승차 image 'img/gettingon.png'
// table 에 좌우 2개의 td로 구성, 글자를 갖는 tr 과 구분선만 그리는 tr 그리고 두개의 tr에 걸쳐서 버스의 이동선을 보여주고있다.
// td.img_td 는 출발/도착/위치점/버스 이미지 등 좌측 이미지만 표시하는 td
// td.starttd 는 우측 출발점을 보여줌
// td.locationtd 는 우측 버스 정차지점 보여줌.
// td.endtd 는 우측 도착점을 보여줌
//var debugrounte = JSON.stringify(
//                                {"routemap": [
//             {
//             "addr": "출발",
//             "sequence": 1,
//             "time": "15:01",
//             },
//             {
//             "addr": "위례중앙푸르지오\n(신안인스빌 맞은편 쪽문 경비실)",
//             "sequence": 2,
//             "time": "15:14",
//             },
//             {
//             "addr": "강동자이 프라자아파트 정문",
//             "sequence": 3,
//             "time": "15:17",
//             },
//             {
//             "addr": "현대아파트 (현대중앙상가 앞)",
//             "poi": "ride",
//             "sequence": 4,
//             "time": "15:20",
//             },
//             {
//             "addr": "도착",
//             "sequence": 5,
//             "time": "15:30",
//             }
//             ]});

var allPointTime = [];
function getRouteMap(inventoryid) {
    //"http://curtis-tayotayo.edticket.com/api/getRouteMap?sid=42&inventory_id=381"
    //"http://api.edticket.com/api/getRouteMap?sid=42&inventory_id=381"
    if(inventory[1] == "experience") {
        aUrl = "https://api.edticket.com/api/experienceGetRouteMap";
    } else {
        aUrl = "https://api.edticket.com/api/getRouteMap?sid="+in_sid[1]+"&inventory_id="+inventoryid[1]+"&pin_number="+window.localStorage.getItem("localpin");
    }
    $.ajax({url:aUrl, success:function(result, status, xhr){
           var ret = JSON.parse(xhr.responseText);
           //400 param 유효하지 않다 401 사용자가 없다 402 inventory 에 해당 sid 정보 없다.
           if (ret.code == 400 || ret.code == 401 || ret.code == 402) {
                makeAlert(ret.msg);
//                $("div.route").text(ret.msg);
           } else {
           
               var routeData = ret.routemap;
// debug용
//           var routeData = JSON.parse(debugrounte).routemap;
//           istoday[1]="true";
//           cur_ret_code = 200;
           
               var res = "";
               for(var i = 0; i<routeData.length; i++) {
                   if(i == 0) {
                       res = "<tr><td class='img_td lefttd'><img class='leave_img' src='img/leave_dim.png' srcset='img/leave_dim@2x.png 2x, img/leave_dim@3x.png 3x'/></td><td class='starttd righttd'>"+routeData[i].addr+"</td></tr><tr><td class='lefttd' rowspan='2'><p class='bus_line1'></p></td><td id='paddingtd' class='bordertd righttd'></td></tr><tr><td id='paddingtd' class='righttd'></td></tr>"
                   } else if(i == (routeData.length-1)){ // 마지막, 도착
                       res+="<tr><td class='img_td lefttd'><img class='arrive_img' src='img/dimarrive.png' srcset='img/dimarrive@2x.png 2x, img/dimarrive@3x.png 3x'/></td><td class='endtd righttd'>"+routeData[i].addr+"</td></tr>"
                   } else {
                       if(routeData[i].poi == undefined) { //일반 버스 스탑
                           if(i==(routeData.length-3)) {//위치 4개
                               res+="<tr><td class='img_td lefttd'><img class='busstop_img2' src='img/dimbusstop.png' srcset='img/dimbusstop@2x.png 2x, img/dimbusstop@3x.png 3x'/></td><td class='locationtd righttd'>"+routeData[i].addr+"</td></tr><tr><td class='lefttd' rowspan='2'><p class='bus_line3'></p></td><td id='paddingtd' class='bordertd righttd'></td></tr><tr><td id='flexibletd' class='righttd'></td></tr>"
                           } else {
                               res+="<tr><td class='img_td lefttd'><img class='busstop_img1' src='img/dimbusstop.png' srcset='img/dimbusstop@2x.png 2x, img/dimbusstop@3x.png 3x'/></td><td class='locationtd righttd'>"+routeData[i].addr+"</td></tr><tr><td class='lefttd' rowspan='2'><p class='bus_line2'></p></td><td id='paddingtd' class='bordertd righttd'></td></tr><tr><td id='paddingtd' class='righttd'></td></tr>"
                           }
                       } else {//탑승역
                           res+="<tr><td class='img_td lefttd'><img class='bus_img' src='img/gettingon.png' srcset='img/gettingon@2x.png 2x, img/gettingon@3x.png 3x'/></td><td class='getontd righttd'>"+routeData[i].addr+"<p class='getontime'>"+routeData[i].time+"분 승차예정</p></td></tr><tr><td class='lefttd'rowspan='2'><p class='flexible_line'></p></td><td id='flexibletd' class='bordertd righttd'></td></tr><tr><td id='paddingtd' class='righttd'></td></tr>"
                       }
                   }
                   allPointTime[i] = routeData[i].time;
               }
               $("table.route").prepend(res);
               $(".getontime").hide();
               FINISH_ROUTE = true;

               if(inventory[1] == "experience") {
                   if((cur_ret_code == 202 || cur_ret_code == 200) && FINISH_ROUTE && FINISH_REALTIME)
                   beforeStart();
               } else {
                   if (istoday[1] == "true") { //오늘
//                       beforeStart();//시점이 안맞아서 tabtitle 찍고나서 찍어야겠다.
//                        pageReMake(); // DOM 이 생성이 안되어있어.
           
//                        if(!FINISH_REALTIME || cur_ret_code == 202 || cur_ret_code == 200)
//                           m_timer = setInterval(onReloadTimer, m_timerInterval);
           
                       if(cur_ret_code == 202 || cur_ret_code == 200)
                           createTimer();
//                } else {
//                    $(".movingdiv").css("display", "none");
                    }
                }
           }//success
           
           },
           error:function(status, err) {
                makeAlert('일정확인에 문제가 있습니다. 나중에 다시 시도해주세요.');
           }
           });

}

function makeSibButton() {
    if(inventory[1] == "experience") {
        var buttonStr = "<button id='sid1' class='sidbtn 1004' onclick='viewChild()'>처음부터<br/>시작하기</button>";
        $("div.navibar").prepend(buttonStr);
        $(".sidbtn").css("width", "5em");
        $(".sidbtn").css("height","5em");
        $(".sidbtn").css("font-size","1.2em");
        return;
    }
    var tempname = decodeURI(childname[1] , "UTF-8");
    
//    var tempStr = "<button id='sid1' class='sidbtn'><img class='sidbtn' src='img/btn.png' srcset='img/btn@2x.png 2x, img/btn@3x.png 3x' onclick='viewChild()'>"+tempname+"</img></button>";
    var tempStr = "<button id='sid1' class='sidbtn'><img class='sidbtn' src='img/btn.png' srcset='img/btn@2x.png 2x, img/btn@3x.png 3x'>"+tempname+"</img></button>";

    
    $("div.navibar").prepend(tempStr);
}

function viewChild() {
    if(inventory[1] == "experience") {
        window.location.replace("auth.html");
        return;
    }
//    window.location.replace("tayoschedule.html?restart:true&fromreal:"+personid[1]+"&curday:"+curday[1]+"&action:sid");
}

function gotoWeeklySchedule() {
    if(inventory[1] == "experience") {
        window.location.replace("auth.html");
        return;
    }
    window.location.replace("tayoschedule.html?restart:true&fromreal:"+personid[1]+"&curday:"+curday[1]+"&action:back");
}
//var movingoffset_top = 0;
var FINISH_REALTIME = false;
var FINISH_ROUTE = false;
function beforeStart() {
//    if(inventory[1] != "experience") {
//        if(!FINISH_REALTIME || !FINISH_ROUTE)
//            return;
//    }
//    var dd = ($("img.leave_img").width() - $("img.fixedBus").width())/2;
//    $(".fixedBus").css("display","block");
//    $(".fixedBus").css("position","fixed");
//    $(".fixedBus").css("top",$("img.leave_img").offset().top);
//    $(".fixedBus").css("left",$("img.leave_img").offset().left-dd+"px");
    
    
//    if($(".movingdiv").offset().top == movingoffset_top) {
//        alert("출발전"+movingoffset_top);
//        return;
//    }
    $(".movingdiv").css("top",$("img.leave_img").offset().top);
    $(".movingdiv").css("left","0px");
    $(".movingdiv").css("display","block");
    $(".movingdiv").css("position","fixed");
//    movingoffset_top = $(".movingdiv").offset().top;
    $("img.leave_img").attr("src", "img/leave_dim.png");
    $("img.leave_img").attr("srcset", "img/leave_dim@2x.png 2x, img/leave_dim@3x.png");
    $("p.bus_line1").css("background-image", "url('img/dimdotline.png')");
    $("img.busstop_img1").attr("src", "img/dimbusstop.png");
    $("img.busstop_img1").attr("srcset", "img/dimbusstop@2x.png 2x, img/dimbusstop@3x.png");
    $("p.bus_line2").css("background-image", "url('img/dimbusline.png')");
    $("img.busstop_img2").attr("src", "img/dimbusstop.png");
    $("img.busstop_img2").attr("srcset", "img/dimbusstop@2x.png 2x, img/dimbusstop@3x.png");
    $("p.bus_line3").css("background-image", "url('img/dimbusline.png')");
    $("img.bus_img").attr("src", "img/gettingon.png");
    $("img.bus_img").attr("srcset", "img/gettingon@2x.png 2x, img/gettingon@3x.png");
    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
    $("img.arrive_img").attr("src", "img/dimarrive.png");
    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
}

//var wait = [15,10,5,3];
//var ii=0;

function movingBus3Stop() {
    var boardingpoint = allPointTime[allPointTime.length-2].split(":");
    var boardingtime = parseInt(boardingpoint[0])*60+ parseInt(boardingpoint[1]);
    var curtime = boardingtime - m_waitingTime;
// test 용
//    if(ii == 3) ii = 2;
//    var curtime = boardingtime - wait[ii];
//    ii++;
    
    var startPoint = allPointTime[0].split(":");
    var starttime = parseInt(startPoint[0])*60+ parseInt(startPoint[1]);

    if(curtime <= starttime) {
        return;
    }
    if(curtime > starttime) {
        $("img.leave_img").attr("src", "img/leave.png");
        $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
        var rate = (curtime - starttime) / (boardingtime - starttime);
        var movedist = rate * $("p.bus_line1").height();
        $(".movingdiv").css("top",$("img.leave_img").offset().top + movedist);
        if(movedist > $("p.bus_line1").height()/3) {
            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
        }
    }
    if(curtime == boardingtime) {
        $("p.bus_line1").css("background-image", "url('img/dotline.png')");
        $("img.bus_img").attr("src", "img/goingbus.png");
        $("img.bus_img").attr("srcset", "img/goingbus@2x.png 2x, img/goingbus@3x.png");
    }
    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
    $("img.arrive_img").attr("src", "img/dimarrive.png");
    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
}

function movingBus4Stop() {
    var boardingpoint = allPointTime[allPointTime.length-2].split(":");
    var boardingtime = parseInt(boardingpoint[0])*60+parseInt(boardingpoint[1]);
    var curtime = boardingtime - m_waitingTime;
    var startPoint = allPointTime[0].split(":");
    var starttime = parseInt(startPoint[0])*60+parseInt(startPoint[1]);
    
    if(curtime <= starttime) {
        return;
    }
    if(curtime > starttime) {
        $("img.leave_img").attr("src", "img/leave.png");
        $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
    }
    var secondPoint = allPointTime[1].split(":");
    var secondtime = parseInt(secondPoint[0])*60+parseInt(secondPoint[1]);
    if(curtime >= secondtime) {
        $("p.bus_line1").css("background-image", "url('img/dotline.png')");
        $("img.busstop_img2").attr("src", "img/busstop.png");
        $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
    } else {
        rate = (curtime - starttime) / (secondtime - starttime);
        movedist = rate * $("p.bus_line1").height();
        $(".movingdiv").css("top",$("img.leave_img").offset().top + movedist);
        if(movedist > $("p.bus_line1").height()/3) {
            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
        }
    }
    if (curtime == boardingtime) {
        $("p.bus_line3").css("background-image", "url('img/dotline.png')");
        $("img.bus_img").attr("src", "img/goingbus.png");
        $("img.bus_img").attr("srcset", "img/goingbus@2x.png 2x, img/goingbus@3x.png");
    } else {
        rate = (curtime - secondtime) / (boardingtime - secondtime);
        movedist = rate * $("p.bus_line3").height();
        $(".movingdiv").css("top",$("img.bus_img").offset().top + movedist);
        if(movedist > $("p.bus_line3").height()/3) {
            $("p.bus_line3").css("background-image", "url('img/dotline.png')");
        }
    }
    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
    $("img.arrive_img").attr("src", "img/dimarrive.png");
    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
}

//leave_img , bus_line1
//일반버스 busstop_img1 , bus_line2
//마지막 arrive_img
//탑승지 bus_img , flexible_line
//탑승지 위 busston_img2 , bus_line3
function beforeSevenMin() {
    if(allPointTime.length == 3)
        movingBus3Stop();
    else if(allPointTime.length == 4)
        movingBus4Stop();
    else {
        var boardingpoint = allPointTime[allPointTime.length-2].split(":");
        var boardingtime = parseInt(boardingpoint[0])*60+parseInt(boardingpoint[1]);
        var curtime = boardingtime - m_waitingTime;
        var startPoint = allPointTime[0].split(":");
        var starttime = parseInt(startPoint[0])*60+parseInt(startPoint[1]);
        
        if(curtime <= starttime) {
            return;
        }
        if(curtime > starttime) {
            $("img.leave_img").attr("src", "img/leave.png");
            $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
        }
        var secondPoint = allPointTime[1].split(":");
        var secondtime = parseInt(secondPoint[0])*60+parseInt(secondPoint[1]);
        if(curtime >= secondtime) {
            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
            $("img.busstop_img1").attr("src", "img/busstop.png");
            $("img.busstop_img1").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
        } else {
            rate = (curtime - starttime) / (secondtime - starttime);
            movedist = rate * $("p.bus_line1").height();
            $(".movingdiv").css("top",$("img.leave_img").offset().top + movedist);
            if(movedist > $("p.bus_line1").height()/3) {
                $("p.bus_line1").css("background-image", "url('img/dotline.png')");
            }
        }
        var thirdpoint = allPointTime[2].split(":");
        var thirdtime = parseInt(thirdpoint[0])*60+parseInt(thirdpoint[1]);
        if(curtime >= thirdtime) {
            $("p.bus_line2").css("background-image", "url('img/busline.png')");
            $("img.busstop_img2").attr("src", "img/busstop.png");
            $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
        } else {
            rate = (curtime - secondtime) / (thirdtime - secondtime);
            movedist = rate * $("p.bus_line2").height();
            $(".movingdiv").css("top",$("img.busstop_img1").offset().top + movedist);
            if(movedist > $("p.bus_line2").height()/3) {
                $("p.bus_line2").css("background-image", "url('img/dotline.png')");
            }
        }
        if (curtime == boardingtime) {
            $("p.bus_line3").css("background-image", "url('img/dotline.png')");
            $("img.bus_img").attr("src", "img/goingbus.png");
            $("img.bus_img").attr("srcset", "img/goingbus@2x.png 2x, img/goingbus@3x.png");
        } else {
            rate = (curtime - thirdtime) / (boardingtime - thirdtime);
            movedist = rate * $("p.bus_line3").height();
            $(".movingdiv").css("top",$("img.busstop_img2").offset().top + movedist);
            if(movedist > $("p.bus_line3").height()/3) {
                $("p.bus_line3").css("background-image", "url('img/dotline.png')");
            }
        }
        $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
        $("img.arrive_img").attr("src", "img/dimarrive.png");
        $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
    }
}

//function movingBus3Stop_org() {
//    var c = new Date();
//    var c_milli = c.getTime();
//    var lastpoint = allPointTime[allPointTime.length-2].split(":");
//    var last_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(lastpoint[0]), parseInt(lastpoint[1]), 0, 0);
//    var last_mili = last_date.getTime();
//    var wait_mili = m_waitingTime*60*1000;
//    var curPos_mili = last_mili - wait_mili;
//
//    var startPoint = allPointTime[0].split(":");
//    var nextPoint = allPointTime[1].split(":");
//    var start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//    var next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//    var d = curPos_mili - start_date.getTime();
//
//    if( d >= 0 ) {
//        $("img.leave_img").attr("src", "img/leave.png");
//        $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
//
//        l_late = d/(next_date.getTime() - start_date.getTime());
//        diffOffset = ($("img.busstop_img1").offset().top - $("img.leave_img").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.leave_img").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.leave_img").offset().top+$("img.leave_img").height()+$("p.bus_line1").height()/3)
//            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//
//    } else {
//        return;
//    }
//    startPoint = allPointTime[1].split(":");
//    nextPoint = allPointTime[2].split(":");
//    start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//    next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//    d = curPos_mili - start_date.getTime();
//    if( d >= 0 ) {
//        $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//        $("img.bus_img").attr("src", "img/bus.png");
//        $("img.bus_img").attr("srcset", "img/bus@2x.png 2x, img/bus@3x.png");
//        l_late = d/(next_date.getTime() - start_date.getTime());
//        diffOffset = ($("img.arrive_img").offset().top - $("img.bus_img").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.bus_img").offset().top+diffOffset);
//    } else {
//        return;
//    }
//    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
//    $("img.arrive_img").attr("src", "img/dimarrive.png");
//    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
//}
//function movingBus4Stop_org() {
//    var c = new Date();
//    var c_milli = c.getTime();
//    var lastpoint = allPointTime[allPointTime.length-2].split(":");
//    var last_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(lastpoint[0]), parseInt(lastpoint[1]), 0, 0);
//    var last_mili = last_date.getTime();
//    var wait_mili = m_waitingTime*60*1000;
//    var curPos_mili = last_mili - wait_mili;
//
//    var startPoint = allPointTime[0].split(":");
//    var nextPoint = allPointTime[1].split(":");
//    var start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//    var next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//    var d = curPos_mili - start_date.getTime();
//
//    if( d >= 0 ) {
//        $("img.leave_img").attr("src", "img/leave.png");
//        $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
//
//        l_late = d/(next_date.getTime() - start_date.getTime());
//        diffOffset = ($("img.busstop_img1").offset().top - $("img.leave_img").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.leave_img").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.leave_img").offset().top+$("img.leave_img").height()+$("p.bus_line1").height()/3)
//            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//
//    } else {
//        return;
//    }
//    startPoint = allPointTime[1].split(":");
//    nextPoint = allPointTime[2].split(":");
//    start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//    next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//    d = curPos_mili - start_date.getTime();
//    if( d >= 0 ) {
//        l_late = d/(next_date.getTime() - start_date.getTime());
//        $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//        $("img.busstop_img2").attr("src", "img/busstop.png");
//        $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
//        diffOffset = ($("img.bus_img").offset().top - $("img.busstop_img2").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.busstop_img2").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.busstop_img2").offset().top+$("img.busstop_img2").height()+$("p.bus_line3").height()/3)
//            $("p.bus_line3").css("background-image", "url('img/busline.png')");
//    } else {
//        return;
//    }
//    startPoint = allPointTime[2].split(":");
//    nextPoint = allPointTime[3].split(":");
//    start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//    next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//    d = curPos_mili - start_date.getTime();
//    if( d >= 0 ) {
//        $("p.bus_line3").css("background-image", "url('img/busline.png')");
//        $("img.bus_img").attr("src", "img/bus.png");
//        $("img.bus_img").attr("srcset", "img/bus@2x.png 2x, img/bus@3x.png");
//
//        l_late = d/(next_date.getTime() - start_date.getTime());
//        diffOffset = ($("img.arrive_img").offset().top - $("img.bus_img").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.bus_img").offset().top+diffOffset);
//    } else {
//        return;
//    }
//    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
//    $("img.arrive_img").attr("src", "img/dimarrive.png");
//    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
//}

//두번째 버전 함수는  분기. 그러나 milliseconds 계산 복잡. 최소 3개 ~ 최대 5개 위치
//function beforeSevenMin_org() {
//    var boardingpoint = allPointTime[allPointTime.length-2].split(":");
//    var boardingtime = bardingpoint[0]*60+bardingpoint[1]; //13*60+30, 분 환산
//    var curtime = boardingtime - m_waitingTime;//10 12:50
//    var startPoint = allPointTime[0].split(":"); //13:00
//    var starttime = startPoint[0]*60+startPoint[1];
//
//    if(curtime <= starttime) {
//        return;
//    }
//
//    if(allPointTime.length == 3)
//        movingBus3Stop();
//    else if(allPointTime.length == 4)
//        movingBus4Stop();
//    else {
//        var c = new Date();
//        var c_milli = c.getTime();
//        var lastpoint = allPointTime[allPointTime.length-2].split(":");
//        var last_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(lastpoint[0]), parseInt(lastpoint[1]), 0, 0);
//        var last_mili = last_date.getTime();
//        var wait_mili = m_waitingTime*60*1000;
//        var curPos_mili = last_mili - wait_mili;
//
//        var startPoint = allPointTime[0].split(":");
//        var nextPoint = allPointTime[1].split(":");
//        var start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//        var next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//        var d = curPos_mili - start_date.getTime();
//
//        if( d >= 0 ) {
//            $("img.leave_img").attr("src", "img/leave.png");
//            $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
//
//            l_late = d/(next_date.getTime() - start_date.getTime());
//            diffOffset = ($("img.busstop_img1").offset().top - $("img.leave_img").offset().top)*l_late;
//            $(".movingdiv").css("top",$("img.leave_img").offset().top+diffOffset);
//
//            if($(".movingdiv").offset().top > $("img.leave_img").offset().top+$("img.leave_img").height()+$("p.bus_line1").height()/3)
//                $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//
//        } else {
//            return;
//        }
//        startPoint = allPointTime[1].split(":");
//        nextPoint = allPointTime[2].split(":");
//        start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//        next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//        d = curPos_mili - start_date.getTime();
//        if( d >= 0 ) {
//            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//            $("img.busstop_img1").attr("src", "img/busstop.png");
//            $("img.busstop_img1").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
//            l_late = d/(next_date.getTime() - start_date.getTime());
//            diffOffset = ($("img.busstop_img2").offset().top - $("img.busstop_img1").offset().top)*l_late;
//            $(".movingdiv").css("top",$("img.busstop_img1").offset().top+diffOffset);
//
//            if($(".movingdiv").offset().top > $("img.busstop_img1").offset().top+$("img.busstop_img1").height()+$("p.bus_line2").height()/3)
//                $("p.bus_line2").css("background-image", "url('img/busline.png')");
//        } else {
//            return;
//        }
//        startPoint = allPointTime[2].split(":");
//        nextPoint = allPointTime[3].split(":");
//        start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//        next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//        d = curPos_mili - start_date.getTime();
//        if( d >= 0 ) {
//            $("p.bus_line2").css("background-image", "url('img/busline.png')");
//            $("img.busstop_img2").attr("src", "img/busstop.png");
//            $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
//
//            l_late = d/(next_date.getTime() - start_date.getTime());
//            diffOffset = ($("img.bus_img").offset().top - $("img.busstop_img2").offset().top)*l_late;
//            $(".movingdiv").css("top",$("img.busstop_img2").offset().top+diffOffset);
//
//            if($(".movingdiv").offset().top > $("img.busstop_img2").offset().top+$("img.busstop_img2").height()+$("p.bus_line3").height()/3)
//                $("p.bus_line3").css("background-image", "url('img/busline.png')");
//
//        } else {
//            return;
//        }
//        startPoint = allPointTime[3].split(":");
//        nextPoint = allPointTime[4].split(":");
//        start_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startPoint[0]), parseInt(startPoint[1]), 0, 0);
//        next_date = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nextPoint[0]), parseInt(nextPoint[1]), 0, 0);
//        d = curPos_mili - start_date.getTime();
//        if( d >= 0 ) {
//            $("p.bus_line3").css("background-image", "url('img/busline.png')");
//            $("img.bus_img").attr("src", "img/bus.png");
//            $("img.bus_img").attr("srcset", "img/bus@2x.png 2x, img/bus@3x.png");
//
//            l_late = d/(next_date.getTime() - start_date.getTime());
//            diffOffset = ($("img.arrive_img").offset().top - $("img.bus_img").offset().top)*l_late;
//            $(".movingdiv").css("top",$("img.bus_img").offset().top+diffOffset);
//        } else {
//            return;
//        }
//        $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
//        $("img.arrive_img").attr("src", "img/dimarrive.png");
//        $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
//    }
//}

// 첫번째 버전 함수하나에서 모두다 처리했었다.이 함수에서 모두 처리했을때, 나누자. 위에처럼
//function beforeSevenMin_trigger_all() {
//    var c = new Date();
//    var c_milli = c.getTime();
//    var ltime = allPointTime[0].split(":");
//    var nexttime = allPointTime[1].split(":");
//    var o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(ltime[0]), parseInt(ltime[1]), 0, 0);
//    var o_next = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nexttime[0]), parseInt(nexttime[1]), 0, 0);
//    var d = c_milli - o.getTime();
//
//    if( d >= 0 ) {
//        $("img.leave_img").attr("src", "img/leave.png");
//        $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");
//
//        l_late = d/(o_next.getTime() - o.getTime());
//        diffOffset = ($("img.busstop_img1").offset().top - $("img.leave_img").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.leave_img").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.leave_img").offset().top+$("img.leave_img").height()+$("p.bus_line1").height()/3)
//            $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//
//    } else {
//        return;
//    }
//    ltime = allPointTime[1].split(":");
//    nexttime = allPointTime[2].split(":");
//    o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(ltime[0]), parseInt(ltime[1]), 0, 0);
//    o_next = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nexttime[0]), parseInt(nexttime[1]), 0, 0);
//    d = c_milli - o.getTime();
//    if( d >= 0 ) {
//        $("p.bus_line1").css("background-image", "url('img/dotline.png')");
//        $("img.busstop_img1").attr("src", "img/busstop.png");
//        $("img.busstop_img1").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
//
//        l_late = d/(o_next.getTime() - o.getTime());
//        diffOffset = ($("img.busstop_img2").offset().top - $("img.busstop_img1").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.busstop_img1").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.busstop_img1").offset().top+$("img.busstop_img1").height()+$("p.bus_line2").height()/3)
//            $("p.bus_line2").css("background-image", "url('img/busline.png')");
//
//    } else {
//        return;
//    }
//    ltime = allPointTime[2].split(":");
//    nexttime = allPointTime[2].split(":");
//    o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(ltime[0]), parseInt(ltime[1]), 0, 0);
//    o_next = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nexttime[0]), parseInt(nexttime[1]), 0, 0);
//    d = c_milli - o.getTime();
//    if( d >= 0 ) {
//        $("p.bus_line2").css("background-image", "url('img/busline.png')");
//        $("img.busstop_img2").attr("src", "img/busstop.png");
//        $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
//
//        l_late = d/(o_next.getTime() - o.getTime())/d;
//        diffOffset = ($("img.bus_img").offset().top - $("img.busstop_img2").offset().top)*l_late;
//        $(".movingdiv").css("top",$("img.busstop_img2").offset().top+diffOffset);
//
//        if($(".movingdiv").offset().top > $("img.busstop_img2").offset().top+$("img.busstop_img2").height()+$("p.bus_line3").height()/3)
//            $("p.bus_line3").css("background-image", "url('img/busline.png')");
//
//    } else {
//        return;
//    }
//    ltime = allPointTime[3].split(":");
//    nexttime = allPointTime[2].split(":");
//    o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(ltime[0]), parseInt(ltime[1]), 0, 0);
//    o_next = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(nexttime[0]), parseInt(nexttime[1]), 0, 0);
//    d = c_milli - o.getTime();
//    if( d >= 0 ) {
//        $("p.bus_line3").css("background-image", "url('img/busline.png')");
//        $("img.bus_img").attr("src", "img/bus.png");
//        $("img.bus_img").attr("srcset", "img/bus@2x.png 2x, img/bus@3x.png");
//
//        l_late = d/(o_next.getTime() - o.getTime())/d;
//        diffOffset = ($("img.arrive_img").offset().top - $("img.bus_img").offset().top)*l_late;
//
//        $(".movingdiv").css("top",$("img.bus_img").offset().top+diffOffset);
//    } else {
//        return;
//    }
//    $("p.flexible_line").css("background-image", "url('img/dimdotline.png')");
//    $("img.arrive_img").attr("src", "img/dimarrive.png");
//    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
//}
//
function leaveShuttle() {
    $(".movingdiv").css("top",$("img.bus_img").offset().top+($("img.bus_img").height()-$(".boximg").height()));
    $(".movingdiv").css("left","0px");

    $("img.leave_img").attr("src", "img/leave.png");
    $("img.leave_img").attr("srcset", "img/leave@2x.png 2x, img/leave@3x.png");

    $("p.bus_line1").css("background-image", "url('img/dotline.png')");
    $("img.busstop_img1").attr("src", "img/busstop.png");
    $("img.busstop_img1").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
    $("p.bus_line2").css("background-image", "url('img/busline.png')");
    $("img.busstop_img2").attr("src", "img/busstop.png");
    $("img.busstop_img2").attr("srcset", "img/busstop@2x.png 2x, img/busstop@3x.png");
    $("p.bus_line3").css("background-image", "url('img/busline.png')");
    $("img.bus_img").attr("src", "img/goingbus.png");
    $("img.bus_img").attr("srcset", "img/goingbus@2x.png 2x, img/goingbus@3x.png");
    $("p.flexible_line").attr("background-image", "url('../img/dimdotline.png')");
    $("img.arrive_img").attr("src", "img/dimarrive.png");
    $("img.arrive_img").attr("srcset", "img/dimarrive@2x.png 2x, img/dimarrive@3x.png");
}

