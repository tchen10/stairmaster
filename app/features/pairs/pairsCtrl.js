'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-controller', [require('angularfire')])

.controller('PairsCtrl', ['$scope', '$firebaseArray', 'FirebaseService', function($scope, $firebaseArray, FirebaseService) {
    $scope.persons = FirebaseService.getFirebaseArray('Persons');
    $scope.pairs = FirebaseService.getFirebaseArray('Pairs');

    $scope.incrementDays = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        pair.days += 1;
        FirebaseService.save($scope.pairs, pair);
    };

    $scope.decrementDays = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        if (pair.days !== 0) {
            pair.days -= 1;
            FirebaseService.save($scope.pairs, pair);
        }
    };

    $scope.getPairingDays = function(id) {
        var pair = FirebaseService.getRecord($scope.pairs, id);
        return pair.days;
    };
}])

.filter('reverse', function() {
    function toArray(list) {
        var k, out = [];
        if (list) {
            if (angular.isArray(list)) {
                out = list;
            } else if (typeof(list) === 'object') {
                for (k in list) {
                    if (list.hasOwnProperty(k)) { out.push(list[k]); }
                }
            }
        }
        return out;
    }
    return function(items) {
        return toArray(items).slice().reverse();
    };
});
