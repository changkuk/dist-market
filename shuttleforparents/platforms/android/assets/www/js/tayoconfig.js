var lpin = null;
$(document).ready(function(){
  try {
      lpin = window.localStorage.getItem("localpin");
      $("td.righttd3").text(lpin);
  } catch(error) {
      lpin = null;
      $("td.righttd3").text("");
  }
    getNoti();
});
//device_id, registration_id,. type, pin_number
function setNoti() {
    if(lpin == null)
        return;
    
//    progressStart();
    m_isFcmReg = false;
    try {
        window.FirebasePlugin.getToken(function(token) {
                                       if(token && m_isFcmReg == false) {
                                           m_isFcmReg = true;
                                           fcm_reg(token);
                                       } else {
                                       }
                                       }, function(error) {
//                                           progressStop();
                                       });
        window.FirebasePlugin.onTokenRefresh(function(token) {
                                             if(token && m_isFcmReg == false) {
                                                 m_isFcmReg = true;
                                                 fcm_reg(token);
                                             } else {
                                             }
                                             }, function(error) {
//                                                 progressStop();
                                             });
    } catch(err) {
//        progressStop();
        makeAlert("E01.설정이 원활히 이루어지지 않았습니다.");
    }
}
function getNoti() {
    try {
        if("true" == window.localStorage.getItem("recvpush")) {
            $("#checkImg").attr("src", "img/on.png");
            $("#checkImg").attr("srcset", "img/on@2x.png 2x, img/on@3x.png 3x");
        } else {
            $("#checkImg").attr("src", "img/off.png");
            $("#checkImg").attr("srcset", "img/off@2x.png 2x, img/off@3x.png 3x");
        }
    } catch(error) {
        $("#checkImg").attr("src", "img/off.png");
        $("#checkImg").attr("srcset", "img/off@2x.png 2x, img/off@3x.png 3x");
    }
}

function fcm_reg(token) {
    try{
        var isrecv = false;
        if(window.localStorage.getItem("recvpush") == "false")
            isrecv = true;

        dev_id = device.uuid;
       dev_platform = device.platform;
       dev_platform = dev_platform.toLowerCase();
       dev_model = device.model;
       dev_version = device.version;
       dev_manufacture = device.manufacturer;
       dev_serial = device.serial;
        var mURL = "https://api.edticket.com/api/getDeviceInfo";
        $.ajax({
           url: mURL,
           method: "POST",
           data: $.param({registration_id:token, pin_number:lpin, recvpush:isrecv, device_id:dev_id}),
           success: function() {
               if(isrecv) {
                   window.localStorage.setItem("recvpush", "true");
                   $("#checkImg").attr("src", "img/on.png");
                   $("#checkImg").attr("srcset", "img/on@2x.png 2x, img/on@3x.png 3x");
               } else {
                   window.localStorage.setItem("recvpush", "false");
                   $("#checkImg").attr("src", "img/off.png");
                   $("#checkImg").attr("srcset", "img/off@2x.png 2x, img/off@3x.png 3x");
               }
//               alert("SUCCESS getDeviceInfo(isrecv, token, pin):"+isrecv+" "+token+" "+lpin);
//               alert("SUCCESS getDeviceInfo(pin):"+lpin);
           },
           error: function() {
               makeAlert("E02.설정이 원활히 이루어지지 않았습니다..");
           }
       });
    } catch(err) {
        makeAlert("E03.설정이 원활히 이루어지지 않았습니다...");
    }
//    progressStop();
}

