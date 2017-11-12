(function(){
    "use strict";

    angular.module('dmc.utils').factory('UtilsService', function() {
        return {
            showSpinner: function() {
                $('#dmc-back-container').show();
                $('.dmc-spinner').show();
            },
            hideSpinner: function() {
                $('#dmc-back-container').hide();
                $('.dmc-spinner').hide();
            },
            makeUnselectable: function(node) {
                if (node.nodeType === 1) {
                    node.setAttribute("unselectable", "on");
                }
                var child = node.firstChild;
                while (child) {
                    this.makeUnselectable(child);
                    child = child.nextSibling;
                }
            }

        };

    });

})();
