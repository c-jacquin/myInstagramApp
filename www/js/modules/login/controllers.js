angular.module('fdtd.login.controllers',['ionic','myGeoloc','ui.router'])
    .controller('LoginCtrl',function($scope,SunCalc){
        $scope.time = SunCalc;
    })
    .controller('SignInCtrl',function($scope,User,$ionicPopup,$location){

        $scope.signIn = function(user){

            user.pseudo = angular.lowercase(user.pseudo);
            User.signIn(user)
                .then(function(data){
                    $ionicPopup.alert({
                        title : 'Success',
                        content : 'Welcome FDTD ' + data.email + ' !'
                    }).then(function(){
                        $location.path('fdtd/gallery')
                    })
                })
                .catch(function(err){
                    $ionicPopup.alert({
                        title : 'Error',
                        content : err.message
                    })
                })
        };
        $scope.rememberMyPassword = function() {
            $scope.data = {}

            $ionicPopup.prompt({
                title: 'Reset Password',
                subTitle : 'Enter your email adress in order to reset yout password',
                inputType: 'email',
                inputPlaceholder: 'Your email'
            }).then(function(res) {
                console.log(res)
                if(res){
                    User.resetPassword(res)
                        .then(function (data) {
                            $scope.mess = 'passwordReseted';
                            return true;
                        })
                        .catch(function (err) {
                            $scope.mess = err.message
                            return true;
                        })
                }
            });
        };




    })
    .controller('SignUpCtrl',function($scope,User,$location,$ionicPopup){
        $scope.signUp = function(user){
            console.log(user)
            user.pseudo = angular.lowercase(user.pseudo);
            User.signUp(user)
                .then(function(user){
                    $ionicPopup.alert({
                        title : 'Success',
                        content :'Welcome FDTD ' + user.email + ' !'
                    }).then(function(){
                        $location.path('/fdtd/gallery');
                    })
                })
                .catch(function(err){
                    $ionicPopup.alert({
                        title : 'Oops',
                        content :err.message
                    })
                })
        }

        $scope.isAdult = function(birthDate){
            var now 	= new Date();
            var date 	= new Date(birthDate);
            var old 	= new Date(now.getFullYear()-21, now.getMonth(), now.getDate());
            $scope.isAdult = date.getTime()<old.getTime();
            return date.getTime()<old.getTime();
        }
    });