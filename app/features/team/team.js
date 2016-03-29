'use strict';

require('./teamCtrl.js');
require('./teamService.js');

angular.module('stairmaster.team', [
    'stairmaster.team.team-controller',
    'stairmaster.team.team-service'
])

.directive('readPerson', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/team/_readPerson.html'
    };
})

.directive('editPerson', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/team/_editPerson.html'
    };
});
