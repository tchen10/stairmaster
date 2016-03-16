'use strict';

angular.module('stairmaster.login.login-service', [])

.service('LoginService', [function() {

    return {
        validateInput: function(properties) {
            var error = null;
            if (!properties.email) {
                error = 'Please enter an email address';
            } else if (!properties.password || !properties.confirmPassword) {
                error = 'Please enter a password';
            } else if (properties.createMode && properties.password !== properties.confirmPassword) {
                error = 'Passwords do not match';
            } else if (properties.createMode && !properties.teamName) {
                error = 'Please enter a team name';
            }
            return error;
        }
    };

}]);
