'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-controller', [require('angularfire')])

.controller('PairsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');
    $scope.pairs = $firebaseArray(pairsRef);
    var personsRef = new Firebase('https://stairmaster.firebaseio.com/Persons');
    $scope.persons = $firebaseArray(personsRef);

}]);
