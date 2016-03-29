'use strict';

require('./personCtrl');
require('./personService');

angular.module('stairmaster.persons', [
    'stairmaster.persons.persons-controller',
    'stairmaster.persons.persons-service'
])

.directive('readPerson', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/persons/_readPerson.html'
    };
})

.directive('editPerson', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/persons/_editPerson.html'
    };
});

