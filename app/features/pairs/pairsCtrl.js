'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-controller', [require('angularfire')])

.controller('PairsCtrl', ['$scope', '$firebaseArray', 'PairsService', function($scope, $firebaseArray, PairsService) {
    var personsRef = new Firebase('https://stairmaster.firebaseio.com/Persons');
    $scope.persons = $firebaseArray(personsRef);
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');
    var pairs = $firebaseArray(pairsRef);

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
