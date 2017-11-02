(function() {
    "use strict";

    angular.module('app.dmc').component('datamodel', {
        templateUrl: 'node.web-server/views/dataModelView.html',
        controller: 'DataModelController'

    });
    angular.module('app.dmc').controller('DataModelController', ['$scope', '$location', '$timeout', 'notificationService', 'Urls', 'UtilsService', 'messageService', 'CommonRequestService', 'GraphService',
        function($scope, $location, $timeout, notification, urls, utilsService, messageService, commonRequestService, graphService) {

            var self = this;
            this.data = [];
            this.anchors = [];
            this.anchoroot = {
                type: 'anchor', // 'anchor','include','exclude'
                anchor: {},
                include: {},
                exclude: {},
                tables_anchor:[],
                tables_include:[],
                tables_exclude:[],
                reset: function(){
                    this.type = 'anchor';
                    this.anchor = {};
                    this.include = {};
                    this.exclude = {};
                    this.tables_anchor = [];
                    this.tables_include = [];
                    this.tables_exclude = [];
                },
                toQueryString: function(obj){
                    var parts = [];
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            parts.push(obj[i]);
//                            parts.push(encodeURIComponent(obj[i]));
                        }
                    }
                    return parts.join(",");
                },
                flatten: function(){
                    this.tables_anchor.push(this.toQueryString(this.anchor));
                    this.tables_include.push(this.toQueryString(this.include));
                    this.tables_exclude.push(this.toQueryString(this.exclude));
                    return 'anchors=' + this.tables_anchor[0] + '&tables_include=' + this.tables_include[0] + '&tables_exclude=' + this.tables_exclude[0];
                }
            };

            $scope.$on('setAnchors', function(evt, anchor, blnAdd){
                if(blnAdd){
                    Object.defineProperty(self.anchoroot[self.anchoroot.type], anchor, {
                        writable: true,
                        enumerable: true,
                        configurable: true,
                        value: anchor
                    });
                }else{
                    delete self.anchoroot[self.anchoroot.type][anchor];
                }
                $scope.$apply();
             });

            utilsService.showSpinner();

            this.resetAnchorsForm = function(){
                this.anchoroot.reset();
                notification.success('All data was reset. Please select Tables\' data and click Submit button');
                $('.ui-pnotify').css('top', '110px')
            };

            this.submitForm = function(){
                this.anchors = [];
//                this.anchors.push(encodeURIComponent(this.anchoroot.flatten()));
                this.anchors.push(this.anchoroot.flatten());
                messageService.addMessage(this.anchors[0]);
                $location.path('/anchormodel');
            };

            var formdata = messageService.getMessage();
            if(!formdata){
                utilsService.hideSpinner();
                $location.path('/login');
                return;
            }
            if(formdata.data === 'cancel'){
                formdata = messageService.getPrevious();
            }
            var data = {'requestType': 'getErdData', 'data': formdata.data};
debugger
            commonRequestService.postRequestData(data)
//            commonRequestService.getRequestDataQueryString(data)
                .then(function(resp){
                    self.resetAnchorsForm();
                    var erData = resp.data.payload;
                    $timeout(function(){
                        graphService.buildGraph(erData, false);
                        utilsService.hideSpinner();
                    },500);
                }).catch( function(msg){
                    $timeout(function() { $scope.expired = true; }, 5000);
                    notification.error('Error: ' + msg.responseText);
                    utilsService.hideSpinner();
            });

        }]);
})();
