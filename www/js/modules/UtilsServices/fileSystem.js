angular.module('fileSystem',[])
    .service('FileSystem',function($rootScope,$window,$q,$indexedDB){
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        var service = {
            fs: null,
            request: function (type, size) {
                var defered = $q.defer();
                window.requestFileSystem(type, size * 1024 * 1024, function (fs) {
                    service.fs = fs;
                    defered.resolve(fs);
                }, function (err) {
                    defered.reject(err);
                })
                return defered.promise;
            },
            mkdir: function (dirName) {
                var defered = $q.defer();
                service.fs.root.getDirectory(dirName, {create: true}, function (dirEntry) {
                    service[dirName] = dirEntry;
                    defered.resolve(dirEntry);
                }, function (err) {
                    defered.reject(err);
                });
                return defered.promise;
            },
            createFile: function (fileName, data, type) {
                var defered = $q.defer();
                service.fs.root.getFile(fileName, {create: true}, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            defered.resolve(fileEntry);
                        };
                        fileWriter.onerror = function (e) {
                            defered.reject(e)
                        };
                        var dataView = new DataView(data);
                        var blob = new Blob([dataView], {type: type});
                        fileWriter.write(blob);

                    }, function (err) {
                        defered.reject(err);
                    });
                }, function (err) {
                    defered.reject(err);
                });
                return defered.promise;
            },
            isCached : function(fileName) {
                service.fs.root.getFile(fileName, {create: false}, function (fileEntry) {
                    console.log(fileEntry);
                    if(fileEntry){
                        return true;
                    }else{
                        return false;
                    }
                })
            },
            getAndStore: function (type, objectStore, json) {
                var defered = $q.defer();
                var xhr = new XMLHttpRequest();
                xhr.open('GET', json.images_small, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    var fileName = json.images_small.match(/([^\/]+)(?=\.\w+$)/)[0] + '.jpg';
                    if(!service.isCached(fileName)){
                        service.createFile(fileName, xhr.response, type)
                            .then(function (fileEntry) {
                                var localUrl = fileEntry.toURL();
                                json.images_small = localUrl;
                                var myObjectStore = $indexedDB.objectStore(objectStore);
                                myObjectStore.find(json._id)
                                    .then(function(data){
                                        console.log(data)
                                        if(!data){
                                            myObjectStore.insert(json).then(function(){
                                                defered.resolve(json)
                                            })
                                        }
                                    })
                                    .catch(function(err){
                                        console.log(err)
                                    })

                            })
                            .catch(function (err) {
                                defered.reject(err);
                            })
                    }

                };
                xhr.send();
                return defered.promise;
            }
        }
        return service;
    })