var temp = null;
var paramData = null;
var isReStart = null;
var fromReal = null;
var curDay = null;
var studentArray = null;
var action = null;

var g_viewingId = null;
var SCHEDULE_INTERVAL = 60000;

//tayoschedule.html?restart:true&fromreal:"+personid[1]+"&curday:"+curday[1]+"&action:sid
//tayoschedule.html?restart:true&fromreal:"+personid[1]+"&curday:"+curday[1]+"&action:back
$(document).ready(function() {
//    $(document).bind('touchstart', function(e) {
//        //아무데나 눌렀을때, sid item 을 닫기위해 (sidItem == null || sidItem == undefined) 확인
//        if($(e.target).hasClass("sidbtn"))
//            return;
//        if($(".navibar").children().length > 1 && $(".navibar").find(".active").length == 0)
//            viewChild(g_viewingId);

//    });
                  
    $("div.tab").click(function(){
        if($(".navibar").children().length > 1 && $(".navibar").find(".active").length == 0)
            viewChild(g_viewingId);
    });

    temp = location.href.split("?");
    paramData = temp[1].split("&");
    if(paramData.length==1)
        isReStart = paramData[0].split(":");
    else {
        isReStart = paramData[0].split(":");
        fromReal = paramData[1].split(":");
        curDay = paramData[2].split(":");
        action = paramData[3].split(":");
    }
    
    $("a.configa").click(function(){
        if(isReStart != null && isReStart[1] == "experience")
            $(this).attr("href", "");
        else
            $(this).attr("href", "tayoconfig.html");
    });
                  
//                  alert("making schedule start isReStart:"+isReStart[1]+" location.href:"+temp[1]);
    if(isReStart != null) {
        if(isReStart[1]=="false") {// 앱의 맨처음 구동

            studentArray = JSON.parse(window.localStorage.getItem("studentInfo"));
//                  alert("making schedule 1 student array:"+studentArray.length);
            if(studentArray && studentArray.length) {
                makeChildContainer();
                makeChildButton();
                getSchedule();
            }
            $("div.modal").css("display", "block");
            $("img.modal1").css("display", "block");
            $("img.modal2").css("display", "none");
//                  getFirebaseDB();//실시간 스케쥴에서 넘어올때
        } else if(isReStart[1] == "experience") {// 체험하기
            $("div.modal").css("display", "block");
            $("img.modal1").css("display", "block");
            $("img.modal2").css("display", "none");
            makeChildContainer_experience();
            makeChildButton_experience();
            getSchedule_experience();
        } else if(fromReal == null || fromReal == undefined) {//일상적 앱 구동. isReStart == true
            var main = 1;
            goLogin(window.localStorage.getItem("localpin"), main);
        } else { //isReStart == true & fromreal == true
            //getFirebaseDB();//실시간 스케쥴에서 넘어올때
            studentArray = JSON.parse(window.localStorage.getItem("studentInfo"));
            if(studentArray && studentArray.length) {
                makeChildContainer();
                makeChildButton();
                getSchedule();
            }
        }
    } else {
//        alert("isReStart is null!!!");
    }
    $(".date").text("");
});

function showPinModal() {
    $(".pinModal").show();
}

function goToRootPage() {
    window.location.replace("auth.html");
}

var m_timer = null;
var m_today = null;
function closeModal(num) {
    if(num == 1) {
        $("img.modal1").css("display", "none");
        $("img.modal2").css("display", "block");
    } else {
        $("img.modal1").css("display", "none");
        $("img.modal2").css("display", "none");
        $("div.modal").css("display", "none");
        
        //push 를 위해서 띄우자. android 만
//        if(isReStart[1] == "false") {
//            var isPush = window.localStorage.getItem("recvpush");
//
//            if(device.platform == "Android" && isPush == null) {
//                $(".pushModal").show();
//            } else if(device.platform == "iOS") {
//                $(".pushModal").hide();
//                window.FirebasePlugin.hasPermission(function(data){
//                    if(data.isEnabled) {
//                        setNoti(true);
//                    } else {
//                        setNoti(false);
//                    }
//                });
//            } else {
//                $(".pushModal").hide();
//            }
//        }
        
    }
}

