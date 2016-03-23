'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', '$state', 'FirebaseService', 'LoginService', function($scope, $state, FirebaseService, LoginService) {

    var teamsRef = FirebaseService.getFirebase('Teams');

    $scope.addTeam = function() {
        var timestamp = FirebaseService.getTimestamp();
        var teamName = $scope.newTeamName;
        var team = {
            teamName: teamName,
            timestamp: timestamp
        };

        $scope.addTeamError = LoginService.validateTeamName(teamName);

        if ($scope.addTeamError === '') {
            FirebaseService.set(teamsRef, teamName, team).then(function() {
                $state.go('team', {teamId: teamName});
            });
        }

        $scope.newTeamName = '';
    };

    $scope.goToTeam = function() {
        var teamName = $scope.teamName;

        $scope.goToTeamError = LoginService.findTeamName(teamName);

        if($scope.goToTeamError === '') {
            $state.go('team', {teamId: teamName}, {reload: true, inherit: false, notify: true});
        }

        $scope.teamName = '';
    };

}]);
