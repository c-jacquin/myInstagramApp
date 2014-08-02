angular.module('utils',['ngStorage'])
    .constant('Config',{
        baseUrl : 'https://fdtd.herokuapp.com',
        //baseUrl : 'http://127.0.0.1:5000',
        pagination : {
            limit : 30
        },
        geolocation : {
            frequency: 30 * 60 * 1000,
            maximumAge: 1000 * 60 * 60,
            timeout: 1000 * 5000,
            enableHighAccuracy: true
        },
        initPosts :{
            featured : true,
            now : true
        }
    })
    .service('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    })
    .service('DataUri',function(){
        return {
            toBlob : function(dataUri, type){
                var binary = atob(dataUri); //dataURI.split(',')[1]
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type:type});
            }
        }
    })
    .service('BasicHttpAuth', function (Base64, $localStorage, $http) {
        // initialize to whatever is in the cookie, if anything
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.authdata;

        return {
            setCredentials: function (username, password) {

                console.log('set credentials',username,password);
                var encoded = Base64.encode(username + ':' + password);
                $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
                $localStorage.authdata = encoded;
            },
            clearCredentials: function () {
                document.execCommand("ClearAuthenticationCache");
                delete $localStorage.authdata;
                delete $localStorage.user;
                $http.defaults.headers.common.Authorization = 'Basic ';
            }
        };
    })
    .service('MyDate',function(){
        return  {
            getNiceTime : function(fromDate, toDate, levels, prefix)
        {
            var lang = {
                    "date.past": "{0} ago",
                    "date.future": "in {0}",
                    "date.now": "now",
                    "date.year": "{0} year",
                    "date.years": "{0} years",
                    "date.years.prefixed": "{0} years",
                    "date.month": "{0} month",
                    "date.months": "{0} months",
                    "date.months.prefixed": "{0} months",
                    "date.day": "{0} day",
                    "date.days": "{0} days",
                    "date.days.prefixed": "{0} days",
                    "date.hour": "{0} hour",
                    "date.hours": "{0} hours",
                    "date.hours.prefixed": "{0} hours",
                    "date.minute": "{0} minute",
                    "date.minutes": "{0} minutes",
                    "date.minutes.prefixed": "{0} minutes",
                    "date.second": "{0} second",
                    "date.seconds": "{0} seconds",
                    "date.seconds.prefixed": "{0} seconds"
                },
                langFn = function (id, params) {
                    var returnValue = lang[id] || "";
                    if (params) {
                        for (var i = 0; i < params.length; i++) {
                            returnValue = returnValue.replace("{" + i + "}", params[i]);
                        }
                    }
                    return returnValue;
                },
                toDate = toDate ? toDate : new Date(),
                diff = fromDate - toDate,
                past = diff < 0 ? true : false,
                diff = diff < 0 ? diff * -1 : diff,
                date = new Date(new Date(1970, 0, 1, 0).getTime() + diff),
                returnString = '',
                count = 0,
                years = (date.getFullYear() - 1970);
            if (years > 0) {
                var langSingle = "date.year" + (prefix ? "" : ""),
                    langMultiple = "date.years" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (years > 1 ? langFn(langMultiple, [years]) : langFn(langSingle, [years]));
                count++;
            }
            var months = date.getMonth();
            if (count < levels && months > 0) {
                var langSingle = "date.month" + (prefix ? "" : ""),
                    langMultiple = "date.months" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (months > 1 ? langFn(langMultiple, [months]) : langFn(langSingle, [months]));
                count++;
            } else {
                if (count > 0)
                    count = 99;
            }
            var days = date.getDate() - 1;
            if (count < levels && days > 0) {
                var langSingle = "date.day" + (prefix ? "" : ""),
                    langMultiple = "date.days" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (days > 1 ? langFn(langMultiple, [days]) : langFn(langSingle, [days]));
                count++;
            } else {
                if (count > 0)
                    count = 99;
            }
            var hours = date.getHours();
            if (count < levels && hours > 0) {
                var langSingle = "date.hour" + (prefix ? "" : ""),
                    langMultiple = "date.hours" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (hours > 1 ? langFn(langMultiple, [hours]) : langFn(langSingle, [hours]));
                count++;
            } else {
                if (count > 0)
                    count = 99;
            }
            var minutes = date.getMinutes();
            if (count < levels && minutes > 0) {
                var langSingle = "date.minute" + (prefix ? "" : ""),
                    langMultiple = "date.minutes" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (minutes > 1 ? langFn(langMultiple, [minutes]) : langFn(langSingle, [minutes]));
                count++;
            } else {
                if (count > 0)
                    count = 99;
            }
            var seconds = date.getSeconds();
            if (count < levels && seconds > 0) {
                var langSingle = "date.second" + (prefix ? "" : ""),
                    langMultiple = "date.seconds" + (prefix ? ".prefixed" : "");
                returnString += (count > 0 ? ', ' : '') + (seconds > 1 ? langFn(langMultiple, [seconds]) : langFn(langSingle, [seconds]));
                count++;
            } else {
                if (count > 0)
                    count = 99;
            }
            if (prefix) {
                if (returnString == "") {
                    returnString = langFn("date.now");
                } else if (past)
                    returnString = langFn("date.past", [returnString]);
                else
                    returnString = langFn("date.future", [returnString]);
            }
            return returnString;
        },
            calc_age : function(birthdate){
                var actu = new Date(),
                    birthDate = new Date(birthdate),
                    day = null,
                    mois = null,
                    ans = null,
                    jours = null;
                console.log(actu, birthdate)

                if((actu.getMonth()+1) >= birthDate.getMonth()){
                    if((actu.getMonth()+1)==birthDate.getMonth()){
                        if(actu.getDate()>=birthDate.getDay()){
                            mois=(actu.getMonth()+1)-birthDate.getMonth();
                            ans=actu.getFullYear()-birthDate.getYear();
                        }
                        else{
                            mois=(12-birthDate.getMonth())+(actu.getMonth()+1);
                            ans=actu.getFullYear()-year-1;
                        }
                    }else{
                        mois=(actu.getMonth()+1)-birthDate.getMonth();
                        ans=actu.getFullYear()-birthDate.getYear();
                    }
                }else{
                    mois=(12-birthDate.getMonth)+(actu.getMonth()+1);
                    ans=actu.getFullYear()-birthDate.getYear()-1;
                }if(actu.getDate()>day){
                    jours=actu.getDate()-day;
                }else{
                    jours=(30-day)+(actu.getDate());
                }
                while(jours>30){
                    jours-=30;
                    mois+=1;
                }
                while(mois>12){
                    mois-=12;
                    ans+=1;
                }
                return ans.toString();
            }
        }

    })


