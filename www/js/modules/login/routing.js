angular.module('fdtd.login',['fdtd.login.controllers','fdtd.login.services','ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('login',{
                url: "/login",
                abstract: true,
                templateUrl: "js/modules/login/templates/loginNavbar.tpl.html",
                controller : 'LoginCtrl'
            })
            .state('login.signup', {
                url: '/signup',
                views: {
                    'loginContent' :{
                        templateUrl: 'js/modules/login/templates/signup.tpl.html',
                        controller : 'SignUpCtrl'
                    }
                }
            })
            .state('login.signin', {
                url: '/',
                views: {
                    'loginContent' :{
                        templateUrl: 'js/modules/login/templates/signin.tpl.html',
                        controller: 'SignInCtrl'
                    }
                }
            })
            .state('login.termsandprivacy', {
                url: '/termsandprivacy',
                views: {
                    'loginContent' :{
                        templateUrl: 'js/modules/settings/templates/termsandprivacy.tpl.html'
                    }
                }
            })
    })
    .run(function(){

    })