'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-service', [require('angularfire')])

.service('PairsService', ['$firebaseArray', function($firebaseArray) {
    var personsRef = new Firebase('https://stairmaster.firebaseio.com/Persons');
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');

    pairsRef.on('child_added', function(snapshot) {
        var pair = snapshot.val();
        var person1Id = pair.person1.id;
        var person2Id = pair.person2.id;
        personsRef.child(person1Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person2Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person1Id + '/stairs/' + snapshot.key()).set({ id: snapshot.key() });
    });

    return {
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
                days: 0
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
        }
    };
}]);
