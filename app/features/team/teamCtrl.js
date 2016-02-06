'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.team.team-controller', [require('angularfire')])

.controller('TeamCtrl', ['$scope', '$state', '$firebaseArray', function($scope, $state, $firebaseArray) {
    var ref = new Firebase('https://stairmaster.firebaseio.com/Persons');
    $scope.persons = $firebaseArray(ref);

    $scope.addPerson = function() {
        $scope.persons.$add({
            first: $scope.person.first,
            last: $scope.person.last,
            timestamp: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
            // Add success message
        }, function(error) {
            // Add error message
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
    };

    $scope.updatePerson = function() {
        var person = $scope.persons.$getRecord($scope.personToUpdate.id);
        person.first = $scope.personToUpdate.first;
        person.last = $scope.personToUpdate.last;
        $scope.persons.$save(person).then(function() {
            $state.go('team');
        });
    };

    $scope.deletePerson = function(id) {
        $scope.persons.$remove($scope.persons.$getRecord(id));
    };

}]);
