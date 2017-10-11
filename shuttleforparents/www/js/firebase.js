//test
//var config = {
//    apiKey: "AIzaSyBjZonpI_zEjjvGki0FbAoy7kXdh4Jivw0",
//    authDomain: "tayo-f698c.firebaseapp.com",
//    databaseURL: "https://tayo-f698c.firebaseio.com",
//    projectId: "tayo-f698c",
//    storageBucket: "tayo-f698c.appspot.com",
//    messagingSenderId: "981510980022"
//};
//
//실서버 firebase database
var config = {
apiKey: "AIzaSyAiLvxNKKkBrVkcrYsTMKdNDtaDqhai1Zg",
authDomain: "Shuttle4Parent.firebaseapp.com",
databaseURL: "https://Shuttle4Parent.firebaseio.com",
projectId: "Shuttle4Parent",
messagingSenderId: "383793938645"
};

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
var fbApp = firebase.initializeApp(config);
var fcmRef = firebase.database();


//function changeStyle() {
//    $(".btn").css("background-color", "#5473ff");
//    $("input").attr("placeholder", "");
//    $("input").css("color", "#333333");
//}

// sid, aid : 1~N개 가능.
//"http://test.edticket.com/api/getStudentInfo"
//"http://curtis-tayotayo.edticket.com/api/getStudentInfo"
//"http://api.edticket.com/api/getStudentInfo"
//{grade: 0, aid: 3, pin: "5E34ED23F5", phone: 1085457878, sid: 1341}
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

var dbuid = null;
var g_from = null; //0 첫 구동 root, 1 main page = 주간스케쥴
var m_pin = null;
var m_studArray = null;
var progressId = null;


function goLogin(in_pin, in_from) {
    m_pin = in_pin;
    g_from = in_from;
        
//    var mURL = "http://api.edticket.com/api/getStudentInfo";
    var mURL = "https://api.edticket.com/api/getStudentInfo";

    $.ajax({url:mURL,
           method: "POST",
           data: $.param({pin_number:m_pin}),
           success:function(result, status, xhr){
                var ret = JSON.parse(xhr.responseText);
                if(ret.code == 400 || ret.code == 401) {
                    if(g_from == 1) {//시작이 main 인경우, 주간스케쥴, 근데 에러가 나면 다시 auth.html 로
                        showPinModal();
                        window.localStorage.clear();
                    } else {
                        makeAlert('유효하지 않은 PIN 번호입니다.');
                    }
                } else {
                    try{
//                        m_pin = in_pin;
                        m_studArray = ret.students;
                        progressStart();
                        if(g_from == 0)
                            getPushToken(m_pin);
                        else
                            siginInFirebase(m_studArray);
           
//                        alert("START onNotificationOpen()");
//                        window.FirebasePlugin.onNotificationOpen(function(notification) {
//                            if(notification.body != null && notification.body != undefined)
//                                makeAlert(notification.body);
////                            alert("START onNotificationOpen() :: "+ notification.body+", "+notification.title+", "+notification.icon);
//                            }, function(error) {
//                                console.error(error);
//                                alert("ERROR onNotificationOpen() :: " + error);
//                            });

                    } catch(err) {//window.localStorage error
                    }
           
                }
           },
           error:function(status, err) {
                makeAlert('정확한 핀번호가 아닙니다. 관리자에게 문의하세요.');
           }
           });
}

var progressId = null;
function progressStart() {
    $("div.loadingimg").css("left", $("div.progressContent").offset().left+32);
    $(".progressModal").show();
    progressId = setInterval(frame, 400);
    function frame() {
        if ($("div.loadingimg").offset().left > $("div.progressContent").width()-82) {
            $("div.loadingimg").css("left", $("div.progressContent").offset().left);
        } else {
            $("div.loadingimg").css("left", $("div.loadingimg").offset().left + 1);
        }
    }
}

function progressStop() {
//    alert("STOP progressStop :: id :"+progressId);
    if(progressId) {
        clearInterval(progressId);
        progressId = null;
    }
    $(".progressModal").hide();
}

