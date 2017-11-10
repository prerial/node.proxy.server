(function() {
    "use strict";

    angular.module('app.dmc').component('sourceSchema', {
        templateUrl: 'client.webserver/views/sourceSchemaView.html',
        controller: 'SourceSchemaController'

    });
    angular.module('app.dmc').controller('SourceSchemaController', ['$scope', '$location', '$timeout', 'messageService', 'CommonRequestService',
        function($scope, $location, $timeout, messageService, commonRequestService) {

            var self = this;
            self.datasource = {};

            this.submitForm = function(formdata){
                formdata.single = sourceSchemaForm.single.value;
                messageService.addMessage(formdata);
                $location.path('/datamodel');
            };

            var data = {'requestType': 'getDataSource'};
            commonRequestService.getRequestData(data)
                .then(function(dt){
                    self.datasource = dt.data.payload;
                });

        }]);
})();