//function setNoti(in_bool) {
//    if(device == null || device == undefined) {
//        dev_id = null;
//    } else {
//        dev_id = device.uuid;
//    }
//    $.ajax({
//           url: 'http://mj.edticket.com/fcmdev/addDeviceInfo',
//           type: 'POST',
//           data: $.param({device_id: dev_id, recvpush: in_bool}),
//           success: function() {
//           },
//           error: function() {
//           }
//           });
//}

//"students": [
//"name": "정아신",
//"pin": "Jw9nNi3",
//"sid": 123,
//"personinfo_id": 9161,
//"parents_phonenumber": "01028992623",
//"grandparents_phonenumber": null,
//"self_phonenumber": null,
//"aid": 36,
//"care_phonenumber": null,
//"birth_year":null

function makeChildContainer() {
    var containerStr = null;
    for(var i=0; i<studentArray.length; i++) {
        if(i==0) {
            containerStr = "<div class='child"+" "+studentArray[i].personinfo_id+"'></div>";
            g_viewingId = studentArray[i].personinfo_id;
        } else {
            var mustAdd = true;
            for(var j=i-1; j>=0; j--) {
                if(parseInt(studentArray[j].personinfo_id) == parseInt(studentArray[i].personinfo_id)) {
                    mustAdd = false;
                    break;
                }
            }
            if(mustAdd) {
                containerStr += "<div class='child"+" "+studentArray[i].personinfo_id+"'></div>";
            }
        }
    }
    $("div.comment").after(containerStr);
//    $("div.child").hide(); // 생성하고 default hidden
}

function makeChildButton() {
    var buttonStr = null;
    for(var i=0; i<studentArray.length; i++) {
        if(i==0) {
            buttonStr = "<button id='sid1' class='sidbtn"+" "+studentArray[i].personinfo_id+"' onclick='viewChild("+studentArray[i].personinfo_id+")'><img class='sidbtn' src='img/btn.png' srcset='img/btn@2x.png 2x, img/btn@3x.png 3x'>"+studentArray[i].name+"</img></button>";
            g_viewingId = studentArray[i].personinfo_id;
        } else {
            var mustAdd = true;
            for(var j=i-1; j>=0; j--) {
                if(parseInt(studentArray[j].personinfo_id) == parseInt(studentArray[i].personinfo_id)) {
                    mustAdd = false;
                    break;
                }
            }
            if(mustAdd) {
                buttonStr += "<button id='sid1' class='sidbtn"+" "+studentArray[i].personinfo_id+"'onclick='viewChild("+studentArray[i].personinfo_id+")'><img class='sidbtn' src='img/btn.png' srcset='img/btn@2x.png 2x, img/btn@3x.png 3x'>"+studentArray[i].name+"</img></button>";
            }

        }
    }
    $("div.navibar").prepend(buttonStr);
    if(fromReal != null && fromReal.length > 1)
        g_viewingId = fromReal[1];
    
    viewChild(g_viewingId);
}

function viewChild(personId) {
    g_viewingId = personId;
    
    var list = $(".navibar").children();
    var selectedIdx = -1;
    var isActive = false;
    for(var x=0; x<list.length; x++) {
       if($(list[x]).hasClass(personId)) {
           selectedIdx = x;
           
           if(action == "sid" && fromReal != null && fromReal.length > 1){// 실시간에서 오면 다시 갱신하고 모두다 보여주기위해. 우선 선택표시.
               $(list[x]).addClass("active");
           }
           
           isActive = $(list[x]).hasClass("active");
           break;
       }
    }
    
    if(isActive == true) {
        $(list[selectedIdx]).removeClass("active");
        for(var x=0; x<list.length; x++) {
            if(x == selectedIdx) {
                $(list[x]).css("backgroundColor", "#f66b5c");
                $(list[x]).css("color", "#ffffff");
                $($(list[x]).children()[0]).attr("src", "img/btn.png");
                $($(list[x]).children()[0]).attr("srcset", "img/btn@2x.png 2x, img/btn@3x.png");
            } else {
                $(list[x]).css("backgroundColor", "#ffffff");
                $(list[x]).css("color", "#f66b5c");
                $($(list[x]).children()[0]).attr("src", "img/btn-1.png");
                $($(list[x]).children()[0]).attr("srcset", "img/btn-1@2x.png 2x, img/btn-1@3x.png");
            }
            $(list[x]).show();
        }
    } else {
        for(var x=0; x<list.length; x++) {
            if(x == selectedIdx) {
                $(list[selectedIdx]).addClass("active");
                $(list[selectedIdx]).css("backgroundColor", "#f66b5c");
                $(list[selectedIdx]).css("color", "#ffffff");
                $($(list[selectedIdx]).children()[0]).attr("src", "img/btn.png");
                $($(list[selectedIdx]).children()[0]).attr("srcset", "img/btn@2x.png 2x, img/btn@3x.png");
                $(list[selectedIdx]).show();
            } else {
                $(list[x]).css("backgroundColor", "#ffffff");
                $(list[x]).css("color", "#f66b5c");
                $($(list[x]).children()[0]).attr("src", "img/btn-1.png");
                $($(list[x]).children()[0]).attr("srcset", "img/btn-1@2x.png 2x, img/btn-1@3x.png");
                $(list[x]).hide();
            }
        }
        
        if(fromReal == null)// 선택된 아이 스케쥴로 다시 보여줘.
            openSchedule(currentSelectedDay);
        else
            openSchedule(curDay[1]);
    }
    fromReal = curDay = null;
}


