(function(){
    "use strict";

    angular.module('app.dmc').factory('CommonRequestService', ['$rootScope', '$q', '$http', 'Urls',
        function($rootScope, $q, $http, Urls) {

            return {
                getRequestDataQueryString: getRequestDataQueryString,
                getRequestDataByID: getRequestDataByID,
                postRequestData: postRequestData,
                getRequestData: getRequestData
            };
            function toQueryString(obj) {
                var parts = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
                    }
                }
                return parts.join("&");
            }
            function httpPost(url, dt){
                var deferred = $q.defer();
                if(url){
                    $http.post(url, dt)
                        .then(function (data) {
                            deferred.resolve(data);
                        })
                        .catch(function (msg) {
                            $rootScope.$broadcast('error:server', msg);
                            deferred.reject(msg);
                        });

                }else{
                    deferred.reject({'responseText':'REST url error'});

                }
                return deferred.promise;
            }
            function httpGet(url){
                var deferred = $q.defer();
                if(url){
                    $http.get(url)
                    .then(function (data) {
                        deferred.resolve(data);
                    })
                    .catch(function (msg, a, b, c) {
                        $rootScope.$broadcast('error:server', msg);
                        deferred.reject(msg);
                    });
                }else{
                        deferred.reject({'responseText':'REST url error'});
                }
                return deferred.promise;
            }
            function postRequestData(data){
                return httpPost(Urls[data.requestType], data);
            }
            function getRequestData(dt){
                var url = Urls[dt.requestType];
                if(dt.data){
                    url = url + '?' + dt.data;
                }
                return httpGet(url);
            }
            function getRequestDataQueryString(dt){
                var url = Urls[dt.requestType] + '?' + toQueryString(dt.data);
                return httpGet(url);
            }
            function getRequestDataByID(url){
                return httpGet(url);
            }
        }]);
})();
