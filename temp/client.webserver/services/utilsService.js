(function(){
    "use strict";

    angular.module('dmc.utils').factory('UtilsService', function() {
        return {
            showSpinner : function() {
                $('#dmc-back-container').show();
                $('.dmc-spinner').show();
            },
            hideSpinner : function() {
                $('#dmc-back-container').hide();
                $('.dmc-spinner').hide();
            }
        };

    });

})();
