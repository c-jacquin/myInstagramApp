angular.module('fdtd.settings.controllers',['fdtd.login','ionic','ngStorage'])
    .controller('AccountCtrl',function($scope,User,$ionicPopup,$localStorage){
        $scope.resetEnabled = false;
        $scope.user = $localStorage.user;
        $scope.rollSave = $localStorage.config.photoSave;
        $scope.checkPassword = function(old){
            if($localStorage.user.password != old){
                $scope.wrongPass = true;
            }else{
                $scope.wrongPass = false;
            }
        }

        $scope.togglePhotoRoll = function(photoRoll){
            console.log(photoRoll)
            $localStorage.config.photoSave = photoRoll;
        }

        $scope.resetPassword = function(){
            $ionicPopup.show({
                templateUrl: 'password-template.html',
                title: 'Reset your password',
                scope: $scope,
                buttons: [
                    { text: 'Cancel',
                        onTap: function(e) {
                            return true;
                        }
                    },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if(!$scope.wrongPass){
                                var param = {
                                    userId : $localStorage.user._id,
                                    old : $scope.password.old,
                                    new : $scope.password.new
                                }
                                User.resetPasswordAccount($scope.password)
                                    .then(function(data){
                                        $localStorage.user.password = $scope.password.new;
                                        return true;
                                    })
                                    .catch(function(err){
                                        $scope.mess = 'erreur'
                                    })
                            }
                        }
                    }
                ]
            }).then(function(res) {
                console.log('Tapped!', res);
            }, function(err) {
                console.log('Err:', err);
            }, function(msg) {
                console.log('message:', msg);
            });
        }
        $scope.disconnect = function(){
            $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                content: 'Are you sure you want to eat this ice cream?'
            }).then(function(res) {
                if(res) {
                    User.logOut();
                } else {
                    console.log('You are not sure');
                }
            });
        }
    })
    .controller('NotifCtrl',function($scope,User,$ionicPopup,$localStorage){
        var oldConf = angular.copy($localStorage.user.notifConfig)
        if($localStorage.user.notifConfig){
            $scope.notif = $localStorage.user.notifConfig;
        }else{
            $scope.notif = {
                sunrise : true,
                sunset : true,
                phat : true,
                follow : false
            }
        }

        $scope.updateNotif = function(config){
            console.log(config)
            User.notifConfig(config)
                .then(function(data){
                    console.log(data);
                })
                .catch(function(err){
                    $ionicPopup.show({
                        title : 'error',
                        content : 'blabla !!'
                    })
                    $scope.notif = oldConf;
                })
        }
    })
