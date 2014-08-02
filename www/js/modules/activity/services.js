angular.module('fdtd.activity.services',[])
    .service('Activity',function($http,$q,Config){

        var service = {
            fetch : function(userId){
                var defered = $q.defer();
                $http.get(Config.baseUrl+'/activity?user='+userId)
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