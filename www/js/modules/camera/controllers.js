angular.module('fdtd.camera.controllers',[])
.controller('PreviewCtrl',function($scope,Camera){
        $scope.image = {
            previewPic :  Camera.previewPic
        };
        $scope.publish = function(image){
            console.log('ctrl  !! ',image)
            Camera.submitPost(image);
        }
        $scope.leavePreview = function(){
            Camera.closePreview();
        }
    })