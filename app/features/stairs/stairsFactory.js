'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.stairs.stairs-factory', [require('angularfire')])

.factory('StairsFactory', ['FirebaseService', function(FirebaseService) {

    return {
        generateStairs: function(persons, pairs) {
            var timestamp = FirebaseService.getTimestamp();
            var stairs = {
                rows: {},
                timestamp: timestamp
            };
            var rowNumber = 0;

            angular.forEach(persons, function(person, personKey) {
                if (Object.keys(persons).length > 0) {
                    var personId = personKey;
                    var rowKey = 'row' + rowNumber;
                    stairs.rows[rowKey] = {};
                    var row = stairs.rows[rowKey];

                    row.pairs = {};
                    var pairNumber = 0;
                    angular.forEach(pairs, function(pair, pairKey) {
                        var pairId = pairKey;
                        row.name = person.first;
                        var pairIdentifier = 'pair' + pairNumber;
                        if (pair.person1 === personId) {
                            row.pairs[pairIdentifier] = { id: pairId };
                            pairNumber++;
                            delete pairs[pair];
                        }
                    });
                    rowNumber++;
                }
            });

            return stairs;
        }
    };

}]);
