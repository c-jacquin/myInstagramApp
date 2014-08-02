angular.module('fdtd.activity.controllers',[])
    .controller('ActivityCtrl',function($scope,Activity,$localStorage,MyDate){
        Activity.fetch($localStorage.user._id).then(function(data){
            console.log(data);
            angular.forEach(data,function(v,k){
                v.age = MyDate.getNiceTime(new Date(v.createdAt),new Date(),1,'ago');
            })
            $scope.activities = data;
        }).catch(function(err){
            console.log(err);
        })
    })