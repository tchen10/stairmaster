'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', '$state', 'FirebaseService', function($scope, $state, FirebaseService) {

    var teamsRef = FirebaseService.getFirebase('Teams');

    $scope.addTeam = function() {
        var timestamp = FirebaseService.getTimestamp();
        var team = {
            teamName: $scope.teamName,
            timestamp: timestamp
        };

        FirebaseService.set(teamsRef, $scope.teamName, team);

        $scope.teamName = '';
    };

}]);
