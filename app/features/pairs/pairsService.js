'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-service', [require('angularfire')])

.service('PairsService', ['$firebaseArray', 'FirebaseService', function($firebaseArray, FirebaseService) {
    var persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    var pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    return {
        updatePairStatus: function(active, person) {
            var that = this;
            var pairsToUpdate = person.pairs;
            angular.forEach(pairsToUpdate, function(pair, key) {
                var pairToUpdate = FirebaseService.getRecord(pairs, key);
                if (!active) {
                    var person1 = FirebaseService.getRecord(persons, pair.person1.id);
                    var person2 = FirebaseService.getRecord(persons, pair.person2.id);
                    pairToUpdate.active = that._setPairStatus(person1, person2);
                } else {
                    pairToUpdate.active = false;
                }
                FirebaseService.save(pairs, pairToUpdate);
            });
        },

        generatePairs: function(pairs, persons) {
            var that = this;
            var i, j;
            for (i = 0; i < persons.length; i++) {
                for (j = i + 1; j < persons.length; j++) {
                    if (that._isUniquePair(pairs, FirebaseService.getFirebaseId(persons[i]), FirebaseService.getFirebaseId(persons[j]))) {
                        that._addPairToDatabase(pairs, persons[i], persons[j]);
                    }
                }
            }

            return pairs;
        },

        _addPairToDatabase: function(pairs, person1, person2) {
            var that = this;
            var person1Id = FirebaseService.getFirebaseId(person1);
            var person2Id = FirebaseService.getFirebaseId(person2);
            var active = that._setPairStatus(person1, person2);

            var pair = {
                person1: {
                    id: person1Id,
                    person: {
                        first: person1.first,
                        last: person1.last
                    }
                },
                person2: {
                    id: person2Id,
                    person: {
                        first: person2.first,
                        last: person2.last
                    }
                },
                days: 0,
                active: active
            };

            FirebaseService.add(pairs, pair);
        },

        _isUniquePair: function(pairs, person1Id, person2Id) {
            var isUnique = true;

            angular.forEach(pairs, function(pair) {
                if (pair.person1.id === person1Id &&
                    pair.person2.id === person2Id) {
                    isUnique = false;
                }
            });

            return isUnique;
        },

        _setPairStatus: function(person1, person2) {
            if (person1.active && person2.active) {
                return true;
            } else {
                return false;
            }
        }
    };
}]);
