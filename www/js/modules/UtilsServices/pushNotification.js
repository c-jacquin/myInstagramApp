angular.module('pushNotif',['utils','ngStorage'])
    .service('Apn',function($window,$q,$http,Config,$localStorage,$ionicPopup){
        var notification = new PushNotification();

        function onNotificationAPN (event) {
            console.log(event);
            if ( event.alert )
            {
                $ionicPopup.alert({
                    title : 'notif !!! ',
                    content : 'ah yeeaahhh !!! '
                })
            }

            if ( event.sound )
            {
                var snd = new Media(event.sound);
                snd.play();
            }

            if ( event.badge )
            {
                Notification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
            }
        }

        function successHandler (result) {
            console.log('result = ' + result);
        }

        function errorHandler (error) {
            alert('error = ' + error);
        }

        notification = window.plugins.pushNotification;
        var service = {
            register : function() {
                var defered = $q.defer();
                console.log('start register notif', notification)
                notification.register(function (token) {
                    console.log('token',token)
                    $http.post(Config.baseUrl+'/apn/token',{ token : token})
                        .success(function(data){
                            console.log('success : data')
                            defered.resolve(data);
                        })
                        .error(function(err){
                            console.error('erreur ici',err);
                            defered.reject(err);
                        })
                }, function (err) {
                    console.log('erreur la !!!!!',err);
                    defered.reject(err);
                }, {"alert": true, "badge": true, "sound": true, "ecb": "onNotificationAPN"});
                return defered.promise;
            }
        }
        return service;
    })