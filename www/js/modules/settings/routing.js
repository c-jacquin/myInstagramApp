angular.module('fdtd.settings',['fdtd.settings.controllers','ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('fdtd.settings', {
                url: '/settings',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/settings/templates/settings.tpl.html'
                    }
                }
            })
            .state('fdtd.faq', {
                url: '/settings/faq',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/settings/templates/faq.tpl.html'
                    }
                }
            })
            .state('fdtd.termsandprivacy', {
                url: '/settings/termsandprivacy',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/settings/templates/termsandprivacy.tpl.html'
                    }
                }
            })
            .state('fdtd.notifications', {
                url: '/settings/notifications',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/settings/templates/notifications.tpl.html',
                        controller : 'NotifCtrl'
                    }
                }
            })
            .state('fdtd.account', {
                url: '/settings/account',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/settings/templates/account.tpl.html',
                        controller : "AccountCtrl"
                    }
                }
            })
    })
    .run(function(){

    })