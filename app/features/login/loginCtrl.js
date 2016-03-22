'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', '$state', 'FirebaseService', 'LoginService', function($scope, $state, FirebaseService, LoginService) {

    var teamsRef = FirebaseService.getFirebase('Teams');

    $scope.addTeam = function() {
        var timestamp = FirebaseService.getTimestamp();
        var team = {
            teamName: $scope.teamName,
            timestamp: timestamp
        };

        $scope.err = LoginService.validateTeamName($scope.teamName);

        if ($scope.err === '') {
            FirebaseService.set(teamsRef, $scope.teamName, team);
        }

        $scope.teamName = '';
    };

}]);
