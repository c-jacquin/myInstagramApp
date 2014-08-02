angular.module('fdtd.gallery.services',['ngStorage','utils'])
    .service('Posts',function($http,$q,$localStorage,Config){
        var URI = "/posts";
        var service = {
            data : [],
            type : 'featured',
            report : function(report){
                var defered = $q.defer();
                $http.get(Config.baseUrl+URI+'/report',{
                    params : report
                })
                    .success(function(data){

                        defered.resolve(data);
                    })
                    .error(function(err){

                        defered.reject(err);
                    })
                return defered.promise;
            },
            delete : function(post){
                var defered = $q.defer();
                $http.delete(Config.baseUrl+URI+'/'+post._id)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            fetch : function(start,type){
                var defered = $q.defer();
                param = {
                    type : type,
                    start : start,
                    number : Config.pagination.limit
                };
                $http.get(Config.baseUrl+URI, {params : param})
                    .success(function(data){
                        console.log(data)
                        angular.forEach(data,function(v){
                            service.data.push(v)
                        })
                        //service.data.concat(data);
                        console.log(service.data)
                        //angular.extend(service.data,data)
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            refresh : function(type,date){
                var defered = $q.defer();
                param = {
                    type : type,
                    date : date
                };
                $http.get(Config.baseUrl+URI+'/refresh', {params : param})
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            getMine : function(){

            },
            phat : function(param){
                var defered = $q.defer();
                $http.post(Config.baseUrl+'/phat',param)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            unPhat : function(param){
                var defered = $q.defer();
                $http.put(Config.baseUrl+'/unphat',param)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            search : function(param){
                var defered = $q.defer();
                $http.get(Config.baseUrl+'/search/posts?query='+param)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);

                    })
                return defered.promise;
            }
       }
        return service;
    })

    .directive('fullHeight', function($window){
        return {
            link : function(scope, element, attrs){
                element.css('height',$window.innerHeight + 2 +'px');
            }
        }
    })
    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $element.bind('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    })
    .directive('noDragRight', ['$ionicGesture', function($ionicGesture) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $ionicGesture.on('dragright', function(e) {
                    e.gesture.srcEvent.preventDefault();
                }, $element);
            }
        }
    }])
