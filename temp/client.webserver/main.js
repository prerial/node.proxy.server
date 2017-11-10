angular.module('dmcviews', []);
angular.module('dmc.utils', []);
angular.module('dmc.directives', []);
angular.module('app.dmc', ['ngRoute', 'ngMessages', 'ngAnimate', 'dmc.directives', 'dmc.utils', 'dmcviews', 'jlareau.pnotify'])
    .constant('Urls', {
        'getDataSource': angular.testmode? 'data/datasource.json' : '/dmc/v1.0/schemas/getdatasource',
        'getDatabases': angular.testmode? 'data/datasource.json' : '/dmc/v1.0/schemas/getdatabases',
        'getConnectionsData': angular.testmode? 'data/connections.json' : '/dmc/v1.0/schemas/getconnections',
        'saveConnection': angular.testmode? 'data/success.json' : '/dmc/v1.0/schemas/saveconnection',
        'deleteConnection': angular.testmode? 'data/success.json' : '/dmc/v1.0/schemas/deleteconnection',
        'getDashboardGridData': angular.testmode? 'data/erd.json' : '/dmc/v1.0/schemas',
        'getErdData': angular.testmode? 'data/erd.json' : '/dmc/v1.0/schemas/schema_id',
        'getErdAnchorData': angular.testmode? 'data/denorm_json_ddl_dml.json' : '/dmc/v1.0/schemas/denorm'
    })
    .config([ '$locationProvider', '$routeProvider',

        function( $locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/login', {
                    template: '<login-splash></login-splash>'
                })
                .when('/dashboard', {
                    template: '<dashboard></dashboard>'
                })
                .when('/connections', {
                    template: '<connections></connections>'
                })
                .when('/datamodel', {
                    template: '<datamodel></datamodel>'
                })
                .when('/anchormodel', {
                    template: '<anchormodel></anchormodel>'
                })
                .when('/source', {
                    template: '<source-schema></source-schema>'
                })
                .otherwise({redirectTo: '/login'});
        }])
    .controller('AppController',['$scope', '$location', function($scope, $location){

        $scope.isLogon = false;
        $scope.users = [];
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
        $scope.$on('authenticated', function() {
            $scope.isLogon = true;
        });
        $scope.$on('$routeChangeStart', function(event, next, current) {
            if(next.$$route && next.$$route.originalPath === '/login' && $scope.isLogon){
                $scope.isLogon = false;
                $location.path('/login');
            }
            $scope.$broadcast("clearPopups");
            if(!$scope.isLogon){
                $location.path('/login');
            }
        });

    }]);


