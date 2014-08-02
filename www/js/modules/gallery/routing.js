angular.module('fdtd.gallery',['fdtd.gallery.controllers','fdtd.gallery.services','ui.router','pasvaz.bindonce'])
    .config(function($stateProvider){

        $stateProvider
            .state('fdtd.gallery', {
                url: '/gallery',
                views: {
                    'menuContent' :{
                        templateUrl: 'js/modules/gallery/templates/gallery.tpl.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })
            .state('fdtd.gallery.featured',{
                url : '/featured',
                views : {
                    'gallery' : {
                        templateUrl: 'js/modules/gallery/templates/galleryFeatured.tpl.html',
                        controller: 'GalleryFeaturedCtrl'
                    }
                }
            })
            .state('fdtd.gallery.now',{
                url : '/now',
                views : {
                    'gallery' : {
                        templateUrl: 'js/modules/gallery/templates/galleryNow.tpl.html',
                        controller: 'GalleryNowCtrl'
                    }
                }
            })
            .state('fdtd.details', {
                url: '/details',
                views: {
                    'menuContent' :{
                        templateUrl: 'js/modules/gallery/templates/detailsPostCards.tpl.html',
                        controller: 'DetailsCtrl'
                    }
                }
            })


    })
    .run(function(){

    })