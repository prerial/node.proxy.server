/**
 * Created by U160964 on 11/1/2017.
 */
(function() {
    "use strict";

    angular.module('app.dmc').component('connections', {
        templateUrl: 'client.webserver/views/connectionsView.html',
        controller: 'ConnectionController'
    });

    angular.module('app.dmc').controller('ConnectionController', ['$scope', '$location','$route', '$routeParams',  '$timeout', 'notificationService', 'Urls', 'UtilsService', 'messageService', 'CommonRequestService',
        function($scope, $location, $route, $routeParams, $timeout, notification, urls, utilsService, messageService, commonRequestService) {
            var self = this;
            self.selectedConn = null;
            self.databases = {};
            self.connection = {};
            var data = {'requestType': 'getDatabases'};
            commonRequestService.getRequestData(data)
                .then(function(dt){
                    self.databases = dt.data.payload;
                });

            function getConnections(){
                data = {'requestType': 'getConnectionsData'};
                commonRequestService.getRequestData(data)
                    .then(function(dt){
                        self.connections = dt.data.payload;
                    });
            }
            getConnections();

            self.onSelect = function onSelect(conn) {
                self.selectedConn = conn;
            };

            self.delete = function deleteConnection(conn){
                var reqParam = {'requestType': 'deleteConnection', 'data':conn.ID};
                commonRequestService.postRequestData(reqParam)
                    .then(function (dt) {
                        getConnections();
                        $('#connectionModal').modal('hide');
                        notification.success(dt.data.message);
                    });
            };
            self.gotoDetail = function gotoDetail(conn, idx){
                self.connection = conn;
            };
            self.formSubmit = function(conn) {
                conn.type = !conn.ID? 'save':'update';
                var reqParam = {'requestType': 'saveConnection', 'data':conn};
                commonRequestService.postRequestData(reqParam)
                    .then(function (dt) {
                        getConnections();
                        $('#connectionModal').modal('hide');
                        notification.success(dt.data.message);
                    });
            }

        }]);
})();