;angular.module('dmcviews').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('client.webserver/directives/tooltip.html',
    "<div class=\"tooltip-container\"><span class=\"tooltip-arrow\"></span><div class=\"tooltip-inner\"></div></div>"
  );


  $templateCache.put('client.webserver/views/anchorModelView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\"><div style=\"float:right;margin-top:8px\"><button type=\"button\" ng-click=\"$ctrl.cancel()\" class=\"btn btn-xs btn-primary btn-linked\">&lt; Back</button> <button type=\"submit\" class=\"btn btn-xs btn-primary btn-linked\"><a href=\"javascript:void(0)\" id=\"dlbtn\">Save DDL</a></button> <button type=\"submit\" class=\"btn btn-xs btn-primary btn-linked\"><a href=\"javascript:void(0)\" id=\"dmbtn\">Save DML</a></button></div></div><div id=\"erDiagram\" class=\"top\" style=\"position:absolute;top:60px;z-index:100\"></div>"
  );


  $templateCache.put('client.webserver/views/connectionsView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\" style=\"margin-top:0;top:50px\"><div style=\"float:right;margin-top:8px\"><button class=\"btn btn-xs btn-primary btn-linked\"><a href=\"\" data-toggle=\"modal\" ng-click=\"$ctrl.gotoDetail(null)\" data-target=\"#connectionModal\">Add Connection</a></button></div></div><div class=\"container-view\" style=\"margin:110px 40px\"><div><h3>Manage Connections</h3><table class=\"table table-striped table-bordered\"><thead><tr><th></th><th>Data Source Name</th><th>Connection String</th><th>Database Name</th><th>Schema</th><th></th></tr></thead><tr ng-repeat=\"conn in $ctrl.connections\" ng-click=\"$ctrl.gotoDetail(conn, $index)\" ng-class=\"{selected: conn === $ctrl.selectedConn}\"><td style=\"text-align: center\">{{$index+1}}</td><td><a href=\"\" data-toggle=\"modal\" data-target=\"#connectionModal\">{{conn.conn_name}}</a></td><td>{{conn.conn_string }}</td><td>{{conn.conn_db}}</td><td>{{conn.conn_schema}}</td><td style=\"text-align: center\"><button class=\"delete\" ng-click=\"$ctrl.delete(conn); $event.stopPropagation()\">x</button></td></tr></table></div></div><!-- Modal - Manage Connections--><div class=\"modal fade\" id=\"connectionModal\" role=\"dialog\"><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\">Connection Parameters</h4></div><form name=\"connectionForm\" novalidate ng-submit=\"$ctrl.formSubmit($ctrl.connection)\" class=\"form-horizontal\"><div class=\"modal-body\"><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_name\">Data Source Name:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_name\" name=\"conn_name\" id=\"conn_name\" placeholder=\"Please enter connection name\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"username\">User Name:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_username\" name=\"username\" id=\"username\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_password\">Password:</label><div class=\"col-sm-7\"><input type=\"password\" class=\"form-control\" ng-model=\"$ctrl.connection.conn_password\" name=\"conn_password\" id=\"conn_password\" placeholder=\"Please enter Password\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_string\">Connection String:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_string\" name=\"conn_string\" id=\"conn_string\" placeholder=\"Please enter connection string\" ng-required=\"true\" required></div></div><!-- TODO - Replace with below  --><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_db\">Database:</label><div class=\"col-sm-7\"><select class=\"form-control\" ng-model=\"$ctrl.connection.conn_db\" name=\"conn_db\" id=\"conn_db\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Database</option><option ng-repeat=\"option in $ctrl.databases\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_schema\">Schema:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_schema\" id=\"conn_schema\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div></div></div><!--/body--><div class=\"modal-footer\"><div style=\"margin-right:50px\"><button type=\"button\" ng-click=\"\" class=\"btn btn-primary\" data-dismiss=\"modal\">Test Connection</button> <button type=\"submit\" ng-disabled=\"!connectionForm.$valid\" class=\"btn btn-primary\">Save</button> <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button></div></div></form></div></div></div><!--- End Modal -->"
  );


  $templateCache.put('client.webserver/views/dataModelView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\"><form name=\"anchorsForm\" novalidate class=\"form-horizontal\" ng-submit=\"$ctrl.submitForm(source)\"><div style=\"float:right;margin-top:8px\"><label style=\"margin-right:12px\">Select Tables:</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"anchor\"> Anchor</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"include\"> Include</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"exclude\"> Exclude</label><button ng-disabled=\"!anchorsForm.$valid\" type=\"submit\" class=\"btn btn-xs btn-primary\">Submit</button> <button type=\"button\" ng-click=\"$ctrl.resetAnchorsForm()\" class=\"btn btn-xs btn-primary\">Reset</button></div></form></div><div id=\"erDiagram\" class=\"top\" style=\"position:absolute;top:60px;z-index:100\"></div>"
  );


  $templateCache.put('client.webserver/views/loginAdminView.html',
    "<div class=\"container-view\"><div class=\"row\"><div class=\"col-md-12\"><form name=\"loginForm\" novalidate ng-submit=\"formSubmit()\" class=\"form\"><div class=\"col-md-4\"><h3>Please Login</h3><div class=\"form-group\"><label for=\"username\">User Name</label><div id=\"username-error\" class=\"popover\" ng-messages=\"loginForm.username.$error\"><span ng-message=\"required\">User name is required.</span></div><input type=\"text\" id=\"username\" name=\"username\" pre-tooltip class=\"form-control\" ng-model=\"username\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div><div class=\"form-group\"><label for=\"password\">Password</label><div id=\"password-error\" class=\"popover\" ng-messages=\"loginForm.password.$error\"><span ng-message=\"required\">Password is required.</span></div><input type=\"password\" id=\"password\" name=\"password\" pre-tooltip class=\"form-control\" ng-model=\"password\" placeholder=\"Please enter Password\" ng-required=\"true\" required></div><div class=\"form-group\"><button ng-disabled=\"!loginForm.$valid\" type=\"submit\" class=\"btn btn-primary\">Login</button> <span class=\"text-danger\">{{ error }}</span></div></div></form></div></div></div>"
  );


  $templateCache.put('client.webserver/views/sourceSchemaView.html',
    "<div class=\"container container-view\"><div class=\"row\"><div class=\"col-md-14\"><div class=\"row\"><div class=\"col-md-6\"><h3 class=\"col-sm-offset-4\">Reverse Engineering</h3><form name=\"sourceSchemaForm\" novalidate class=\"form-horizontal\" ng-submit=\"$ctrl.submitForm(source)\"><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"source_include\" style=\"white-space:nowrap\">Data Source:</label><div class=\"col-sm-8\"><select ng-model=\"source.schema_include\" class=\"form-control\" id=\"source_include\" name=\"source_include\" placeholder=\"Please select source\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Data Source</option><option ng-repeat=\"option in $ctrl.datasource.dataSource\" value=\"{{option.conn_name}}\">{{option.conn_name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"target\" style=\"white-space:nowrap\">Data Model Type:</label><div class=\"col-sm-8\"><select ng-model=\"source.schema_target\" class=\"form-control\" id=\"target\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Database</option><option ng-repeat=\"option in $ctrl.datasource.dataModelType\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"sdatabase\">Source Database:</label><div class=\"col-sm-8\"><select ng-model=\"source.sdatabase\" class=\"form-control\" id=\"sdatabase\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Source Database</option><option ng-repeat=\"option in $ctrl.datasource.databaseSource\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tdatabase\">Target Database:</label><div class=\"col-sm-8\"><select ng-model=\"source.tdatabase\" class=\"form-control\" id=\"tdatabase\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Target Database</option><option ng-repeat=\"option in $ctrl.datasource.databaseTarget\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><div class=\"col-sm-offset-4 col-sm-8\"><div class=\"checkbox\"><label><input ng-model=\"source.single\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\" value=\"false\" name=\"single\">Single Step Denormalization</label></div></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"anchor\">Anchors:</label><div class=\"col-sm-8\"><input ng-model=\"source.anchors\" class=\"form-control\" id=\"anchor\" placeholder=\"Enter list of Anchor tables\" name=\"anchor\"></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tbl_incl\" style=\"white-space:nowrap\">Include Tables:</label><div class=\"col-sm-8\"><input ng-model=\"source.tables_include\" class=\"form-control\" id=\"tbl_incl\" placeholder=\"Enter list of tables to include\" name=\"tbl_incl\"></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tbl_excl\" style=\"white-space:nowrap\">Exclude Tables:</label><div class=\"col-sm-8\"><input ng-model=\"source.tables_exclude\" class=\"form-control\" id=\"tbl_excl\" placeholder=\"Enter list of tables to exclude\" name=\"tbl_excl\"></div></div><div class=\"form-group\"><div class=\"col-sm-offset-4 col-sm-8\"><button ng-disabled=\"!sourceSchemaForm.$valid\" type=\"submit\" class=\"btn btn-primary\">Submit</button> <button type=\"button\" class=\"btn btn-primary btn-linked\"><a href=\"#/connections\">Close</a></button></div></div><!--                <pre>source = {{source | json}}</pre> --></form></div></div></div></div></div>"
  );

}]);
;(function(){
    "use strict";

    angular.module('app.dmc').factory('CommonRequestService', ['$rootScope', '$q', '$http', 'Urls',
        function($rootScope, $q, $http, Urls) {

            return {
                getRequestDataQueryString: getRequestDataQueryString,
                getRequestDataByID: getRequestDataByID,
                postRequestData: postRequestData,
                getRequestData: getRequestData
            };
            function toQueryString(obj) {
                var parts = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
                    }
                }
                return parts.join("&");
            }
            function httpPost(url, dt){
                var deferred = $q.defer();
                if(url){
                    $http.post(url, dt)
                        .then(function (data) {
                            deferred.resolve(data);
                        })
                        .catch(function (msg) {
                            $rootScope.$broadcast('error:server', msg);
                            deferred.reject(msg);
                        });

                }else{
                    deferred.reject({'responseText':'REST url error'});

                }
                return deferred.promise;
            }
            function httpGet(url){
                var deferred = $q.defer();
                if(url){
                    $http.get(url)
                    .then(function (data) {
                        deferred.resolve(data);
                    })
                    .catch(function (msg, a, b, c) {
                        $rootScope.$broadcast('error:server', msg);
                        deferred.reject(msg);
                    });
                }else{
                        deferred.reject({'responseText':'REST url error'});
                }
                return deferred.promise;
            }
            function postRequestData(data){
                return httpPost(Urls[data.requestType], data);
            }
            function getRequestData(dt){
                var url = Urls[dt.requestType];
                if(dt.data){
                    url = url + '?' + dt.data;
                }
                return httpGet(url);
            }
            function getRequestDataQueryString(dt){
                var url = Urls[dt.requestType] + '?' + toQueryString(dt.data);
                return httpGet(url);
            }
            function getRequestDataByID(url){
                return httpGet(url);
            }
        }]);
})();
;(function() {
    "use strict";
    angular.module('app.dmc').factory('GraphService', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {

            var w = 1800,
                h = 1900,
                i = 0,
                duration = 500,
                root, tree, diagonal, zoomListener, vis, svgGroup;

            function zoom() {
                svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function toggleBackground(el, tblName) {
                var blnAdd = false;
                el.css('fill') === 'rgb(176, 196, 222)'? el.css('fill','rgb(144, 238, 144)') : el.css('fill','rgb(176, 196, 222)');
                if(el.css('fill') === 'rgb(144, 238, 144)'){
                    blnAdd = true;
                }
                $rootScope.$broadcast('setAnchors', tblName, blnAdd);
            }

            function initialize(){
                root = {};
                tree = d3.layout.tree().size([h, w - 160]);
                diagonal = d3.svg.diagonal()
                    .source(function (d) {
                        return {
                            "x": d.source.x + d.source.height / 2,
                            "y": d.source.y + 150
                        };
                    })
                    .target(function (d) {
                        return {
                            "x": d.target.x + d.target.height / 2,
                            "y": d.target.y + 100
                        };
                    })
                    .projection(function (d) {
                        return [d.x + 15, d.y - 30];
                    });

                // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
                zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

                vis = d3.select('#erDiagram').append("svg:svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("transform", "translate(0,0)")
                    .call(zoomListener);

                svgGroup = vis.append("g");
            }

            function update(source) {
                var nodes = tree.nodes(root).reverse();

                var node = svgGroup.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function () {
                        return "translate(" + source.x0 + "," + source.y0 + ")";
                    });

                nodeEnter.append("svg:rect")
                    .attr("width", 150)
                    .attr("height", 500)
                    .attr('y', -1)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '3px')
                    .attr("id", function (d) {
                        return d._children;
                    })
                    .on("click", function(nodeObj){
                        var el = $(d3.select(this)[0][0]);
                        toggleBackground(el, nodeObj.name);
                    })
                    .on({
                        "mouseover": function() {
                            d3.select(this).style("cursor", "pointer");
                        },
                        "mouseout": function() {
                            d3.select(this).style("cursor", "default");
                        }
                    });

                nodeEnter.append("text")
                    .attr("x", function (d) {
                        return d._children ? -8 : 8;
                    })
                    .attr("y", 3)
                    .attr("dy", "0.68em")
                    .text(function (d) {
                        return d.name;
                    });

                $('.node text').on('click', function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                    var el = evt.target.parentNode.previousSibling;
                    var tblName = evt.target.parentNode.children[0].innerHTML;
                    toggleBackground($(el), tblName);
                })
                .on({
                    "mouseover": function(evt) {
                        var el = evt.target;
                        $(el).css("cursor", "pointer");
                    },
                    "mouseout": function(evt) {
                        var el = evt.target;
                        $(el).css("cursor", "default");
                    }
                }).on('dblclick', function(evt){
                    evt.preventDefault();
                    evt.stopPropagation();
                });

                wrap(d3.selectAll('text'), 450);

                nodeEnter.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + (d.x-50) + "," + (d.y+50) + ")";
                    })
                    .style("opacity", 1)
                    .select("rect")
                    .style("fill", "#b0c4de");

                node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + (d.x-50) + "," + (d.y+50) + ")";
                    })
                    .style("opacity", 1);


                node.exit().transition()
                    .duration(duration)
                    .attr("transform", function () {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .style("opacity", 1e-6)
                    .remove();

                var link = svgGroup.selectAll("path.link")
                    .data(tree.links(nodes), function (d) {
                        return d.target.id;
                    });

                svgGroup.selectAll("path.link").attr();
                link.enter().insert("svg:path", "g")
                    .attr("class",  function (d) {
                        if(d.source && d.source.name && root.name &&d.source.name === root.name){
                            return "link_dashed";
                        }else{
                            return "link_continuous";
                        }
                    })
                    .attr("marker-mid","ArrowHead")
                    //return (d.source != root) ? "link_dashed" : "link_continuous" ; })
                    .attr("d", function () {
                        var o = {
                            x: source.x0,
                            y: source.y0,
                            height: source.height
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);


                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                link.exit().transition()
                    .duration(duration)
                    .attr("d", function () {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();


                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function wrap(text, width) {
                text.each(function (d) {
                    var text = d3.select(this),
                        words = d.name.split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1,
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dx", ".6em").attr("dy", dy + "em").attr('font-weight', 'bold').attr('fill','#204d74');
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
/*
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
*/
                        if(d.columns){
                            d.columns.forEach(function(c){
                                dy = dy + 1;
                                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dx", ".6em").attr("dy", dy + "em").text(c.name);
                            });
                        }
                    }

                    var textBox = text.node().getBBox();

                    d.height = 19 * (lineNumber + 1);
                    d3.select(this.parentNode.children[0]).attr('height', textBox.height + 10);

                });
            }

            function buildGraph(erData, blnTranslate) {
                initialize();
                root = erData[0];
                root.x0 = h / 2;
                root.y0 = 0;
                update(root);
                var nodes = $('.node').toArray();
                var dashed = $('.link_dashed').toArray();
                function setStatic(){

                    dashed.forEach(function(mem){
                        $(mem).css('display', 'none');
                    });
                    var left = 100;
                    nodes.forEach(function(mem){
                        var tr = 'translate(' + left + ',80)';
                        $(mem).attr('transform', tr);
                        left = left + 200;
                    });
                    $(nodes[nodes.length - 1]).css('display', 'none');
                    $('#erDiagram').css('visibility','visible').css('width', nodes.length * 300);
                    $('#erDiagram svg').attr('width', nodes.length * 300);
                    $('#erDiagram svg').css('width', nodes.length * 300);
                }
                if(blnTranslate){
                    $('#erDiagram').css('visibility','hidden');
                    $timeout(setStatic, 1000);
                }
            }

            return {
                buildGraph: buildGraph
            };

    }]);
})();
;(function(){
    "use strict";

    angular.module('app.dmc').factory('LoginService', function() {
        var admin = 'admin';
        var pass = 'pass';
        var isAuthenticated = false;

        return {
            login : function(username, password) {
                isAuthenticated = username === admin && password === pass;
                return isAuthenticated;
            },
            isAuthenticated : function() {
                return isAuthenticated;
            }
        };

    });

})();
;(function() {
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

;(function(){
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
;(function () {
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

})();;(function() {
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
;/**
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

;(function() {
    "use strict";

    angular.module('app.dmc').component('datamodel', {
        templateUrl: 'client.webserver/views/dataModelView.html',
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
;(function() {
    "use strict";

    angular.module('app.dmc').component('loginSplash', {
        templateUrl: 'client.webserver/views/loginAdminView.html',
        controller: 'LoginController'

    });
    angular.module('app.dmc').controller('LoginController', ['$scope','$rootScope', '$location', '$timeout', 'notificationService', 'LoginService',
          function($scope, $rootScope, $location, $timeout, notificationService, loginService) {

              $scope.formSubmit = function() {
                  $scope.expired = false;
                  if(loginService.login($scope.username, $scope.password)) {
                      $rootScope.$broadcast('authenticated');
                      $scope.error = '';
                      $scope.username = '';
                      $scope.password = '';
                      $location.url('/source');
                  } else {
                      $timeout(function() { $scope.expired = true; }, 5000);
                      notificationService.error('Incorrect username/password!');
                  }
              };

        }]);

})();
;(function() {
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