var g_totalSchedule = [];//studentArray 1 : g_totalSchedule 1
function getSchedule() {
    var mPin = window.localStorage.getItem("localpin");
    var schedulesPerSid = null;
    for(var i=0; i<studentArray.length; i++) {
        mUrl ="https://api.edticket.com/api/getSchedulesForStudent?sid="+studentArray[i].sid+"&pin_number="+mPin;
    
        $.ajax({url:mUrl, success:function(result, status, xhr) {
           var ret = JSON.parse(xhr.responseText);
           
               if(400 == ret.code || 401 == ret.code) {
                    makeAlert("code : " + ret.code + "msg : " + ret.msg);
               } else {
                    g_totalSchedule[g_totalSchedule.length] = ret;
//                    g_totalSchedule[g_totalSchedule.length] = ret.schedules;
                    schedulesPerSid = ret.schedules;
                    if (schedulesPerSid !== undefined) {
                        var keyLen = Object.keys(schedulesPerSid).length; //시간표 없는 날도 모두 받자 월~일
                        for (var sevenDay = 0; sevenDay <keyLen ; sevenDay++) {
                            dayStr = Object.keys(schedulesPerSid)[sevenDay];//key = mon ~ sat
                            dayList = schedulesPerSid[dayStr].list;
                            if(dayList && dayList.length > 0)
                                makeSchedule(schedulesPerSid[dayStr].today, dayStr, dayList, ret.sid);
                            makeTabBar(dayStr,schedulesPerSid[dayStr].date,schedulesPerSid[dayStr].today);
                        }//end for. makeschedules
                    }
               // 뭔가 dom 생성이후에 할 작업은 여기에...
                    $("img.live_img").hide();
                    if($("div#"+m_today).length > 0) {
                        m_timer = setInterval(tagLiveButton, SCHEDULE_INTERVAL);
                    }
                    openSchedule(m_today);
                    tagLiveButton();

                    $("table.schedules tr").click(function(){
                        if(isReStart[1]=="experience") {
                            window.location.href="tayoreal.html";
                        } else {
                            var selectSid = $(this).attr("sid");
                            var selScheduleId = $(this).attr("index");
//                        alert(selectSid +" : "+selScheduleId+" : "+currentSelectedDay);
                            for(var findExArray=0; findExArray<g_totalSchedule.length; findExArray++) {
                                if(g_totalSchedule[findExArray].sid == selectSid) {
                                    var scheduleItem = g_totalSchedule[findExArray].schedules[currentSelectedDay].list[selScheduleId];
                                    var nextScheduleItem = null;
                                    if(scheduleItem.lflag == '등원') {
                                        if(parseInt(selScheduleId)+1 < g_totalSchedule[findExArray].schedules[currentSelectedDay].list.length) {
                                            nextScheduleItem = g_totalSchedule[findExArray].schedules[currentSelectedDay].list[parseInt(selScheduleId)+1];
                                            if(nextScheduleItem.lflag !== '하원')
                                                nextScheduleItem = null;
                                        }
                                    }
//                                alert(scheduleItem.carnum+":"+scheduleItem.inventory_id+":"+scheduleItem.scheduletable_id+":"+scheduleItem.driver_telephone);
                                    goRealtimeSchedule(currentSelectedDay, scheduleItem, nextScheduleItem, selectSid);
                                    break;
                                }
                            }
                        }
                    });
               }
            }, error:function(status, err) {
                makeAlert('주간일정 가져오기를 실패하였습니다. 나중에 다시 시도해주세요.');
            }
        });
    }
}

