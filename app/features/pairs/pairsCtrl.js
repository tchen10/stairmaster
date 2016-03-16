'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-controller', [require('angularfire')])

.controller('PairsCtrl', ['$scope', '$firebaseArray', 'FirebaseService', 'FirebaseRestService', 'StairsFactory', function($scope, $firebaseArray, FirebaseService, FirebaseRestService, StairsFactory) {
    var persons = FirebaseService.getFirebaseArray('Persons');
    var pairs = FirebaseService.getFirebaseArray('Pairs');

    FirebaseRestService.getActivePersons().then(function(response) {
        $scope.activePersons = response.data;
        FirebaseRestService.getActivePairs().then(function(response) {
            $scope.activePairs = response.data;
            $scope.stairs = StairsFactory.generateStairs($scope.activePersons, $scope.activePairs);
        });
    });

    $scope.incrementDays = function(id) {
        var pair = FirebaseService.getRecord(pairs, id);
        pair.days += 1;
        FirebaseService.save(pairs, pair);
    };

    $scope.decrementDays = function(id) {
        var pair = FirebaseService.getRecord(pairs, id);
        if (pair.days !== 0) {
            pair.days -= 1;
            FirebaseService.save(pairs, pair);
        }
    };

    $scope.getPairingDays = function(id) {
        var pair = FirebaseService.getRecord(pairs, id);
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
