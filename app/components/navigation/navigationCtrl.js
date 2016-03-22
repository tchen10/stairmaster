'use strict';

angular.module('stairmaster.navigation.navigation-controller', [])

.controller('NavigationCtrl', ['$scope', '$stateParams', function($scope, $stateParams){
    $scope.teamId = $stateParams.teamId;
}]);
