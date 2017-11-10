(function() {
    "use strict";

    angular.module('app.dmc').factory('messageService', function ($rootScope) {
        return {
            messages: [],
            previous: [],
            identity: 0,
            getPrevious: function() {

                var data = this.previous[0];
                this.previous = [];
                return data;
            },
            getMessage: function() {

                var data = this.messages[0];
                this.messages = [];
                return data;
            },
            addMessage: function(obj, caller) {

                this.identity += 1;
                var id = this.identity,
                    message = {
                        id: id,
                        data: obj,
                        source: caller
                    };

                this.messages.push(message);
                this.previous.push(message);
                $rootScope.$broadcast('messageAdded');
            }
        };
    });
})();

