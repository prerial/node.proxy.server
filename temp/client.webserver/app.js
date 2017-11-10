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


