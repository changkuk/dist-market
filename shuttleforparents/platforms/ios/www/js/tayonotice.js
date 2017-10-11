$(document).ready(function(){
//    $("img").click(function(){
//                   var tempsrc = $(this).attr("src");
//                   var tempset = $(this).attr("srcset");
////                   alert(tempsrc + "   " + tempset);
//                   if(tempsrc =="img/list.png") {
//                        tempsrc = "img/list-1.png";
//                        tempset = "img/list-1@2x.png 2x, img/list-1@3x.png 3x"
//                        var grand = $($(this).parent()).parent();
//                        $($(grand).next()).hide();
////                        alert($($(grand).next()).attr("class"));
////                        $($($($(this).parent()).parent()).next()).hide();
//                   } else {
//                        tempsrc = "img/list.png";
//                        tempset = "img/list@2x.png 2x, img/list@3x.png 3x"
//                        $($($($(this).parent()).parent()).next()).show();
//                   }
//                   $(this).attr("src", tempsrc);
//                   $(this).attr("srcset", tempset);
//    });
                  $(function() {
                    $("tr").click(function(){
//                                  alert($(this).attr("notiid"));
                                  });
                    });

});
function getContentNoti(argID) {
        var tempsrc = $("#"+argID).attr("src");
        var tempset = $("#"+argID).attr("srcset");
//        alert(tempsrc + "   " + tempset);
        if(tempsrc =="img/list.png") {
            tempsrc = "img/list-1.png";
            tempset = "img/list-1@2x.png 2x, img/list-1@3x.png 3x"
            var grand = $($("#"+argID).parent()).parent();//<tr>
//            alert($($(grand).next()).attr("class"));
            var trClassName = $($(grand).next()).attr("class");
            if((trClassName == "titletr") || (trClassName == null))
                getServerNoti(argID, grand);
            else if($($(grand).next()).attr("class") == "contenttr")
                $($(grand).next()).show();
        } else {
            tempsrc = "img/list.png";
            tempset = "img/list@2x.png 2x, img/list@3x.png 3x"
            $($($($("#"+argID).parent()).parent()).next()).hide();
        }
        $("#"+argID).attr("src", tempsrc);
        $("#"+argID).attr("srcset", tempset);
}
function getServerNoti(id, grand) {
    $.ajax({url:"https://api.edticket.com/api/getNotice?id="+id,
           success:function(result, status, xhr){
           var ret = JSON.parse(xhr.responseText);
           if (ret.code == 400 || ret.code == 401) {
//                $("#contentnoti").text("파라미터가 유효하지 않습니다.");
                makeContent(ret.msg);
           } else {
//                $("#contentnoti").text(ret.notice.title + ret.notice.content + ret.notice.date);
                makeContent(ret.notice.content, grand, id);
           }
           },
           error:function(status, err) {
//                alert("ajax error : status " + status + " err : " + err);
//                alert("ajax error : status " + status.status + " err : " + err);
           }});
}
function makeContent(contentStr, grand, id) {
    var contentrow = "<tr class='contenttr'><td colspan='2' class='noti'><p class='noti'>"+contentStr+"</p></td></tr>";
    var idx = id-1;
//    grand.eq(idx).after(contentrow);
    $("tr.titletr").eq(idx).after(contentrow);
//    $(contentrow).insertAfter("."+$($(grand).next()).attr("class"));
}
function getNotiList() {
    $.ajax({url:"https://api.edticket.com/api/listNotice",
           success:function(result, status, xhr) {
           var ret = JSON.parse(xhr.responseText);
           if (ret.code == 400) {
//                $("#notilist").text("파라미터가 유효하지 않습니다.");
                makeAlert('파라미터가 유효하지 않습니다.');
           } else {
                var notilist = ret.noticelist;
//                var templist = "";
                for(var i=0; i<notilist.length; i++) {
                    maketitle(notilist[i].id, notilist[i].title, notilist[i].date);
//                    templist += notilist[i].id + notilist[i].title + notilist[i].date;
//                    $("#notilist").text(templist);
                }
                $("tr").click(function(){
                    getContentNoti($(this).attr("notiid"));
                });
           }
           },
                error:function(status, err) {
//                alert("ajax error : status " + status + " err : " + err);
//                alert("ajax error : status " + status.status + " err : " + err);
           }
           });
}
function maketitle(id, title, date) {
    var titlerow = "<tr class='titletr' notiid="+id+"><td class='lefttd'><p class='tdp1'>"+title+"</p><p class='tdp2'>"+date+"</p></td><td class='righttd'><img id="+id+" class='closure' src='img/list.png' srcset='img/list@2x.png 2x, img/list@3x.png 3x'></img></td></tr>"
    var obj = $("#content").last();
    $(obj).append(titlerow);
}
// 페이지 구성 테스트용
//function getNoti() {
//    var htmltext =
////    "<tr class="titletr">
////    <td class="lefttd">
////    <p class="tdp1">셔틀타요 이용자수가 100만을 돌파했습니다!</p>
////    <p class="tdp2">2017.07.03</p>
////    </td>
////    <td class="righttd">
////    <img class="closure" src="img/list.png"
////    srcset="img/list@2x.png 2x, img/list@3x.png 3x">
////    </img>
////    </td>
////    </tr>
////    <tr id="contenttr">
////    <td colspan="2">
////    <p class="noti">애플 창업자 고(故) 스티브 잡스 역시 검정 터틀낵과 리바이스 청바지를즐겨 입었다. 그의 전기에 따르면 잡스는 일본 소니사를 방문했을 당시 직원들이 유니폼을 입는 것을 눈여겨 봤다. 당시 소니 사장으로부터 “유니폼을 제공하자 사원들이 단결하는 계기가 됐다"는 설명을 들었다. 소니의 유니폼을 제작한 디자이너 미야케 잇세이에게 제작을 의뢰해 탄생한 게 검정 터틀낵 셔츠다.
////    
////    넥타이를 벗어 던지고 상품 설명회에 나서는 정보기술(IT) 기업 CEO 등의 간편 복장은 이미 도전과 기회, 그리고 창의 정신의 상징처럼 인식되고 있다.</p>
////    </td>
////    </tr>
//"<tr class='titletr'><td class='lefttd'><p class='tdp1'>셔틀타요 이용자수가 100만을 돌파했습니다!</p><p class='tdp2'>2017.07.03</p></td><td class='righttd'><img class='closure' src='img/list.png' srcset='img/list@2x.png 2x, img/list@3x.png 3x'></img></td></tr>"
//    
////    var obj = $("#content").last();
//    //    if($(obj).attr("id") == "content") {
//    //        $("#content").html(htmltext);
//    //    } else {
//    //    }
//
//    maketitle("셔틀타요 이용자수가 100만을 돌파했습니다","2017.07.03");
//}
