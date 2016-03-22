'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', '$state', 'FirebaseService', 'LoginService', function($scope, $state, FirebaseService, LoginService) {

    var teamsRef = FirebaseService.getFirebase('Teams');

    $scope.addTeam = function() {
        var timestamp = FirebaseService.getTimestamp();
        var teamName = $scope.teamName;
        var team = {
            teamName: teamName,
            timestamp: timestamp
        };

        $scope.err = LoginService.validateTeamName(teamName);

        if ($scope.err === '') {
            FirebaseService.set(teamsRef, teamName, team).then(function() {
                $state.go('team', {teamId: teamName});
            });
        }

        $scope.teamName = '';
    };

}]);
