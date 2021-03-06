'use strict';

angular.module('stairmaster.persons.persons-service', [])

.service('PersonService', [function() {

    return {
        validateName: function(name) {
            if (name.length < 1) {
                return 'Name must be at least 1 character';
            } else if (!(/^[a-zA-Z0-9]+$/.test(name))) {
                return 'Name can only have alphanumeric characters';
            }
            return '';
        }
    };

}]);
