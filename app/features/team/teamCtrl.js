'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.team.team-controller', [require('angularfire')])

.controller('TeamCtrl', ['$scope', '$state', '$firebaseArray', 'PairsService', 'FirebaseService', '$stateParams', function($scope, $state, $firebaseArray, PairsService, FirebaseService, $stateParams) {

    $scope.persons = FirebaseService.getFirebaseArray('Persons');
    $scope.pairs = FirebaseService.getFirebaseArray('Pairs');

    $scope.addPerson = function() {
        var timestamp = FirebaseService.getTimestamp();
        var person = {
            first: $scope.person.first,
            last: $scope.person.last,
            active: true,
            timestamp: timestamp
        };

        FirebaseService.add($scope.persons, person)
            .then(function(ref) {
                PairsService.generatePairs($scope.pairs, $scope.persons);
            });

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
        FirebaseService.remove($scope.persons, person);
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

}]);
