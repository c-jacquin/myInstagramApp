angular.module('fdtd.camera.services',['ngStorage','utils','ui.router'])
    .factory('Camera',function($q,$localStorage,Time,SunCalc,$ionicPopup,$filter,$http, Config,$rootScope,$ionicModal,Geolocation){
        var service = {
            previewModal : {},
            takeProfilePicture : function(type){
                var options = {
                    quality: 40,
                    allowEdit: false,
                    targetWidth: 110,
                    targetHeight: 110,
                    //saveToPhotoAlbum: true,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: type, // 0:Photo Library, 1=Camera, 2=Saved Album
                    encodingType: 0
                }
                var defered = $q.defer();
                navigator.camera.getPicture(
                    function(DATA_URI){
                        var param = {
                            picture : 'data:image/jpeg;base64,'+DATA_URI
                        }
                        $http.put(Config.baseUrl+'/users/picture',param)
                            .success(function(){
                                defered.resolve('data:image/jpeg;base64,'+DATA_URI);
                            })
                            .error(function(err){
                                defered.resolve(err)
                            });
                    },
                    function() {
                        defered.reject();
                        console.log('erreur')
                    },options

                );
                return defered.promise;
            },
            requestTakePhoto : function() {
                //if (SunCalc.isNight()) {
                    var option = {
                        quality: 50,
                        allowEdit: false,
                        targetWidth: 640,
                        targetHeight: 960,
                        //saveToPhotoAlbum: true,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Album
                        encodingType: 0
                    }
                    if($localStorage.config.photoSave){
                        option.save = true;
                    }
                    console.log('camera',navigator.camera)
                    navigator.camera.getPicture(service.showPreview,
                        function(err) {
                            console.log(err);
                        },option
                    );

                /*} else {
                    console.log('pas bon')
                    if ($localStorage.config.failOnPhotoTaking >= $localStorage.config.sorryMessages.length) {
                        $localStorage.config.failOnPhotoTaking = 0;
                    }
                    var data = {
                        timeToWait: $filter('date')(SunCalc.getDuskTime(), 'shortTime'),
                        randomMessage: $localStorage.config.sorryMessages[$localStorage.config.failOnPhotoTaking]
                    };
                    $ionicPopup.alert({
                        title: 'error, '+data.timeToWait,
                        content: data.randomMessage
                    })
                    $localStorage.config.failOnPhotoTaking++;
                }*/
            },
            showPreview : function(DATA_URL){
                service.previewPic = DATA_URL;
                var myScope = null;
                $ionicModal.fromTemplateUrl('js/modules/camera/templates/preview.tpl.html', function(modal) {
                    modal.show();
                    service.previewModal = modal;
                    myScope = $rootScope.$new();
                    myScope.$on('$destroy', function() {
                        if(service.previewModal){
                            service.previewModal.remove();
                        }
                    });
                }, {
                    scope : myScope,
                    animation : 'slide-left-right'
                });
            },
            closePreview : function(){
                service.previewModal.hide();
            },
            submitPost : function(image) {
                console.log('submitpost',image)
                //todo move 3 lignes to a directive
                // var docFormElement = document.getElementById('createChoose');
                var docFormData = new FormData();
                var blob = service.dataURItoBlob(image.previewPic);
                docFormData.append('image_0', blob);
                docFormData.append('public',true);
                docFormData.append('creator',$localStorage.user._id);
                docFormData.append('description',image.description);

                Geolocation.getCurrentPosition()
                    .then(function(geoData){
                        docFormData.append('position',geoData._id)
                        $http.post(Config.baseUrl+'/posts/',docFormData,{headers: {'Content-Type': undefined}, transformRequest: angular.identity})
                            .success(function(newPost){
                                service.previewModal.hide();
                                $ionicPopup.alert({
                                    title : 'success',
                                    content : 'pic uploaded !!!!!'
                                })
                            })
                            .error(function(err){
                                $ionicPopup.alert({
                                    title: 'error',
                                    content: 'You must be logged to submit pics'
                                })
                            });
                    })
                    .catch(function(err){

                    })

            },
            dataURItoBlob : function(dataURI){
                var binary = atob(dataURI); //dataURI.split(',')[1]
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            }
        }
        return service;
    })