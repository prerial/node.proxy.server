(function() {
    "use strict";

    angular.module('app.dmc').component('datamodel', {
        templateUrl: 'client.webserver/views/dataModelView.html',
        controller: 'DataModelController'

    });
    angular.module('app.dmc').controller('DataModelController', ['$scope', '$location', '$timeout', 'notificationService', 'UtilsService', 'messageService', 'CommonRequestService', 'GraphService',
        function($scope, $location, $timeout, notification, utilsService, messageService, commonRequestService, graphService) {

            var self = this;
            this.dblclicked = false;
            this.selectedEl = undefined;
            this.selectedNode = undefined;
            this.data = [];
            this.anchors = [];
            var fillColors = {
                "default": "black",
                "anchor": "darkred",
                "include": "darkgreen",
                "exclude": "darkblue"
            };
            var backgroundColors = {
                "default": "rgb(239, 239, 239)",
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

            $scope.$on('toggleCollapse', function(){
                self.hideTableView();
            });

            $scope.$on('hideTable', function(evt, el, node){
                self.dblclicked = true;
                el.attr("unselectable", "on");
                utilsService.makeUnselectable(el[0]);
                var anchor = self.anchoroot.type;
                el.css('fill', fillColors[self.anchoroot.type]);
                node['color'] = self.anchoroot.type;
                self.hideTableView();
                $timeout(function(){
                    self.dblclicked = false;
                }, 500);
                self.setAnchors(node['name'], true);
            });
            $scope.$on('showTable', function(evt, el, node){
                self.selectedEl = el;
                self.selectedNode = node;
                $timeout(function(){
                    if(!self.dblclicked){
                        if(node['color']){
                            $('#table-container').css('background-color', backgroundColors[node['color']]);
                            node['color'] === 'default'?$('#table-selection')[0].checked =  false:$('#table-selection')[0].checked =  true;
                        }else{
                            node['color'] = 'default';
                            $('#table-container').css('background-color', backgroundColors['default'])
                            $('#table-selection')[0].checked = false;
                        }
                        $('#table-container').css('transition', 'all 800ms').css('display', 'block').css('top', node.x-20).css('left', node.y);
                        $('#table-title').html(node.name);
                        $('#table-fields').html('');
                        $('#table-header button').html('Edit');
                        node.columns.forEach(function(item){
                            var chk = $('<input id="item.name" type="checkbox" checked/>');
                            var li = $('<li class="list-group-item"></li>');
                            var title = $('<span style="margin-left:8px">'+item.name+'</span>');
                            li.append(chk).append(title);
                            $('#table-fields').append(li);
                        });
                        $('#field-select-all').hide();
                        $('#field-select-all')[0].checked = true;
                    }
                }, 500)
            });
            this.showEdit = function (evt) {
                var el = evt.target;
                if($(el).html() === 'Edit'){
                    $('#table-fields li input').show();
                    $('#field-select-all').show();
                    $(el).html('Done');
                }else{
                    $('#table-fields li input').hide();
                    $('#field-select-all').hide();
                    $(el).html('Edit')
                }
            };
            this.toggleSelection = function(evt){
                var arr = $('#table-fields li input');
                var checked = $('#field-select-all')[0].checked;
                arr.each(function(idx, chk){
                    chk.checked = checked;
                });
            };
            this.hideTableView = function () {
                $('#table-container').css('display', 'none');
            };

            this.toggleBackground1 = function (evt) {
                var selected = $(evt.target)[0].checked;
                var el = $('#table-container');
                var blnAdd = false;
                if(selected){
                    $(self.selectedEl).css('fill', fillColors[self.anchoroot.type]);
                    $(self.selectedNode).attr('color', self.anchoroot.type);
                    el.css('background-color', backgroundColors[self.anchoroot.type]);
                    blnAdd = true;
                }else{
                    $(self.selectedEl).css('fill', fillColors['default']);
                    $(self.selectedNode).attr('color', 'default');
                    el.css('background-color', backgroundColors['default']);
                }
                self.setAnchors(self.selectedNode['name'], blnAdd);
            };

            this.setAnchors = function(anchor, blnAdd){
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
//                $scope.$apply();
             };

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
                        graphService.setColors(fillColors);
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
