(function() {
    "use strict";

    angular.module('app.dmc').component('datamodel', {
        templateUrl: 'client.webserver/views/dataModelView.html',
        controller: 'DataModelController'

    });
    angular.module('app.dmc').controller('DataModelController', ['$scope', '$location', '$timeout', 'notificationService', 'Urls', 'UtilsService', 'messageService', 'CommonRequestService', 'GraphService',
        function($scope, $location, $timeout, notification, urls, utilsService, messageService, commonRequestService, graphService) {

            var self = this;
            this.dblclicked = false;
            this.selectedNode = undefined;
            this.data = [];
            this.anchors = [];
            var fillColors = {
                "default": "#444",
                "anchor": "darkred",
                "include": "darkgreen",
                "exclude": "darkblue"
            };
            var backgroundColors = {
                "default": "rgb(239,239,239)",
                "anchor": "rgb(255,153,153)",
                "include": "rgb(144, 238, 144)",
                "exclude": "rgb(176, 196, 222)"
            };
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
            $scope.$on('hideTable', function(evt, el, name){
                self.dblclicked = true;
                el.attr("unselectable", "on");
                makeUnselectable(el[0]);
                var anchor = self.anchoroot.type;
                el.css('fill', fillColors[self.anchoroot.type]);
                self.hideTableView();
                $timeout(function(){
                    self.dblclicked = false;
                }, 500)
            });
            $scope.$on('showTable', function(evt, el, node){
                self.selectedNode = el;
                $timeout(function(){
                    if(!self.dblclicked){
                        $('#table-container').css('display', 'block').css('top', node.x-20).css('left', node.y).css('background-color', '#efefef');
                        $('#table-title').html(node.name);
                        $('#table-fields').html('');
                        $('#table-header button').html('Edit')
                        node.columns.forEach(function(item){
                            var chk = $('<input id="item.name" type="checkbox" checked/>');
                            var li = $('<li class="list-group-item"></li>');
                            var title = $('<span style="margin-left:8px">'+item.name+'</span>');
                            li.append(chk).append(title);
                            $('#table-fields').append(li);
                        });
                        $('#table-selection')[0].checked = false;
                    }
                }, 500)
            });
            this.showEdit = function (evt) {
                var el = evt.target;
                if($(el).html() === 'Edit'){
                    $('#table-fields li input').show();
                    $(el).html('Done');
                }else{
                    $('#table-fields li input').hide();
                    $(el).html('Edit')
                }
            };
            this.hideTableView = function () {
                $('#table-container').css('display', 'none');
            };

            function makeUnselectable(node) {
                if (node.nodeType === 1) {
                    node.setAttribute("unselectable", "on");
                }
                var child = node.firstChild;
                while (child) {
                    makeUnselectable(child);
                    child = child.nextSibling;
                }
            }

            this.toggleBackground1 = function (evt) {
                var selected = $(evt.target)[0].checked;
                var el = $('#table-container');
                var blnAdd = false;
/*
                el.css('background-color') === 'rgb(176, 196, 222)'? el.css('background-color','rgb(144, 238, 144)') : el.css('background-color','rgb(176, 196, 222)');
                if(el.css('background-color') === 'rgb(144, 238, 144)'){
                    blnAdd = true;
                }
*/
                if(selected){
                    $(self.selectedNode).css('fill', fillColors[self.anchoroot.type]);
                    el.css('background-color', backgroundColors[self.anchoroot.type]);
                }else{
                    $(self.selectedNode).css('fill', fillColors['default']);
                    el.css('background-color', backgroundColors['default']);
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
            commonRequestService.getRequestDataQueryString(data)
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
