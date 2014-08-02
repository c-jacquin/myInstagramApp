angular.module('fdtd.profile.controllers',['ionic','ngStorage','fdtd.login','utils'])

.controller('UserProfileCtrl',function($scope,User ,MyDate,Posts, $localStorage,$ionicPopup,$ionicModal,$ionicLoading,myUser){

        $scope.user = myUser;
        console.log('user   ',myUser)
        $scope.user.age = MyDate.calc_age($scope.user.birthdate).substr(2,2);
        $scope.userPosts = [];


        var loader = $ionicLoading.show({
            content: ' <i class="ion-loading-c" style="font-size:2rem; color:white;"></i>'
        });

        $scope.$on('$viewContentLoaded',function(){
            loader.hide();
        });

        angular.forEach($localStorage.user.following,function(v){
            if(v == $scope.user._id){
                $scope.followed = true;
            }
        });

        angular.forEach(Posts.data,function(post){
           if(post.creator._id == $scope.user._id){
                $scope.userPosts.push(post)
           }
        });

        $scope.openDetails = function(params){
            Posts.selectedIndex = params.selectedIndex;
            $ionicModal.fromTemplateUrl('js/modules/gallery/templates/modal/detailsPostModal.tpl.html', function(modal) {
                $scope.modal = modal;
                modal.show();
            }, {
                scope : $scope,
                focusFirstInput: true
            });
        }

        $scope.report = function(user){

            $ionicPopup.confirm({
                title: 'Report !',
                content: 'You really want report this user?'
            }).then(function(res) {
                if(res) {
                    var param = {
                        user : user._id,
                        email : $localStorage.user.email,
                        pseudo : $localStorage.user.pseudo,
                        me : $localStorage.user._id
                    }
                    console.log(param)
                    User.report(param)
                        .then(function(data){
                            $ionicPopup.alert({
                                title : 'Success',
                                content : data.message
                            })
                        })
                        .catch(function(err){
                            $ionicPopup.alert({
                                title : 'Error',
                                content : err.message
                            })
                        })
                }
            });
        }

        $scope.follow = function(user){
            var param = {
                token : $localStorage.user.token,
                follow : user._id,
                me : $localStorage.user._id
            }
            console.log(user)
            User.follow(param)
                .then(function(){
                    $scope.followed = true;
                    $scope.user.follower.push(param.me)
                    $localStorage.user.following.push(param.follow)
                })
                .catch(function(){
                    $ionicPopup.alert({
                        title : 'erreur',
                        content : 'grosse problem'
                    })
                })
        }

        $scope.unfollow = function(user){
            var param = {
                me : $localStorage.user._id,
                follow : user._id
            }
            User.unFollow(param)
                .then(function(){
                    $scope.followed = false
                    $scope.user.follower.splice($scope.user.follower.indexOf(param.me),1);
                    $localStorage.user.following.splice($localStorage.user.following.indexOf(param.follow),1);
                })
                .catch(function(){
                    $ionicPopup.alert({
                        title : 'erreur',
                        content : 'grosse problem'
                    })
                })

        }
    })

.controller('ProfileCtrl',function($scope,$localStorage,MyDate){
        $scope.user = $localStorage.user;

        $scope.user.age = MyDate.calc_age($scope.user.birthdate).substr(2,2);
    })

.controller('editProfileCtrl',function($scope,User,$ionicPopup,$localStorage,$state, $ionicActionSheet,Camera) {

        $scope.user = $localStorage.user;


        $scope.profilePicChange = function () {
            $ionicActionSheet.show({
                buttons: [
                    { text: 'photo album' },
                    { text: 'Take a picture' }
                ],
                titleText: 'Modify your profile picture',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    Camera.takeProfilePicture(index)
                        .then(function (data) {
                            $ionicPopup.alert({
                                title: 'success',
                                content: 'pic uploaded !!!!!'
                            })
                            $scope.user.image = data
                        })
                        .catch(function () {
                            $ionicPopup.alert({
                                title: 'error',
                                content: 'server error'
                            })
                        })
                }
            });
        }

        $scope.updateUser = function (user) {
            console.log('ctrl 1', user)
            //$scope.user = $localStorage.user;
            var newUser = {
                _id: user._id,
                gender: user.gender,
                sexualOrientation: user.sexualOrientation,
                city: user.city,
                description: user.description,
                url: user.url,
                relationship: user.relationship,
                age: user.age
            };

            User.update(newUser)
                .then(function (data) {
                    $ionicPopup.alert({
                        title: 'success',
                        content: 'profile updated'
                    }).then(function () {
                        $state.go('fdtd.profile')
                    })
                })
                .catch(function (err) {
                    $ionicPopup.alert({
                        title: 'error',
                        content: 'profile not updated'
                    })
                })
        }
    })
    .controller('FollowerCtrl',function($scope,User,$localStorage){
        var param = {
            _id : $localStorage.user._id
        }
        User.getFollowers(param)
            .then(function(data){
                console.log(data)
                $scope.followers = data;
            })
            .catch(function(err){
                console.log(err);
            })
    })
