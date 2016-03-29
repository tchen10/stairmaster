'use strict';

angular.module('stairmaster.persons.persons-controller', [])

.controller('PersonCtrl', ['$scope', '$state', 'PairsService', 'FirebaseService', 'PersonService', function($scope, $state, PairsService, FirebaseService, PersonService) {

    var persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    var pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    $scope.addPerson = function() {
        var timestamp = FirebaseService.getTimestamp();
        var person = {
            first: $scope.person.first,
            last: $scope.person.last,
            active: true,
            timestamp: timestamp
        };

        $scope.firstError = PersonService.validateName($scope.person.first);
        $scope.lastError = PersonService.validateName($scope.person.last);

        if (!$scope.firstError && !$scope.lastError) {
            FirebaseService.add(persons, person)
                .then(function(ref) {
                    PairsService.generatePairs(pairs, persons);
                });
        }

        $scope.person.first = '';
        $scope.person.last = '';
    };

    $scope.updatePerson = function() {
        var person = FirebaseService.getRecord(persons, $scope.personToUpdate.$id);
        person.first = $scope.personToUpdate.first;
        person.last = $scope.personToUpdate.last;
        FirebaseService.save(persons, person)
            .then(function() {
                $state.go('team.info');
            });
    };

    $scope.deletePerson = function() {
        var person = FirebaseService.getRecord(persons, $scope.personToUpdate.$id);
        FirebaseService.remove(persons, person).then(function() {
            $state.go('team');
        });
    };

    $scope.deactivatePerson = function(active) {
        var person = FirebaseService.getRecord(persons, $scope.personToUpdate.$id);
        person.active = !active;
        FirebaseService.save(persons, person)
            .then(function() {
                PairsService.updatePairStatus(active, person);
                $scope.personToUpdate.active = !active;
            });
    };

    $scope.getPairingDays = function(id) {
        var pair = FirebaseService.getRecord(pairs, id);
        return pair.days;
    };

    $scope.getPairStatus = function(id) {
        var pair = FirebaseService.getRecord(pairs, id);
        return pair.active ? 'Active' : 'Inactive';
    };

}]);
