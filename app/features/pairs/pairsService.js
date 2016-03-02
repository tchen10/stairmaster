'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-service', [require('angularfire')])

.service('PairsService', ['$firebaseArray', function($firebaseArray) {
    var personsRef = new Firebase('https://stairmaster.firebaseio.com/Persons');
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');
    var pairs = $firebaseArray(pairsRef);
    var persons = $firebaseArray(personsRef);

    pairsRef.on('child_added', function(snapshot) {
        var pair = snapshot.val();
        var person1Id = pair.person1.id;
        var person2Id = pair.person2.id;
        personsRef.child(person1Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person2Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person1Id + '/stairs/' + snapshot.key()).set({ id: snapshot.key(), active: true });
    });

    return {
        updatePairStatus: function(active, person) {
            var that = this;
            var pairsToUpdate = person.pairs;
            angular.forEach(pairsToUpdate, function(pair, key) {
                var pairToUpdate = pairs.$getRecord(key);
                var person1 = persons.$getRecord(pair.person1.id);
                var person2 = persons.$getRecord(pair.person2.id);
                if (!active) {
                    pairToUpdate.active = that._setPairStatus(person1, person2);
                } else {
                    pairToUpdate.active = false;
                }
                pairs.$save(pairToUpdate);
            });
        },

        generatePairs: function(pairs, persons) {
            var that = this;
            var i, j;
            for (i = 0; i < persons.length; i++) {
                for (j = i + 1; j < persons.length; j++) {
                    if (that._isUniquePair(pairs, persons[i], persons[j])) {
                        that._addPairToDatabase(pairs, persons[i], persons[j]);
                    }
                }
            }

            return pairs;
        },

        _addPairToDatabase: function(pairs, person1, person2) {
            var that = this;
            var person1Id = person1.$id;
            var person2Id = person2.$id;
            var active = that._setPairStatus(person1, person2);

            pairs.$add({
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
            });
        },

        _isUniquePair: function(pairs, person1, person2) {
            var person1Id = person1.$id;
            var person2Id = person2.$id;
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