var g_isSiginInFirebase = false;
function siginInFirebase(in_array) {
    try {
//    alert("START signInAnonymously()::");
    firebase.auth().signInAnonymously().catch(function(error) {
                                        progressStop();
                                              makeAlert('F01.인증요청이 실패했습니다. 셔틀타요에 문의하세요.');
                                          var errorCode = error.code;
                                          var errorMessage = error.message;
                                          ret_value = false;
                                          });
//    alert("START get current user");
    if (firebase.auth().currentUser) {
//        var us = firebase.auth().currentUser;
//        alert("user uid:"+us.uid+" user token: "+us.refreshToken);
        g_isSiginInFirebase = true;
        saveFirebaseDatabase(in_array, firebase.auth().currentUser);
    }
    
//    alert("onAuthStateChanged() start");
    firebase.auth().onAuthStateChanged(function(user) { //어떤때 들어올까. 2번 들어오는데...
        if (user && g_isSiginInFirebase == false) {
//            alert("user uid:"+user.uid+" user token: "+user.refreshToken);
            g_isSiginInFirebase = true;
            saveFirebaseDatabase(in_array, firebase.auth().currentUser);
        }
    });
    } catch(err) {
        progressStop();
        makeAlert('F02.인증요청이 실패했습니다. 셔틀타요에 문의하세요..');
    }
}

// json web token
function saveFirebaseDatabase(in_array, user) {
//    alert("storage save start");
    var localuid = user.uid;
    var token = user.refreshToken;
    
//    alert("DB save get device info start");
    var ret_value = true;
    var _ref = firebase.database().ref('users/'+localuid);
    var deviceos = null;
    try {
        deviceos = window.device.platform;
    } catch(err) {
//        alert("DB save device plugin err");
        var ua = (navigator.userAgent).indexOf("Android");
        if(ua < 0) {
            ua = (navigator.userAgent).indexOf("iPhone");
            if(ua < 0) {
                ua = (navigator.userAgent).indexOf("iPad");
                if(ua >= 0) deviceos = "iOS";
            } else deviceos = "iOS";
        } else deviceos = "Android";
    }
//    alert("DB save start");

    if(deviceos) {
        _ref.set({pin_number:window.localStorage.getItem("localpin"), token:token, os:deviceos, students:in_array}).catch(function(err) {
            var errorCode = err.code;
            var errorMessage = err.message;
            progressStop();
            makeAlert('F03.등록되지 않은 사용자입니다.');
            ret_value = false;
        });
    } else {
        _ref.set({pin_number:window.localStorage.getItem("localpin"), token:token, os:"unknown", students:in_array}).catch(function(err) {
            var errorCode = err.code;
            var errorMessage = err.message;
            progressStop();
            makeAlert('F04.등록되지 않은 사용자입니다.');
            ret_value = false;
        });
    }
    
//    alert("progressStop()");
    progressStop();
    
    if(ret_value) {
        try{
            window.localStorage.setItem("localuid", localuid);
            window.localStorage.setItem("localtoken", token);
            window.localStorage.setItem("localpin", m_pin);
            if(in_array && in_array.length) {
                window.localStorage.setItem("studentInfo", JSON.stringify(in_array));
            } else {
                window.localStorage.setItem("studentInfo", in_array); //null
            }
        } catch(err) { //storage err
            makeAlert('B01.정보입력에 실패했습니다. 원활한 사용을 할 수 없습니다.');
        }
    }

    if(g_from == 0) {
//        alert("주간스케쥴 이동");
        window.location.replace("tayoschedule.html?restart:false");
    } else {
        studentArray = JSON.parse(window.localStorage.getItem("studentInfo"));
        makeChildContainer();
        makeChildButton();
        getSchedule();
    }

// 굳이 저장하고 매번 가져오지 말고, 프로그램 동작중 필요할때만 가져오자.
//    if(ret_value) {
//        alert("saveFirebaseDatabase::start getFirebaseDB");
//        getFirebaseDB();
//    }
}


// 이건 프로그램 동작중 필요할때만 부르자.
function getFirebaseDB() {
    //_ref.key; // uid
    var _ref = firebase.database().ref('users/'+window.localStorage.getItem("localuid"));
    var fcmresult = _ref.on("value").then(function(snapshot){
                                          dbuid = snapshot.val();
                                          studentArray = dbuid.students;
                                          if(studentArray != null && studentArray.length) {
                                                makeChildContainer();
                                                makeChildButton();
                                                getSchedule();
                                          }
                                          });
    //  if(window.localStorage.getItem("issetpush") == null)
    //    getPushToken(exArray);
}

