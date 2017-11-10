(function() {
    "use strict";

    angular.module('app.dmc').component('anchormodel', {
        templateUrl: 'client.webserver/views/anchorModelView.html',
        controller: 'AnchorModelController'
    });

    angular.module('app.dmc').controller('AnchorModelController', ['$scope', '$location', '$timeout', 'notificationService', 'Urls', 'UtilsService', 'messageService', 'CommonRequestService', 'GraphService',
        function($scope, $location, $timeout, notification, urls, utilsService, messageService, commonRequestService, graphService) {

            utilsService.showSpinner();
            var formdata = messageService.getMessage();
            if(!formdata){
                utilsService.hideSpinner();
                $location.path('/login');
                return;
            }
            var data = {'requestType': 'getErdAnchorData', 'data': formdata.data};
            commonRequestService.getRequestData(data)
                .then(function(resp){
                    var respdata = resp.data.payload;
                    var erData = [{
                        'name': 'My Model',
                        'columns': [],
                        'children': respdata
                    }];

                    var type = 'text/plain;charset=utf-8';
                    var ddlname = 'ddlfile.txt';
                    function buildString(dt, type){
                        var str = '';
                        dt.forEach(function(mem){
                            str = str + '\n\n' + mem[type];
                        });
                        return str;
                    }
                    var ddltext = buildString(respdata, 'ddl');
                    var dlbtn = $("#dlbtn")[0];
                    var ddlfile = new Blob([ddltext], {type: type});
                    dlbtn.href = URL.createObjectURL(ddlfile);
                    dlbtn.download = ddlname;

                    var dmlname = 'dmlfile.txt';
                    var dmltext = buildString(respdata, 'dml');
                    var dmbtn = $("#dmbtn")[0];
                    var dmlfile = new Blob([dmltext], {type: type});
                    dmbtn.href = URL.createObjectURL(dmlfile);
                    dmbtn.download = dmlname;

                    $timeout(function(){
                        graphService.buildGraph(erData, true);
                        utilsService.hideSpinner();
                    },500);
                }).catch( function(msg){
                    $timeout(function() { $scope.expired = true; }, 5000);
                    notification.error('Error: ' + msg.responseText);
                    utilsService.hideSpinner();
            });

//            this.save = function(evt){
//            };

            this.cancel = function(){
                messageService.addMessage('cancel');
                $location.path('/datamodel');
            }

        }]);
})();
