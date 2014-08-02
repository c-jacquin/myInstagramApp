angular.module('fdtd.search.controllers',['fdtd.gallery','fdtd.login'])
    .controller('SearchUserCtrl',function($scope,User,$ionicPopup,$state){

        $scope.search = function(queryParam){
            User.search(queryParam)
                .then(function(data){
                    console.log(data)
                    $scope.users = data;
                })
                .catch(function(err){

                })
        }
        $scope.displayProfile = function(id){
            $state.go('fdtd.user-profile',{userId : id})
        }

    })
    .controller('SearchPostsCtrl',function($scope,Posts,$ionicPopup){

        $scope.search = function(queryParam){
            Posts.search(queryParam)
                .then(function(data){
                    console.log(data)
                    $scope.posts = data;
                })
                .catch(function(err){

                })
        }

    })