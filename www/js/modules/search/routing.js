angular.module('fdtd.search',['fdtd.search.controllers','ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('fdtd.search',{
                url: "/search",
                views : {
                    'menuContent': {
                        templateUrl: "js/modules/search/templates/search.tpl.html"
                    }
                }
            })
            .state('fdtd.search.user',{
                url: "/user",
                views : {
                    'search': {
                        templateUrl: "js/modules/search/templates/searchUser.tpl.html",
                        controller: 'SearchUserCtrl'
                    }
                }
            })
            .state('fdtd.search.posts',{
                url: "/posts",
                views : {
                    'search': {
                        templateUrl: "js/modules/search/templates/searchPosts.tpl.html",
                        controller: 'SearchPostsCtrl'
                    }
                }
            })
    })
    .run(function(){

    })