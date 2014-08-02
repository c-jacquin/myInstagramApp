angular.module('fdtd.gallery.controllers',['ionic','fdtd.login','ui.router','angular-cardview'])
    .controller('CardCtrl',function($scope,$localStorage,Posts,$ionicPopup,MyDate){
        $scope.userId = $localStorage.user._id
        if($scope.card.phats){
            angular.forEach($scope.card.phats,function(v){
                if(v == $localStorage.user._id){
                    console.log(true)
                    $scope.isPhatted = true;
                }else{
                    $scope.isPhatted = false;
                }
            })
        }

        $scope.age = MyDate.getNiceTime(new Date($scope.card.createdAt),new Date(),1,'ago');

        $scope.showInfo = function(id){
            console.log(id)
            if($scope.displayInfos == id){
                $scope.displayInfos =false;
            }else{
                $scope.displayInfos = id;
            }
        }

        $scope.phatIt = function(post){
            console.log(post)
            var param = {
                post : post._id,
                user : $localStorage.user._id,
                postCreator : post.creator._id
            }
            if($scope.isPhatted){
                Posts.unPhat(param)
                    .then(function(data){
                        $localStorage.user.phats.splice($localStorage.user.phats.indexOf(param.post),1);
                        post.phats.splice(post.phats.indexOf(param.user),1);
                        $scope.isPhatted = false;
                    })
                    .catch(function(err){
                        $ionicPopup.alert({
                            title : 'error',
                            content : 'database error'
                        })
                    })
            }else{
                Posts.phat(param)
                    .then(function(){
                        $localStorage.user.phats.push(param.post)
                        post.phats.push(param.user);
                        $scope.isPhatted = true;
                    })
                    .catch(function(){
                        $ionicPopup.alert({
                            title : 'error',
                            content : 'database error'
                        })
                    })
            }
        }
    })


    .controller('DetailsCtrl',function($scope, $ionicPopup, Posts, User, $localStorage, $state ,$window) {

        var baseIndex = parseInt(Posts.selectedIndex);

        var cards = angular.copy(Posts.data);

        $scope.cards = cards.slice(parseInt(Posts.selectedIndex)).concat(cards.slice(0,Posts.selectedIndex));

        $scope.displayInfos = $scope.cards[baseIndex]._id;
        $scope.user = $localStorage.user;


        $scope.onCreate = function(cardView) {
            $scope.cardView = cardView;
        };

        $scope.back = function(){
            $window.history.back();
        }

        $scope.displayProfile = function(id){
            $state.go('fdtd.user-profile',{userId : id})
        }

        $scope.displayMyProfile = function(){
            $location.path('/fdtd/profile');
        }

        $scope.toggleText = function() {
            return $scope.displayInfos = !$scope.displayInfos;
        };

        $scope.deletePosts = function(choose){
            console.log($scope.posts, choose)
            Posts.delete(choose)
                .then(function(data){
                    $scope.posts.splice($scope.posts.indexOf(choose),1)
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
        var selectedPost = null;
        $scope.reportPost = function(post){
            console.log($scope.posts)
            selectedPost = post;
            $ionicPopup.confirm({
                title: 'Report !',
                content: 'You really want report this content?'
            }).then(function(res) {
                if(res) {
                    var param = {
                        post : selectedPost._id,
                        email : $localStorage.user.email,
                        pseudo : $localStorage.user.pseudo
                    }
                    console.log(param)
                    Posts.report(param)
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
    })
    .controller('GalleryCtrl',function($scope,$location,Posts){

    })

    .controller('GalleryNowCtrl',function($scope,$location,Posts,$ionicLoading,Config, $indexedDB,FileSystem){
        var loader = $ionicLoading.show({
            content: ' <i class="ion-loading-c" style="font-size:2rem; color:white;"></i>'
        });
        $scope.postNumber = Config.pagination.limit,
        $scope.pictureLimit = Config.pagination.limit;
        $scope.infinite = true;
        $scope.posts = [];

        $scope.openDetails = function (params) {
            Posts.data = $scope.posts;
            Posts.selectedIndex = params.selectedIndex;
            $location.path('/fdtd/details')
        };

        if(Config.initPosts.now){
            Posts.fetch(0, 'now')
                .then(function(data) {
                    FileSystem.request(window.TEMPORARY, 25)
                        .then(function () {
                            angular.forEach(data, function (v, k) {
                                FileSystem.getAndStore("image/jpg", 'posts_now', v)
                                    .then(function(post){
                                        console.log(post)
                                        $scope.posts.push(post);
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                    })
                            })
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    loader.hide();
                    Posts.data = $scope.posts;
                })
                .catch(function(err){
                    console.log(err)
                })

            Config.initPosts.now = false;
        }else{
            //var query = $indexedDB..queryBuilder().$desc.compile();
            console.log('this shit   !   ',$indexedDB.queryBuilder().$index('date').compile())
            var query = $indexedDB.queryBuilder().$index('date').$desc().compile();
            /*$indexedDB.objectStore('posts_now').each(query)
                .then(function(cursor) {
                    console.log('lalala',cursor)
                }).catch(function(err){
                    console.log('err',err)
                })*/
            $indexedDB.objectStore('posts_now').getAll()
                .then(function(results) {
                    console.log(results)
                    $scope.posts = results;
                    Posts.data = $scope.posts;
                    loader.hide();
                });
        }
        $scope.loadMore = function() {
            console.log('infinite', $scope.postNumber)
            Posts.fetch($scope.postNumber,'now')
                .then(function(data){
                    console.log('ici',$scope.postNumber)
                    $scope.postNumber = $scope.postNumber + Config.pagination.limit;
                    $scope.pictureLimit = $scope.pictureLimit + Config.pagination.limit;

                    //$scope.posts.concat(data);
                    angular.forEach(data,function(post){
                        //FileSystem.getAndStore("image/jpg", 'posts_now', v)
                            //.then(function(post){
                                $scope.posts.push(post)
                            //})
                    })
                    //$scope.posts = Posts.data;
                    console.log(data)
                    if(data.length != Config.pagination.limit || data.length == 0){
                        $scope.infinite = false;
                    }
                    //Posts.data = $scope.posts;
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                })
                .catch(function(err){
                    console.log(err);
                })

        };
        $scope.doRefresh = function(){
            Posts.refresh('now',new Date($scope.posts[0].createdAt).getTime() + 10)
                .then(function(data){
                    $scope.pictureLimit = $scope.pictureLimit + data.length;
                    if(data.length > 0){
                        for(var i = data.length ; i >=0 ; i--){
                            if(data[i] != undefined){
                                FileSystem.getAndStore("image/jpg", 'posts_now', data[i])
                                    .then(function(post){
                                        $scope.posts.splice(0,0,data[i]);
                                    })
                            }
                        }
                    }
                    Posts.data = $scope.posts;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .catch(function(err){
                    $scope.$broadcast('scroll.refreshComplete');
                })
        }
    })

    .controller('GalleryFeaturedCtrl',function($scope,$location,Posts,$ionicLoading,Config, $indexedDB,FileSystem) {

        $scope.postNumber = Config.pagination.limit,
        $scope.pictureLimit = Config.pagination.limit;
        $scope.infinite = true;
        $scope.posts = [];

        var loader = $ionicLoading.show({
            content: ' <i class="ion-loading-c" style="font-size:2rem; color:white;"></i>'
        });

        $scope.openDetails = function (params) {
            Posts.data = $scope.posts;
            Posts.selectedIndex = params.selectedIndex;
            $location.path('/fdtd/details')
        };

        if(Config.initPosts.featured){
            Posts.fetch(0, 'featured')
                .then(function(data) {
                    console.log('posts !!!! :', data)
                    FileSystem.request(window.TEMPORARY, 25)
                        .then(function () {
                            angular.forEach(data, function (v, k) {
                                console.log('fs ', k, v)
                                FileSystem.getAndStore("image/jpg", 'posts_featured', v)
                                    .then(function(post){
                                        if ($scope.posts.indexOf(post) == -1) {
                                            $scope.posts.push(post);
                                        }
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                    })
                            })
                            //Posts.data = $scope.posts;
                            $scope.infinite = true;
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    loader.hide();
                })
                .catch(function(err){
                    console.log(err)
                })

            Config.initPosts.featured = false;
        }else{
            $indexedDB.objectStore('posts_featured').getAll()
                .then(function(results) {
                    $scope.posts = results;
                    loader.hide();
                });
        }

        $scope.loadMore = function() {
            console.log('infinite', $scope.postNumber)
            Posts.fetch($scope.postNumber,'featured')
                .then(function(data){
                    console.log('ici',$scope.postNumber)
                    $scope.postNumber = $scope.postNumber + Config.pagination.limit;
                    $scope.pictureLimit = $scope.pictureLimit + Config.pagination.limit;

                    //$scope.posts.concat(data);
                    angular.forEach(data,function(post){
                        //FileSystem.getAndStore("image/jpg", 'posts_now', v)
                            //.then(function(post){
                                $scope.posts.push(post)
                            //})
                    })
                    //$scope.posts = Posts.data;
                    console.log(data)
                    if(data.length != Config.pagination.limit || data.length == 0){
                        $scope.infinite = false;
                    }
                    Posts.data = $scope.posts;
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                })
                .catch(function(err){
                    console.log(err);
                })

        };


    })
    .controller('PreviewController',function($scope){

    })

