'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.team.team-controller', [require('angularfire')])

.controller('TeamCtrl', ['$scope', '$state', '$firebaseArray', 'PairsService', function($scope, $state, $firebaseArray, PairsService) {
    var personsRef = new Firebase('https://stairmaster.firebaseio.com/Persons');
    $scope.persons = $firebaseArray(personsRef);
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');
    $scope.pairs = $firebaseArray(pairsRef);

    $scope.addPerson = function() {
        $scope.persons.$add({
            first: $scope.person.first,
            last: $scope.person.last,
            active: true,
            timestamp: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
            PairsService.generatePairs($scope.pairs, $scope.persons);
        });

        $scope.person.first = '';
        $scope.person.last = '';
    };

    $scope.editPerson = function(id) {
        var person = $scope.persons.$getRecord(id);
        $scope.personToUpdate = {};
        $scope.personToUpdate.id = person.$id;
        $scope.personToUpdate.first = person.first;
        $scope.personToUpdate.last = person.last;
        $scope.personToUpdate.active = person.active;
    };

    $scope.updatePerson = function() {
        var person = $scope.persons.$getRecord($scope.personToUpdate.id);
        person.first = $scope.personToUpdate.first;
        person.last = $scope.personToUpdate.last;
        $scope.persons.$save(person).then(function() {
            $state.go('team');
        });
    };

    $scope.deletePerson = function() {
        var person = $scope.persons.$getRecord($scope.personToUpdate.id);
        $scope.persons.$remove(person);
    };

    $scope.deactivatePerson = function(active) {
        var person = $scope.persons.$getRecord($scope.personToUpdate.id);
        active ? person.active = false : person.active = true;
        $scope.persons.$save(person).then(function() {
            $state.go('team');
        });
    };

}]);