//해당요일 하루치 일정을 만들어. 스케쥴 있는 요일만큼 반복돼.
function makeSchedule(isToday, day, arr, in_sid) {
    var academy = null;
    var ret = null;
    var selectedPersonId = null;
    for(var x=0; x < studentArray.length; x++) {
        if(studentArray[x].sid == in_sid) {
            selectedPersonId = studentArray[x].personinfo_id;
            break;
        }
    }
    
    for(var i=0; i<arr.length; i++) {
        if(i==0)
            scheduleTable = "<table class='schedules'>";
        
        if(arr[i].lflag == "등원") {
            if(isToday == true){
                scheduleTable += "<tr class='goingBus' sid='"+in_sid+"' index="+i+"><td class='img_td'><img class='bus_img' src='img/contents.png' srcset='img/contents@2x.png 2x, img/contents@3x.png 3x'/>"+arr[i].lflag+"</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
//onclick='goRealtimeSchedule("+day+","+arr[i].carnum+","+arr[i].inventory_id+","+arr[i].scheduletable_id+","+arr[i].driver_telephone+","+in_sid+")'
            } else {
                scheduleTable += "<tr class='goingBus' sid='"+in_sid+"' index="+i+"><td class='img_td'><img class='bus_img' src='img/contents_dim.png' srcset='img/contents_dim@2x.png 2x, img/contents_dim@3x.png 3x'/>"+arr[i].lflag+"</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            }
        } else { //하원 row
            if(isToday == true){
                scheduleTable += "<tr class='comingBus' sid='"+in_sid+"' index="+i+"><td class='img_td'><img class='bus_img' src='img/contents-01.png' srcset='img/contents-01@2x.png 2x, img/contents-01@3x.png 3x'/>"+arr[i].lflag+"</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            } else {
                scheduleTable += "<tr class='comingBus' sid='"+in_sid+"' index="+i+"><td class='img_td'><img class='bus_img' src='img/contents-01_dim.png' srcset='img/contents-01_dim@2x.png 2x, img/contents-01_dim@3x.png 3x'/>"+arr[i].lflag+"</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            }
        }
        if(i==0)
            academy = arr[i].institute_name;
        
        if(i+1 == arr.length)
            scheduleTable += "</table>";
    }// end of for(var i=0; i<arr.length; i++) { table.academy 요소 생성 완성.
    
    var childAllDayList = $("div.child."+selectedPersonId).children();
    var isAppend = false;
    var appendingIdx = -1;
    if(childAllDayList) {
        for(var k=0; k<childAllDayList.length; k++) {
            if($(childAllDayList[k]).attr("id") == day) {
                isAppend = true;
                appendingIdx = k;
                break;
            }
        }
    }
    if(isAppend) {
        ret = "<div class='academies'><table class='academy "+day+" "+academy+"'><tr class='aName'><td class='aName' colspan='4'>"+academy+"<td></tr><tr><td>"+scheduleTable+"</td></tr></table></div>";
        $(childAllDayList[appendingIdx]).append(ret);//.container 끝에 추가
    } else {
        ret = "<div id="+day+" class='container'><div class='academies'><table class='academy "+day+" "+academy+"'><tr class='aName'><td class='aName' colspan='4'>"+academy+"<td></tr><tr><td>"+scheduleTable+"</td></tr></table></div></div>";
        $("div.child."+selectedPersonId).append(ret);
    }
    if(isToday !== true){ //오늘이 아닌건 글씨도 다 dimmed
        var dayDivList = $("div.child."+selectedPersonId).find("div#"+day);
        var dayImgTextList = $(dayDivList).find("td.img_td");
        for(var j=0; j<dayImgTextList.length; j++) {
                $(dayImgTextList[j]).css("color", "#cccccc");
        }
    }
}

// 주간 스케쥴 로딩 완료. 상단 요일 표기, 모든값은 초기화
// when : 주간 스케쥴 다 로딩후에 '오늘'로 자동 셋팅, 사용자의 요일선택시 호출
// 전부 기본색을 셋팅
// 선택된것만 새로 셋팅
// 선택된 데이터에 대해 시간표 나타낼것
var currentSelectedDay = m_today;//어디서 써? 아이선택하면 그 아이의 선택된 요일 보여주려고
function openSchedule(day) {
    currentSelectedDay = day;
    $("p.day").css("color","#ffffff");
    $("p.date").css("color","#6695ff");
    $("div.container").hide();
    
    var sidList = null;
    
    if(isReStart[1] == "experience") {// 체험하기
        sidList = $("div.child.1004").children();
    } else {
        sidList = $("div.child."+g_viewingId).children();
    }
    
    var isSchedule = false;
    var isScheduleIdx = -1;
    if(sidList && sidList.length) { // 해당 container 중 선택한 요일만
        for(var k=0; k<sidList.length; k++) {
            if($(sidList[k]).attr("id") == day) {
                isSchedule = true;
                isScheduleIdx = k;
                break;
            }
        }
    }
    
    if(($("p#"+day).text() != "오늘") && isSchedule) {
        $("div.comment").show();//일정있는 다른날
    } else {
        $("div.comment").hide();//오늘이면 생략, 일정없어도 생략
    }
    if(isSchedule) {
        $("div.noschedule").hide();
        $(sidList[isScheduleIdx]).show();
//        alert("화면에 보일 요일 일정"+$(sidList[isScheduleIdx]).html());
        
    } else {
        $("div.noschedule").show();
        
    }
        
    $("p#"+day).css("color","#ffdc10");
    $($("p#"+day).prev()).css("color","#ffdc10");
    //    $("div#"+day).css("display", "block");
        
}

// 시작하면, 오늘자 스케쥴에 대해서 live 를 붙여주자
function tagLiveButton() {
    var todayList = null;
    for(var i=0; i < studentArray.length; i++) {
        if(studentArray[i].personinfo_id == g_viewingId) {
            for(var j=0; j < g_totalSchedule.length; j++) {
                if(g_totalSchedule[j].sid == studentArray[i].sid) {
                    //로그인정보studentArray 1:1 스케쥴정보, 단, 순서는 틀릴수있다. async하므로
                    todayList = g_totalSchedule[j].schedules[m_today].list;
                    if(todayList && todayList.length) {
                        for(var k=0; k < todayList.length; k++) {//등 하원
                            var startTime = todayList[k].start_time.split(":");
                            var c = new Date();
                            var o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startTime[0]), parseInt(startTime[1]), 0, 0);
                            var d = o.getTime() - c.getTime();
                            if(d >= 0 && d <= 10) { // 시작시간, 10분남았을때부터 live 붙여줘.
                                var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);//요일당 하나뿐
                                var todayTimeList = $(todayDivList).find("p.time");//등.하원 있을 수 있어.
                                for(var l=0; l<todayTimeList.length; l++) {//서버데이터todayList sid 당 list, html데이터 todayDivList는 personId 전체의 list
                                    if($(todayTimeList[l]).text() == todayList[k].time) {
                                        var liveImgTag = $(todayDivList).find("img.live_img");
                                        $(liveImgTag[l]).show();
                                    }
                                }
                            } else { // 시작시간, 10분이상 남았거나 이미 출발했으면 live 숨겨
                                var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);
                                var todayTimeList = $(todayDivList).find("p.time");
                                for(var l=0; l<todayTimeList.length; l++) {
                                    if($(todayTimeList[l]).text() == todayList[k].time) {
                                        var liveImgTag = $(todayDivList).find("img.live_img");
                                        $(liveImgTag[l]).hide();
                                    }
                                }
                            }
                            
                            var endTime = todayList[k].end_time.split(":");
                            o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);
                            d = o.getTime() - c.getTime();
                            if(d <= 0) { // 운행이 종료됐다. dimmed 시키자.
                                var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);
                                var todayTimeList = $(todayDivList).find("p.time");
                                for(var l=0; l<todayTimeList.length; l++) {
                                    if($(todayTimeList[l]).text() == todayList[k].time) {
                                        var imgTdTag = $(todayDivList).find("td.img_td");
                                        $(imgTdTag[l]).css("color", "#cccccc");
                                        var liveImgTag = $(todayDivList).find("img.bus_img");
                                        if($(liveImgTag[l]).attr("src") == "img/contents.png" || $(liveImgTag[l]).attr("src") == "img/contents_dim.png")
                                        {
                                            $(liveImgTag[l]).attr("src", "img/contents_dim.png");
                                            $(liveImgTag[l]).attr("srcset", "img/contents_dim@2x.png 2x, img/contents_dim@3x.png 3x");
                                        } else {
                                            $(liveImgTag[l]).attr("src", "img/contents-01_dim.png");
                                            $(liveImgTag[l]).attr("srcset", "img/contents-01_dim@2x.png 2x, img/contents-01_dim@3x.png 3x");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    
//    for(var z=0; z < studentArray.length; z++) {
//        if(studentArray[z].personinfo_id == g_viewingId) {
//            
//            if(z >= g_totalSchedule.length) //이거 왜? 타이머말고 데이터 하나하나 가져올때마다 하려고.
//                break;
//            
//            todayList = g_totalSchedule[z][schedules][m_today].list;//로그인정보studentArray 1:1 스케쥴정보g_totalSchedule
//            if(todayList && todayList.length) {
//                for(var i=0; i < todayList.length; i++) {//등 하원
//                    var startTime = todayList[i].start_time.split(":");
//                    var c = new Date();
//                    var o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(startTime[0]), parseInt(startTime[1]), 0, 0);
//                    var d = o.getTime() - c.getTime();
//                    if(d >= 0 && d <= 10) { // 시작시간, 10분남았을때부터 live 붙여줘.
//                        var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);//요일당 하나뿐
//                        var todayTimeList = $(todayDivList).find("p.time");//등.하원 있을 수 있어.
//                        for(var j=0; j<todayTimeList.length; j++) {//서버데이터todayList sid 당 list, html데이터 todayDivList는 personId 전체의 list
//                            if($(todayTimeList[j]).text() == todayList[i].time) {
//                                var liveImgTag = $(todayDivList).find("img.live_img");
//                                $(liveImgTag[j]).show();
//                            }
//                        }
//                    } else { // 시작시간, 10분이상 남았거나 이미 출발했으면 live 숨겨
//                        var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);
//                        var todayTimeList = $(todayDivList).find("p.time");
//                        for(var j=0; j<todayTimeList.length; j++) {
//                            if($(todayTimeList[j]).text() == todayList[i].time) {
//                                var liveImgTag = $(todayDivList).find("img.live_img");
//                                $(liveImgTag[j]).hide();
//                            }
//                        }
//                    }
//                    
//                    var endTime = todayList[i].end_time.split(":");
//                    o = new Date(c.getFullYear(), c.getMonth(), c.getDate(), parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);
//                    d = o.getTime() - c.getTime();
//                    if(d <= 0) { // 운행이 종료됐다. dimmed 시키자.
//                        var todayDivList = $("div.child."+g_viewingId).find("div#"+m_today);
//                        var todayTimeList = $(todayDivList).find("p.time");
//                        for(var j=0; j<todayTimeList.length; j++) {
//                            if($(todayTimeList[j]).text() == todayList[i].time) {
//                                var imgTdTag = $(todayDivList).find("td.img_td");
//                                $(imgTdTag[j]).css("color", "#cccccc");
//                                var liveImgTag = $(todayDivList).find("img.bus_img");
//                                if($(liveImgTag[j]).attr("src") == "img/contents.png" || $(liveImgTag[j]).attr("src") == "img/contents_dim.png")
//                                {
//                                    $(liveImgTag[j]).attr("src", "img/contents_dim.png");
//                                    $(liveImgTag[j]).attr("srcset", "img/contents_dim@2x.png 2x, img/contents_dim@3x.png 3x");
//                                } else {
//                                    $(liveImgTag[j]).attr("src", "img/contents-01_dim.png");
//                                    $(liveImgTag[j]).attr("srcset", "img/contents-01_dim@2x.png 2x, img/contents-01_dim@3x.png 3x");
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    }
}

function makeTabBar(tempKey, date, today) {
    if(today == true) {
        $("p#"+tempKey).text("오늘");
        m_today = tempKey;
    } else {
        $("p#"+tempKey).text(date.slice(date.indexOf(".")+1));
    }
}

//function goRealtimeSchedule(in_day, carnum, inventoryId, scheduleTdId, driverphone, in_sid) {
//function goRealtimeSchedule(currentSelectedDay, scheduleItem, nextScheduleItem, selectSid);
function goRealtimeSchedule(in_day, in_selItem, in_nextItem, in_sid) {
    var childName = null;
    for(var x=0; x<studentArray.length; x++) {
        if(studentArray[x].personinfo_id == g_viewingId) {
            childName = studentArray[x].name;
            break;
        }
    }
//    alert(in_day +" : "+carnum+" : "+inventoryId +" : "+scheduleTdId+" : "+driverphone+" : "+in_sid);
//    alert(scheduleItem.carnum+":"+scheduleItem.inventory_id+":"+scheduleItem.scheduletable_id+":"+scheduleItem.driver_telephone);
    
    if(in_day == m_today) {
        if(in_nextItem)
            window.location.href="tayoreal.html?inventoryId:"+in_selItem.inventory_id+"&scheduleTdId:"+in_selItem.scheduletable_id+"&carnum:"+in_selItem.carnum+"&istoday:"+"true"+"&personId:"+g_viewingId+"&childname:"+encodeURI(childName , "UTF-8")+"&day:"+currentSelectedDay+"&phone:"+in_selItem.driver_telephone+"&sid:"+in_sid+"&invenid2:"+in_nextItem.inventory_id+"&scheid2:"+in_nextItem.scheduletable_id+"&carnum2:"+in_nextItem.carnum+"&phone2:"+in_nextItem.driver_telephone;
        else
            window.location.href="tayoreal.html?inventoryId:"+in_selItem.inventory_id+"&scheduleTdId:"+in_selItem.scheduletable_id+"&carnum:"+in_selItem.carnum+"&istoday:"+"true"+"&personId:"+g_viewingId+"&childname:"+encodeURI(childName , "UTF-8")+"&day:"+currentSelectedDay+"&phone:"+in_selItem.driver_telephone+"&sid:"+in_sid;
    } else {
        if(in_nextItem)
            window.location.href="tayoreal.html?inventoryId:"+in_selItem.inventory_id+"&scheduleTdId:"+in_selItem.scheduletable_id+"&carnum:"+in_selItem.carnum+"&istoday:"+"false"+"&personId:"+g_viewingId+"&childname:"+encodeURI(childName , "UTF-8")+"&day:"+currentSelectedDay+"&phone:"+in_selItem.driver_telephone+"&sid:"+in_sid+"&invenid2:"+in_nextItem.inventory_id+"&scheid2:"+in_nextItem.scheduletable_id+"&carnum2:"+in_nextItem.carnum+"&phone2:"+in_nextItem.driver_telephone;
        else
            window.location.href="tayoreal.html?inventoryId:"+in_selItem.inventory_id+"&scheduleTdId:"+in_selItem.scheduletable_id+"&carnum:"+in_selItem.carnum+"&istoday:"+"false"+"&personId:"+g_viewingId+"&childname:"+encodeURI(childName , "UTF-8")+"&day:"+currentSelectedDay+"&phone:"+in_selItem.driver_telephone+"&sid:"+in_sid;
    }
}
//-------------------------------------------------------------------------
// 체험하기 용 childid 1004 sid 0000
//-------------------------------------------------------------------------
function makeChildContainer_experience() {
    var containerStr = null;
    containerStr = "<div class='child 1004'></div>";
    $("div.comment").after(containerStr);
}

function makeChildButton_experience() {
    var buttonStr = null;
    buttonStr = "<button id='sid1' class='sidbtn 1004' onclick='goToRootPage()'>처음부터<br/>시작하기</button>";
    $("div.navibar").prepend(buttonStr);
    $(".sidbtn").css("width", "5em");
    $(".sidbtn").css("height","5em");
    $(".sidbtn").css("font-size","1.2em");
}

function getSchedule_experience() {
    mUrl ="https://api.edticket.com/api/experienceGetSchedulesForStudent";
    $.ajax({url:mUrl, success:function(result, status, xhr) {
           var ret = JSON.parse(xhr.responseText);
           if(400 == ret.code || 401 == ret.code) {
                makeAlert("code : " + ret.code + "msg : " + ret.msg);
           } else {
                if (ret.schedules !== undefined) {
                    var keyLen = Object.keys(ret.schedules).length; //시간표 없는 날도 모두 받자 월~일
                    for (var sevenDay = 0; sevenDay <keyLen ; sevenDay++) {
                        dayStr = Object.keys(ret.schedules)[sevenDay];//key = mon ~ sat
                        dayList = ret.schedules[dayStr].list;
                        if(dayList && dayList.length > 0)
                            makeSchedule_experience(ret.schedules[dayStr].today, dayStr, dayList);
                        makeTabBar(dayStr,ret.schedules[dayStr].date,ret.schedules[dayStr].today);
                    }//end for. makeschedules
                }
                // 뭔가 dom 생성이후에 할 작업은 여기에...
                $("img.live_img").hide();
                openSchedule(m_today);
           
                $("table.schedules tr").click(function(){
                    window.location.replace("tayoreal.html?inventoryId:experience");
                });
           }
           }, error:function(status, err) {
                makeAlert('주간일정 가져오기를 실패하였습니다. 나중에 다시 시도해주세요.');
           }
    });
}

function makeSchedule_experience(isToday, day, arr) {
    var academy = null;
    var ret = null;
    
    for(var i=0; i<arr.length; i++) {
        if(i==0)
            scheduleTable = "<table class='schedules'>";
        
        if(arr[i].lflag == "등원") {
            if(isToday == true){
                scheduleTable += "<tr class='goingBus'><td class='img_td'><img class='bus_img' src='img/contents.png' srcset='img/contents@2x.png 2x, img/contents@3x.png 3x'/>등원</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            } else {
                scheduleTable += "<tr class='goingBus'><td class='img_td'><img class='bus_img' src='img/contents_dim.png' srcset='img/contents_dim@2x.png 2x, img/contents_dim@3x.png 3x'/>등원</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            }
        } else { //하원 row
            if(isToday == true){
                scheduleTable += "<tr class='comingBus'><td class='img_td'><img class='bus_img' src='img/contents-01.png' srcset='img/contents-01@2x.png 2x, img/contents-01@3x.png 3x'/>하원</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            } else {
                scheduleTable += "<tr class='comingBus'><td class='img_td'><img class='bus_img' src='img/contents-01_dim.png' srcset='img/contents-01_dim@2x.png 2x, img/contents-01_dim@3x.png 3x'/>하원</td><td class='time_td'><p class='time'>"+arr[i].time+"</p></td><td class='addr_td'><p class='busid'>"+arr[i].carnum+"호차<img class='live_img' src='img/live.png' align='middle' srcset='img/live@2x.png 2x, img/live@3x.png 3x'/></p><p class='addr'>"+arr[i].addr+"</p></td><td class='goreal_td'><p><img class='arrow_img' src='img/sched-arrow.png' srcset='img/sched-arrow@2x.png 2x, img/sched-arrow@3x.png 3x'/></p></td></tr>";
            }
        }
        if(i==0)
            academy = arr[i].institute_name;
        
        if(i+1 == arr.length)
            scheduleTable += "</table>";
    }// end of for(var i=0; i<arr.length; i++) {
    var childAllDayList = $("div.child.1004").children();
    if(childAllDayList) {
        var isAppend = false;
        var appendingIdx = -1;
        for(var k=0; k<childAllDayList.length; k++) {
            if($(childAllDayList[k]).attr("id") == day) {
                isAppend = true;
                appendingIdx = k;
                break;
            }
        }
    }
    if(isAppend) {
        ret = "<div class='academies'><table class='academy'><tr class='aName'><td class='aName' colspan='4'>"+academy+"<td></tr><tr><td>"+scheduleTable+"</td></tr></table></div>";
        $(childAllDayList[appendingIdx]).append(ret);//.container 끝에 추가
    } else {
        ret = "<div id="+day+" class='container'><div class='academies'><table class='academy'><tr class='aName'><td class='aName' colspan='4'>"+academy+"<td></tr><tr><td>"+scheduleTable+"</td></tr></table></div></div>";
        $("div.child.1004").append(ret);
    }
}

//function requestPermission() {
//    var dev_id = null;
//    if(device != null && device != undefined) {
//        dev_id = device.uuid;
//    }
////    alert("addDeviceInfo start devid:"+dev_id+" recvpush:"+true);
////    'registration_id=token&active=true&type=android&pin_number=pinnum&recvpush=true&device_id=dev_id'
//    $.ajax({
//           url: 'http://mj.edticket.com/fcmdev/addDeviceInfo',
//           type: 'POST',
//           data: $.param({device_id: dev_id, recvpush: true, active: true}),
//           success: function() {
//           window.localStorage.setItem("recvpush", "true");
//           }, error: function() {
////           alert("SERVER ERROR :addDeviceInfo response error");
//           }
//           });
//    $(".pushModal").hide();
//}
//function toDenyPush() {
//    window.localStorage.setItem("recvpush", "false");
//    $(".pushModal").hide();
//}

