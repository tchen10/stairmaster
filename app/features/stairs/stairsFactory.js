'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.stairs.stairs-factory', [require('angularfire')])

.factory('StairsFactory', ['FirebaseService', function(FirebaseService) {
    return {
        generateStairs: function(persons, firebasePairs) {
            var pairs = firebasePairs;
            var timestamp = FirebaseService.getTimestamp();
            var stairs = {
                rows: {},
                timestamp: timestamp
            };
            var rowNumber = 0;

            angular.forEach(persons, function(person, personKey) {
                if (Object.keys(pairs).length > 0) {
                    var personId = personKey;
                    var rowKey = 'row' + rowNumber;
                    stairs.rows[rowKey] = {};
                    var row = stairs.rows[rowKey];

                    row.pairs = {};
                    var pairNumber = 0;
                    angular.forEach(pairs, function(pair, pairId) {
                        row.name = person.first;
                        var pairKey = 'pair' + pairNumber;
                        if (pair.person1.id === personKey) {
                            row.pairs[pairKey] = { id: pairId };
                            delete pairs[pairId];
                        }
                        pairNumber++;
                    });
                    rowNumber++;
                }
            });

            return stairs;
        }
    };

}]);
