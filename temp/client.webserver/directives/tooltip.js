(function () {
    'use strict';

    function TooltipDirective($compile, $templateCache) {

        return {
            restrict: 'A',
            scope:{
                tooltip:'=',
                title:'@'
            },
            require: '^form',
            link: function (scope, elem, attrs, formCtrl) {
                var template, inputName, title, top, left;
                scope.$on("clearPopups", function() {
                    if(template){
                        template.remove();
                    }
                });
                elem.on("focus", function(e) {
                    e.preventDefault();
                    template = $compile($templateCache.get('templates/directives/tooltip.html'))(scope);
                    $('body').append(template);
                    template.css('display', 'none');
                    inputName = elem.attr('id');
                    scope.$watch(function() {
                        if(formCtrl[inputName].$valid){
                            template.css('opacity', 0);
                            elem.removeClass('error');
                        }
                        return formCtrl[inputName].$error
                    },function(errarr){
                        var str = '[ng-message="'+ Object.keys(errarr)[0] +'"]';
                        title = $('#' + elem.attr('id') + '-error').find('span'+str).html();
                        template.addClass("pre-tooltip tooltip top").show().find('.tooltip-inner').html(title);
                        top = elem.offset().top - ($('.tooltip-container').height());
                        left = elem.offset().left + elem.width() / 2;
                        template.css('left', left).css('top', top).css('opacity', 1).css('display', 'block').stop(true,true);
                        elem.addClass('error');
                    }, function(){
                    });
                });
                elem.on("blur", function() {
                    template.remove();
                });
            }
        }
    }

    TooltipDirective.$inject = ['$compile', '$templateCache', '$timeout'];

    angular.module('dmc.directives').directive("preTooltip", TooltipDirective);

})();