function fcm_reg(isrecv, token, pin) {
//    alert("START fcm_reg(isrecv, token, pin):"+isrecv+" "+token+" "+pin);
    try{
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
               data: $.param({
                             name: null,
                             registration_id: token,
                             device_id: dev_id,
                             type: dev_platform,
                             model: dev_model,
                             version: dev_version,
                             serial: dev_serial,
                             manufacture: dev_manufacture,
                             recvpush: isrecv,
                             pin_number: pin
                             }),
               success: function() {
                   console.log("success");
                   if(isrecv)
                       window.localStorage.setItem("recvpush", "true");
                   else
                       window.localStorage.setItem("recvpush", "false");
                   siginInFirebase(m_studArray);
               },
               error: function() {
                   progressStop();
                   makeAlert("S01.등록에 실패했습니다. 잠시후 다시 이용해주세요.");
               }
               });
    } catch(err) {
        progressStop();
        makeAlert("S02.등록에 실패했습니다. 셔틀타요에 문의하세요.");
    }
}

// 서버 필수 데이터 device_id, registration_id,. type, pin_number 
m_isFcmReg = false;
function getPushToken(pin) {
    try {
//    alert("START grantPermission()");
    window.FirebasePlugin.grantPermission();
    var isrecv = true;

//    alert("FirebasePlugin.getToken() start");
    window.FirebasePlugin.getToken(function(token) {
        // save this server-side and use it to push notifications to this device
        if(token && m_isFcmReg == false) {
//            alert("FirebasePlugin.getToken() :" +token);
            window.FirebasePlugin.hasPermission(function(data){
                                                isrecv = data.isEnabled;
//                                                alert("hasPermission() :" +data.isEnabled);
                                                });
           m_isFcmReg = true;
           fcm_reg(isrecv, token, pin);
        } else {
//           alert("FirebasePlugin.onTokenRefresh() : token null");
        }
    }, function(error) {
        progressStop();
        makeAlert("F05.푸쉬등록에 실패했습니다. 다시 시도해주세요.");
//        alert("FirebasePlugin.getToken() :" +error);
    });
    
//    alert("FirebasePlugin.onTokenRefresh() start");
    window.FirebasePlugin.onTokenRefresh(function(token) {
        // save this server-side and use it to push notifications to this device
        if(token && m_isFcmReg == false) {
//            alert("FirebasePlugin.onTokenRefresh() :" +token);
            window.FirebasePlugin.hasPermission(function(data){
                                                isrecv = data.isEnabled;
//                                                alert("hasPermission() :" +data.isEnabled);
                                                });
            m_isFcmReg = true;
             fcm_reg(isrecv, token, pin);
        } else {
//            alert("FirebasePlugin.onTokenRefresh() : token null");
        }
    }, function(error) {
        progressStop();
        makeAlert("F06.푸쉬등록에 실패했습니다. 다시 시도해주세요..");
//        alert("FirebasePlugin.onTokenRefresh() :" +error);
    });
    } catch(err) {
        progressStop();
        makeAlert("F07.푸쉬등록에 실패했습니다. 다시 시도해주세요...");
//        alert("push 설정 오류");
    }
}
//App is in foreground:
//User receives the notification data in the JavaScript callback without any notification on the device itself (this is the normal behaviour of push notifications, it is up to you, the developer, to notify the user)
//App is in background:
//User receives the notification message in its device notification bar
//User taps the notification and the app opens
//User receives the notification data in the JavaScript callback


//---------------------------------------------------
// firebase-message 관련
//---------------------------------------------------
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
//importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// [START get_messaging_object]
// Retrieve Firebase Messaging object.
//const messaging = firebase.messaging();
// [END get_messaging_object]

// [START refresh_token]
// Callback fired if Instance ID token is updated.
//messaging.onTokenRefresh(function() {
//                         messaging.getToken()
//                         .then(function(refreshedToken) {
//                               alert('Token refreshed.');
//                               // Indicate that the new Instance ID token has not yet been sent to the
//                               // app server.
//                               setTokenSentToServer(false);
//                               // Send Instance ID token to app server.
//                               sendTokenToServer(refreshedToken);
//                               // [START_EXCLUDE]
//                               // Display new Instance ID token and clear UI of all previous messages.
//                               resetUI();
//                               // [END_EXCLUDE]
//                               })
//                         .catch(function(err) {
//                                alert('Unable to retrieve refreshed token ' +err);
//                                });
//                         });
// [END refresh_token]

//function requestPermission() {
//    console.log('Requesting permission...');
//    // [START request_permission]
//    messaging.requestPermission()
//    .then(function() {
//          alert('Notification permission granted.');
//          // TODO(developer): Retrieve an Instance ID token for use with FCM.
//          // [START_EXCLUDE]
//          // In many cases once an app has been granted notification permission, it
//          // should update its UI reflecting this.
//          resetUI();
//          // [END_EXCLUDE]
//          })
//    .catch(function(err) {
//           alert('Unable to get permission to notify.' + err);
//           });
//    // [END request_permission]
//}

// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a sevice worker
//   `messaging.setBackgroundMessageHandler` handler.
//messaging.onMessage(function(payload) {
//                    alert("Message received. ", payload);
//                    // [START_EXCLUDE]
//                    // Update the UI to include the received message.
//                    alert(JSON.stringify(payload, null, 2));
//                    // [END_EXCLUDE]
//                    });
// [END receive_message]
//function resetUI() {
//    alert('loading...');
//    // [START get_token]
//    // Get Instance ID token. Initially this makes a network call, once retrieved
//    // subsequent calls to getToken will return from cache.
//    messaging.getToken()
//    .then(function(currentToken) {
//          if (currentToken) {
//          sendTokenToServer(currentToken);
//          updateUIForPushEnabled(currentToken);
//          } else {
//          // Show permission request.
//          alert('No Instance ID token available. Request permission to generate one.');
//          // Show permission UI.
//          updateUIForPushPermissionRequired();
//          setTokenSentToServer(false);
//          }
//          })
//    .catch(function(err) {
//           alert('An error occurred while retrieving token. '+ err);
//           setTokenSentToServer(false);
//           });
//}
// [END get_token]

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
//function sendTokenToServer(currentToken) {
//    if (!isTokenSentToServer()) {
//        alert('Sending token to server...');
//        // TODO(developer): Send the current token to your server.
//        setTokenSentToServer(true);
//    } else {
//        alert('Token already sent to server so won\'t send it again ' +
//                    'unless it changes');
//    }
//}
//function isTokenSentToServer() {
//    alert('get localstorage');
////    return window.localStorage.getItem('sentToServer') == 1;
//}
//function setTokenSentToServer(sent) {
//    alert('set localstorage');
////    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
//}
//function showHideDiv(divId, show) {
//    const div = document.querySelector('#' + divId);
//    if (show) {
//        div.style = "display: visible";
//    } else {
//        div.style = "display: none";
//    }
//}
//function requestPermission() {
//    alert('Requesting permission...');
//    // [START request_permission]
//    messaging.requestPermission()
//    .then(function() {
//          alert('Notification permission granted.');
//          // TODO(developer): Retrieve an Instance ID token for use with FCM.
//          // [START_EXCLUDE]
//          // In many cases once an app has been granted notification permission, it
//          // should update its UI reflecting this.
//          resetUI();
//          // [END_EXCLUDE]
//          })
//    .catch(function(err) {
//           alert('Unable to get permission to notify.'+err);
//           });
//    // [END request_permission]
//}




//function deleteToken() {
//    // Delete Instance ID token.
//    // [START delete_token]
//    messaging.getToken()
//    .then(function(currentToken) {
//          messaging.deleteToken(currentToken)
//          .then(function() {
//                console.log('Token deleted.');
//                setTokenSentToServer(false);
//                // [START_EXCLUDE]
//                // Once token is deleted update UI.
//                resetUI();
//                // [END_EXCLUDE]
//                })
//          .catch(function(err) {
//                 console.log('Unable to delete token. ', err);
//                 });
//          // [END delete_token]
//          })
//    .catch(function(err) {
//           console.log('Error retrieving Instance ID token. ', err);
//           });
//}
//// Add a message to the messages element.
//function appendMessage(payload) {
//    const messagesElement = document.querySelector('#messages');
//    const dataHeaderELement = document.createElement('h5');
//    const dataElement = document.createElement('pre');
//    dataElement.style = 'overflow-x:hidden;'
//    dataHeaderELement.textContent = 'Received message:';
//    dataElement.textContent = JSON.stringify(payload, null, 2);
//    messagesElement.appendChild(dataHeaderELement);
//    messagesElement.appendChild(dataElement);
//}

//function updateUIForPushEnabled(currentToken) {
//    alert(currentToken);
//}
//function updateUIForPushPermissionRequired() {
//    $(".pinModal").show();
//}
//resetUI();

