angular.module('fdtd.activity',['fdtd.activity.controllers','fdtd.activity.services'])
    .config(function($stateProvider){

        $stateProvider
            .state('fdtd.activity', {
                url: '/activity',
                views: {
                    'menuContent' :{
                        templateUrl: 'js/modules/activity/templates/activity.tpl.html',
                        controller: 'ActivityCtrl'
                    }
                }
            })
    })
