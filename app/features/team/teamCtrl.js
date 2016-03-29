'use strict';

angular.module('stairmaster.team.team-controller', [])

.controller('TeamCtrl', ['$scope', 'FirebaseService', '$stateParams', function($scope, FirebaseService, $stateParams) {

    $scope.teamId = $stateParams.teamId;
    $scope.persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    $scope.pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    $scope.viewPerson = function(id) {
        var person = FirebaseService.getRecord($scope.persons, id);
        $scope.personInfo = angular.copy(person);
        $scope.personToUpdate = angular.copy(person);
    };

}]);
