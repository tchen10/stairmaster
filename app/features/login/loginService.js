'use strict';

angular.module('stairmaster.login.login-service', [])

.service('LoginService', ['FirebaseService', function(FirebaseService) {

    var teams = FirebaseService.getFirebaseArray('Teams');

    return {
        validateTeamName: function(teamName) {
            if (teamName.length < 6) {
                return 'Team name must be at least 6 characters';
            } else if (!(/^\S{3,}$/.test(teamName))) {
                return 'Team name cannot have spaces';
            } else if (!(/^[a-zA-Z0-9]+$/.test(teamName))) {
                return 'Team name can only have alphanumeric characters';
            }
            else if (FirebaseService.getRecord(teams, teamName) !== null) {
                return 'Team name "' + teamName + '" already exists';
            }
            return '';
        }
    };

}]);
