(function() {
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
