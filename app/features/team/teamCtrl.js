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

    $scope.viewPair = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        var days = FirebaseService.getPerTeamFirebaseArray('Pairs/' + id + '/Days');
        $scope.pairHistory = angular.copy(pair);
        $scope.pairingDays = days;
    };

    $scope.getPersonName = function(id) {
        var person = FirebaseService.getRecord($scope.persons, id);
        return person.first;
    };

}]);
