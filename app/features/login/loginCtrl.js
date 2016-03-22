'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', '$state', 'FirebaseService', function($scope, $state, FirebaseService) {

    $scope.message = 'Welcome';

}]);
