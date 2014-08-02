angular.module('fdtd.profile',['fdtd.profile.controllers','ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('fdtd.profile', {
                url: '/profile',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/profile/templates/profile.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('fdtd.followers', {
                url: '/followers',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/profile/templates/followers.tpl.html',
                        controller: 'FollowerCtrl'
                    }
                }
            })
            .state('fdtd.user-profile', {
                url: '/user-profile/:userId',
                resolve : {
                    'myUser' : function(User,$stateParams){
                        return User.getById($stateParams.userId)
                    }
                },
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/profile/templates/user-profile.tpl.html',
                        controller: 'UserProfileCtrl'
                    }
                }

            })
            .state('fdtd.change-profile', {
                url: '/change-profile',
                views : {
                    'menuContent' :{
                        templateUrl: 'js/modules/profile/templates/edit-profile.tpl.html',
                        controller: 'editProfileCtrl'
                    }
                }
            });

    })