//
//function siginIn(aid, sid, phone, grade, pin_number){
//    // [인증이 안됐던 이유]: firebase-app.js 링크를 걸지 않아서 firebase초기화가 이루어지지 않음.
//    // 아래 사항들은 한번 논의하여 정하고 가면 좋을 것 같습니다.
//    //---------------------------------------------
//    // 1. 익명인증에 성공했으니, 이제 토큰인증을 해야하지 않을까?
//    // 고유 부모 pin 값으로 서버에 요청을 했다. 서버에서 sid, uid, phone, grade 를 가지고 인증을 시도해야하겠다.
//    // 2. 새로운 폰으로 실행하면 핀값을 넣어야한다. 저장된 핀 값이 없으니까.(이경우 폰번호만으로 핀을 요구할 수는 없지 않은가)
//    // 3. 저장되어야 할 값은? 자동 인증을 처리하는데 필요한 값?
//    //      pin (부모가 받은 고유번호)
//    //      uid (회사 서버로 부터 받은 unique 한 값)
//    //      sid (?)
//    // 4. firebase 의 토큰은 기간만료가 있다는데 우리가 사용하는 값에는 없나?
//    // 5. 아빠/엄마 2명이 동일한 pin을 사용하겠지? 이 경우 동일한 pin에 몇개의 유효한 데이터를 연결할지 정해졌나? 토큰은?
//    // 6. 앱은 sid, uid, phone, grade 를 가지고 어떤 작업을 해야할까....
//    //      phone 번호의 비교?
//    //      grade 별 클라이언트 추가 구현이 있을까?
//    var ret_value = true;
//    firebase.auth().signInAnonymously().catch(function(error) {
//        // Handle Errors here.
//        var errorCode = error.code;
//        var errorMessage = error.message;
//        ret_value = false;
//        // …
////        console.log(firebase.auth().currentUser)
//        });
//    if(firebase.auth().currentUser) {
//        var localuid = firebase.auth().currentUser.uid;
//        var token = null;
//        if(window.localStorage) {
////            window.localStorage;
////            localStorage.clear();
//            window.localStorage.setItem("localuid", localuid);
//            window.localStorage.setItem("localsid", sid);
//            window.localStorage.setItem("localpin", pin_number);
//            window.localStorage.setItem("localtoken", firebase.auth().currentUser.refreshToken);
////            alert(window.localStorage.getItem("sessionuid")+window.localStorage.getItem("sessiontoken"));
////            alert(window.localStorage.getItem("localuid"));
//            localuid = window.localStorage.getItem("localuid");
//            token = window.localStorage.getItem("localtoken");
//        }
//
////        var os = window.device.platform;
////        fcmRef.ref('users/' + uid).set({sid:sid, aid:aid, phone:phone, grade:grade,
////                                       pin_number:pin_number, token:token, os:os}).catch(function(err) {
////                                                                var errorCode = err.code;
////                                                                var errorMessage = err.message;
////                                                                                         });
//        var _ref = firebase.database().ref('users/'+localuid);
//        var deviceos = null;
//        try {
//            deviceos = window.device.platform;
//        } catch(err) {
//            var ua = (navigator.userAgent).indexOf("Android");
//            if(ua < 0) {
//                ua = (navigator.userAgent).indexOf("iPhone");
//                if(ua < 0) {
//                    ua = (navigator.userAgent).indexOf("iPad");
//                    if(ua >= 0)
//                        deviceos = "iPad";
//                } else
//                    deviceos = "iPhone";
//            } else
//                deviceos = "Android";
//        }
//        if(deviceos) {
//            _ref.set({sid:sid, aid:aid, phone:phone, grade:grade, pin_number:pin_number, token:token, os:deviceos}).catch(function(err) {
//                            var errorCode = err.code;
//                            var errorMessage = err.message;
//                            alert(err.code + err.message + '\n' + "등록되지 않은 사용자입니다.");
//ret_value = false;
//});
//        } else {
//            _ref.set({sid:sid, aid:aid, phone:phone, grade:grade, pin_number:pin_number, token:token, os:"unknown"}).catch(function(err) {
//                            var errorCode = err.code;
//                            var errorMessage = err.message;
//                            alert(err.code + err.message + '\n' + "등록되지 않은 사용자입니다.");
//                                                                                                                           ret_value = false;
//                            });
//        }
//        var dbuid = null;
//        //_ref.key; // uid
//        var fcmresult = _ref.once("value").then(function(snapshot){
//                                dbuid = snapshot.val();
//                                  });
////data 형태
////users/uid :{ sid:sid, phone:phone, grade:grade, pin_number: pin_number, token:token }
//        
//// dbuid = {aid: 3, grade: 0, os: "Android", phone: 1085457878, pin_number: "5E34ED23F5", …}
//        _ref.on("value", function(snapshot) {
//                dbuid = snapshot.val();
//               }, function (errorObject) {
//                alert(err.code + err.message + '\n' + "[FCM]등록되지 않은 사용자입니다.");
//               console.log("The read failed: " + errorObject.code);
//                ret_value = false;
//               });
//    } else
//        ret_value = false;
//    return ret_value;
//}
