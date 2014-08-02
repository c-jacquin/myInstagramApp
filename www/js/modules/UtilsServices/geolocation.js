angular.module('myGeoloc',['ngStorage','utils','ionic','fdtd.login'])
    .factory('Geolocation', function(Config, $http, $q, $window,$rootScope,SunCalc,$localStorage) {



        var first = true;

        var service = {
            save : function(geodata){
                geodata.creator = $localStorage.user._id;
                var defered = $q.defer();
                console.log(1)
                $http.post(Config.baseUrl+'/geolocations',geodata)
                    .success(function(data){
                        console.log(data)
                        defered.resolve(data)
                    })
                    .error(function(err){
                        console.log(err)
                        defered.reject(err);
                    })
                return defered.promise;
            },
            getCurrentPosition: function() {
                var defered = $q.defer();
                    $window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            service.position = position;
                            if(first){
                                SunCalc.init(position);
                                first = false;
                            }
                            defered.resolve(position);
                        },
                        function(error) {
                            defered.reject({error: error});

                        },{
                            enableHighAccuracy: true
                        });
                return defered.promise;
            },
            watchPosition: function() {
                $window.navigator.geolocation.watchPosition(
                    function(position) {
                            if(first){
                                SunCalc.init(position);
                                first = false;
                            }
                            position.creator = $localStorage.user._id;
                            service.save(position)
                                .then(function(){
                                    console.log('Geolocation correctly saved and updated : %O');
                                    service.position = position;
                                    $rootScope.$broadcast('$geolocation.position.changed', position);
                                })
                                .catch(function(data){
                                    console.log('Error while updating geodata : %O', err);
                                })
                    },
                    function(error) {
                            service.position = {error: error};
                            $rootScope.$broadcast('$geolocation.position.error', error);

                    }, Config.geolocation);


            },

            clearWatch: function() {
                if(this.watchId) {
                    $window.navigator.geolocation.clearWatch(this.watchId);
                    delete this.watchId;
                }
            },

            position: undefined
        };

        return service;
    })
    .factory('SunCalc', function($http, Config, $window, $interval,$localStorage,$rootScope) {
        console.log('begin init suncalc');
        var service = {
            initiated: false,
            countdown: {
                time: null,
                color: null
            },
            data: null,
            init: function(geodata) {
                console.log('begin init');
                $http.post(Config.baseUrl + '/suncalc',geodata)
                    .success(function (data) {
                        service.data = data;
                        service.data.sunset = new Date(service.data.sunset);
                        service.data.sunriseEnd = new Date(service.data.sunriseEnd);
                        service.initiated = true;
                        service.tickToDuskDawn = function (highResTimestamp) {
                            if (service.isDay()) {
                                service.countdown.time = service.getDuskTime().getTime() - Date.now(); // http://jsperf.com/date-now-vs-new-date-gettime
                            } else {
                                service.countdown.time = service.getDawnTime().getTime() - Date.now(); // http://jsperf.com/date-now-vs-new-date-gettime
                            }

                            // Par défaut, on ne touche pas à la color du timer qui reste blanche dans le CSS (pas d'assertion inutile)

                            // Si la différence est de - de 5 minutes, alors on change en vert ou rouge (selon si on pourra poster ou ne plus poster dans - de 5 minutes)
                            if (service.countdown.time < 300000) { // 300000 ms = 5 minutes
                                service.countdown.color = service.isDay() ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
                            }
                            $rootScope.countdown = service.countdown;
                        };
                        service.isNight = function () {
                            return Date.now() > service.getDuskTime().getTime();
                        };
                        service.isDay = function () {
                            return Date.now() < service.getDuskTime().getTime();
                        };
                        service.getDuskTime = function () {
                            return service.data.sunset;
                        };
                        service.getDawnTime = function () {
                            return service.data.sunriseEnd;
                        };
                        service.setDawnTimeNow = function () {
                            return service.data.sunriseEnd = Date.now();
                        };
                        service.setDuskTimeNow = function () {
                            return service.data.sunset = Date.now();
                        };
                        $interval(service.tickToDuskDawn, 1000);
                    })
                    .error(function (err) {

                    })
            }
        };
        console.log('suncalc loaded');
        return service;

    })
    .factory('Time',function(){
        var service = {
            since : function(date) {
                var seconds = Math.floor((new Date() - Date.parse(date)) / 1000);
                seconds = Math.abs(seconds);
                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes";
                }
                return Math.floor(seconds) + " seconds";
            },
            display : function(){
                $filter('translate')('NAVBAR.UNKNOW_HOUR');
            }
        }
        return service;
    })
