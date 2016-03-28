'use strict';

angular.module('stairmaster.navigation.auth-service', [])

.service('AuthService', ['FirebaseService', '$state', function(FirebaseService, $state) {

    return {
        checkExistingTeam: function(event, teamName) {
            if (teamName) {
                var teamsRef = FirebaseService.getFirebase('Teams');
                teamsRef.once('value').then(function(snapshot) {
                    if (!snapshot.hasChild(teamName)) {
                        event.preventDefault();
                        $state.go('login');
                    }
                });
            }
        }
    };

}]);
