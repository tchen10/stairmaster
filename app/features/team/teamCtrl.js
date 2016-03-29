'use strict';

angular.module('stairmaster.team.team-controller', [])

.controller('TeamCtrl', ['$scope', '$state', 'PairsService', 'FirebaseService', '$stateParams', 'TeamService', function($scope, $state, PairsService, FirebaseService, $stateParams, TeamService) {

    $scope.teamId = $stateParams.teamId;
    $scope.persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    $scope.pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    $scope.addPerson = function() {
        var timestamp = FirebaseService.getTimestamp();
        var person = {
            first: $scope.person.first,
            last: $scope.person.last,
            active: true,
            timestamp: timestamp
        };

        $scope.firstError = TeamService.validateName($scope.person.first);
        $scope.lastError = TeamService.validateName($scope.person.last);

        if (!$scope.firstError && !$scope.lastError) {
            FirebaseService.add($scope.persons, person)
                .then(function(ref) {
                    PairsService.generatePairs($scope.pairs, $scope.persons);
                });
        }

        $scope.person.first = '';
        $scope.person.last = '';
    };

    $scope.updatePerson = function() {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.$id);
        person.first = $scope.personToUpdate.first;
        person.last = $scope.personToUpdate.last;
        FirebaseService.save($scope.persons, person)
            .then(function() {
                $state.go('team.info');
            });
    };

    $scope.deletePerson = function() {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.$id);
        FirebaseService.remove($scope.persons, person).then(function() {
            $state.go('team');
        });
    };

    $scope.deactivatePerson = function(active) {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.$id);
        person.active = !active;
        FirebaseService.save($scope.persons, person)
            .then(function() {
                PairsService.updatePairStatus(active, person);
                $scope.personToUpdate.active = !active;
            });
    };

    $scope.viewPerson = function(id) {
        var person = FirebaseService.getRecord($scope.persons, id);
        $scope.personInfo = angular.copy(person);
        $scope.personToUpdate = angular.copy(person);
    };

    $scope.getPairingDays = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        return pair.days;
    };

    $scope.getPairStatus = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        return pair.active ? 'Active' : 'Inactive';
    };

}]);
