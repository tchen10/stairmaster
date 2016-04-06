'use strict';

angular.module('stairmaster.pairs.pairs-controller', [])

.controller('PairsCtrl', ['$scope', 'FirebaseService', 'FirebaseRestService', 'StairsFactory', function($scope, FirebaseService, FirebaseRestService, StairsFactory) {
    var persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    var pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    FirebaseRestService.getActivePersons().then(function(response) {
        $scope.activePersons = response.data;
        FirebaseRestService.getActivePairs().then(function(response) {
            $scope.activePairs = response.data;
            $scope.stairs = StairsFactory.generateStairs($scope.activePersons, $scope.activePairs);
        });
    });

    $scope.incrementDays = function(id) {
        var days = FirebaseService.getPerTeamFirebaseArray('Pairs/' + id + '/Days');
        var day = {
            date: moment().format('ll'),
            timestamp: FirebaseService.getTimestamp()
        };
        FirebaseService.add(days, day);
    };

    $scope.incrementDayCount = function(count) {
        return count + 1;
    };

    $scope.decrementDays = function(id, count) {
        if (count > 0) {
            var days = FirebaseService.getPerTeamFirebaseArray('Pairs/' + id + '/Days');
            FirebaseService.loaded(days).then(function(days) {
                var day = days[count - 1];
                FirebaseService.remove(days, day);
            });
        }
    };

    $scope.decrementDayCount = function(count) {
        if (count > 0) {
            return count - 1;
        } else {
            return count;
        }
    };

    $scope.getPersonName = function(id) {
        var person = FirebaseService.getRecord(persons, id);
        return person.first + ' ' + person.last;
    };

    $scope.deleteDay = function(pairId, dayId) {
        var ref = FirebaseService.getPerTeamFirebase('Pairs/' + pairId + '/Days/' + dayId);
        ref.remove();
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
