//utility global methods

// Fdtd 1.0 with ionic Framework
angular.module('fdtd', ['ionic', 'fdtd.settings', 'fdtd.gallery', 'fdtd.login', 'fdtd.profile', 'utils', 'myGeoloc', 'fdtd.camera', 'ngTouch',
    'angular-gestures', 'ui.router', 'pushNotif','fdtd.search','fdtd.activity','ui.route','xc.indexedDB','pasvaz.bindonce'])

    .config(function($locationProvider, $httpProvider, $sceProvider, $stateProvider, $urlRouterProvider,$indexedDBProvider) {
        "use strict";

        $sceProvider.enabled(false);

        $httpProvider.defaults.useXDomain = true;
        //        delete $httpProvider.defaults.headers.common['Access-Control-Allow-Origin: *'];
        //        $locationProvider.html5Mode(true).hashPrefix('!');
        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise('/login/');

        window.indexedDB.deleteDatabase('demoBdd');
        $indexedDBProvider
            .connection('demoBdd')
            .upgradeDatabase(new Date().getTime(), function(event, db, tx){
                console.log(db)
                if(db.objectStoreNames){
                    db.objectStoreNames;
                }
                var objStore = db.createObjectStore('posts_now', {keyPath: 'createdAt'});
                //objStore.createIndex('date', 'createdAt', {unique: true});
                db.createObjectStore('posts_featured', {keyPath: '_id'});
                objStore.createIndex('date', 'createdAt', {unique: true});
                //objStore.createIndex('phat', 'phatNumber', {unique: false});
            });

        $stateProvider
            .state('fdtd', {
                url: "/fdtd",
                abstract: true,
                templateUrl: "menu.tpl.html",
                controller : 'MenuCtrl'
            })
    })


    .run(function($ionicPlatform,$localStorage,User) {
        $ionicPlatform.ready(function() {
            if(window.StatusBar){
                StatusBar.overlaysWebView(true);
                StatusBar.styleLightContent();
            }
            $localStorage.config = {};

            $localStorage.defaultHashTag = '#FDTD partyprew !';

            if (!$localStorage.user) {
                $localStorage.user = {};
            }

            if (!$localStorage.config.language) {
                $localStorage.config.language = 'en_US';
            }

            $localStorage.config.mainSorryMessage = 'You have to wait the sunset to publish. Time before sunset : ';
            $localStorage.config.sorryMessages = [
                "Look outside, there still some sun here... You have to wait a little longer",
                "NighWolves arent ready yet, we finish to train them",
                "Want to trick me ?",
                "I\'m a very smart application you know ?",
                "Ok, you win lets go ! .. Just kidding sorry ^^",
                "Ok, thats not funny",
                "What did you expect ?",
                "Sorry buddy, you have to wait a little more",
                "Are you drunk ?",
                "Just kidding"
            ];

            $localStorage.config.failOnPhotoTaking = 0;

            if (User.isLogged()) {
                User.logIn();
            } else {
                User.logOut();
            }
        });
    })

    .controller('MenuCtrl',function($scope,SunCalc,Camera, $localStorage){
        $scope.time = SunCalc;
        $scope.takePhoto = function(){
            //console.log('CTRL Photo',Camera)
            Camera.requestTakePhoto();
        }
        $scope.user = $localStorage.user;
    })




