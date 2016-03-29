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

    $scope.editPerson = function(id) {
        var person = FirebaseService.getRecord($scope.persons, id);
        $scope.personToUpdate = {};
        $scope.personToUpdate.id = person.$id;
        $scope.personToUpdate.first = person.first;
        $scope.personToUpdate.last = person.last;
        $scope.personToUpdate.active = person.active;
    };

    $scope.updatePerson = function() {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.id);
        person.first = $scope.personToUpdate.first;
        person.last = $scope.personToUpdate.last;
        FirebaseService.save($scope.persons, person)
            .then(function() {
                $state.go('team');
            });
    };

    $scope.deletePerson = function() {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.id);
        FirebaseService.remove($scope.persons, person).then(function() {
            $state.go('team');
        });
    };

    $scope.deactivatePerson = function(active) {
        var person = FirebaseService.getRecord($scope.persons, $scope.personToUpdate.id);
        person.active = !active;
        FirebaseService.save($scope.persons, person)
            .then(function() {
                PairsService.updatePairStatus(active, person);
                $state.go('team');
            });
    };

    $scope.viewPerson = function(id) {
        $scope.personInfo = FirebaseService.getRecord($scope.persons, id);
        $scope.active = $scope.personInfo.active ? 'Active' : 'Inactive';
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
