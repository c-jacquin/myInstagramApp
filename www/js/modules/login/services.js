angular.module('fdtd.login.services',['utils','ui.router','fileSystem'])
    .factory('User',function($http,$q,$localStorage,BasicHttpAuth, $location, Config, Geolocation,Apn,$state){
        var URI = "/users",
            service = {
                logIn : function(){
                    BasicHttpAuth.setCredentials($localStorage.user.pseudo, $localStorage.user.password);
                    $state.go('fdtd.gallery.featured');
                    $q.all([
                        //Apn.register(),
                        Geolocation.getCurrentPosition()
                    ]).then(function(data){
                        console.log(data)
                        Geolocation.save(data[0]).then(function(){
                            navigator.splashscreen.hide();
                        }).catch(function(err){
                            console.error(err);
                        })
                    }).catch(function(err){
                        console.log(err);
                        console.error(err);
                    })
                },
                logOut : function(){
                    delete $localStorage.user;
                    BasicHttpAuth.clearCredentials();
                    $location.path('/login/');
                },
                isLogged :  function() {
                    return $localStorage.authdata && $localStorage.authdata !== null;
                },
                signUp : function(user){
                    console.log(Config.baseUrl+URI)
                    var defered = $q.defer()
                    $http.post(Config.baseUrl+URI,user)
                        .success(function(data){
                            console.log('souccess')
                            $localStorage.user = data;
                            $localStorage.user.password = user.password;
                            service.logIn();
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise
                },
                signIn : function(user){
                    var defered = $q.defer();
                    $http.post(Config.baseUrl + '/users/auth', user)
                        .success(function(data) {
                            $localStorage.user = data;
                            $localStorage.user.password = user.password;
                            service.logIn();
                        })
                        .error(function(err) {
                            defered.reject(err)
                        });
                    return defered.promise;
                },
                resetPasswordAccount : function(param){
                    var defered = $q.defer();
                    $http.post(Config.baseUrl + '/password/account',param)
                        .success(function(data) {
                            defered.resolve(data);
                        })
                        .error(function(err) {
                            defered.reject(err);
                        });
                    return defered.promise;
                },
                resetPassword : function(email){
                    var defered = $q.defer();
                    $http.post(Config.baseUrl + '/password/reset', {email : email})
                        .success(function(data) {
                            defered.resolve(data);
                        })
                        .error(function(err) {
                            defered.reject(err);
                        });
                    return defered.promise;
                },
                getById : function(id){
                    var defered = $q.defer();
                    $http.get(Config.baseUrl+URI+'/'+id)
                        .success(function(user){
                            defered.resolve(user);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                },
                update : function(user){
                    console.log('service 1',user)
                    var defered = $q.defer();

                    //todo refaire un objet avec juste les champs concernes
                    $http.put(Config.baseUrl+URI,user)
                        .success(function(data){
                            console.log('ah yeah',service)
                            defered.resolve();
                        })
                        .error(function(err){
                            defered.reject();
                        })
                    return defered.promise;
                },
                updateProfilePic : function(params){
                    var defered = $q.defer();
                    $http.put(Config.baseUrl+'/users/image/',params)
                        .success(function(data){
                            //$localStorage.posts.push(newPost);
                            defered.resolve(data);
                            console.log(data)
                        })
                        .error(function(err){
                            defered.reject(err);

                        });
                    return defered.promise;
                },
                follow : function(params){
                    var defered = $q.defer();
                    $http.put(Config.baseUrl+'/users/follow/',params)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                },
                unFollow : function(params){
                    var defered = $q.defer();
                    $http.put(Config.baseUrl+'/users/unfollow/',params)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                },
                report : function(params){
                    var defered = $q.defer();
                    $http.put(Config.baseUrl+'/users/report/',params)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                },
                getFollowers : function(param){
                    var defered = $q.defer();
                    $http.get(Config.baseUrl+'/users/followers',{params : param})
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
                    $http.get(Config.baseUrl+'/search/users?query='+param)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                },
                notifConfig : function(conf){
                    var defered = $q.defer();
                    $http.put(Config.baseUrl+'/conf/notif',conf)
                        .success(function(data){
                            defered.resolve(data);
                        })
                        .error(function(err){
                            defered.reject(err);
                        })
                    return defered.promise;
                }
            };
        return service;
    })