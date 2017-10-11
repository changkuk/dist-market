/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

// 가지고 있는 데이터들
//        window.localStorage.setItem("localpin", pin);
//        window.localStorage.setItem("studentInfo", ret.students);
//        window.localStorage.setItem("localuid", localuid);
//        window.localStorage.setItem("localtoken", token);
//        window.localStorage.getItem("recvpush");

//확인해봐야할 것들.
//sid 에 해당 스케쥴이 없어도 list 없이 다른 정보는 getSchedule 에서 주는가
// ios permission 을 YES  를 하고, 설정에서 끄면, 메시지가 안와.
//실시간, 상단 글자를 서버에서 <br/> 붙여서 주면 어떨까?
        if(window.localStorage) {
            var localuid = null;
            localuid = window.localStorage.getItem("localuid");
            if(localuid != null) {
                window.location.replace("tayoschedule.html?restart:true");
            } else {
                window.location.replace("terms.html");
            }
        } else {
            window.location.replace("terms.html");
        }

        console.log('Received Event: ' + id);
    }
};

app.initialize();
