'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.team.team-controller', [require('angularfire')])

.controller('TeamCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var ref = new Firebase('https://stairmaster.firebaseio.com/Tasks');
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
        $scope.personToUpdate = $scope.persons.$getRecord(id);
    };

    $scope.updatePerson = function() {
        $scope.persons.$save($scope.personToUpdate);
    };

    $scope.deletePerson = function(id) {
        $scope.persons.$remove($scope.persons.$getRecord(id));
    };

}]);
