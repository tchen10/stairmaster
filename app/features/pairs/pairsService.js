'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-service', [require('angularfire')])

.service('PairsService', ['$firebaseArray', 'FirebaseService', function($firebaseArray, FirebaseService) {
    var persons = FirebaseService.getPerTeamFirebaseArray('Persons');
    var pairs = FirebaseService.getPerTeamFirebaseArray('Pairs');

    var personsRef = FirebaseService.getPerTeamFirebase('Persons');
    var pairsRef = FirebaseService.getPerTeamFirebase('Pairs');

    pairsRef.on('child_added', function(snapshot) {
        var pair = snapshot.val();
        var person1Id = pair.person1;
        var person2Id = pair.person2;
        personsRef.child(person1Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person2Id + '/pairs/' + snapshot.key()).set(pair);
    });

    personsRef.on('child_removed', function(oldChildSnapshot) {
        var person = oldChildSnapshot.val();
        var pairs = person.pairs;
        angular.forEach(pairs, function(value, key) {
            var person1Id = value.person1;
            var person2Id = value.person2;
            personsRef.child(person1Id + '/pairs/' + key).remove();
            personsRef.child(person2Id + '/pairs/' + key).remove();
            pairsRef.child(key).remove();
        });
    });

    return {
        updatePairStatus: function(active, person) {
            var that = this;
            var pairsToUpdate = person.pairs;
            angular.forEach(pairsToUpdate, function(pair, key) {
                var pairToUpdate = FirebaseService.getRecord(pairs, key);
                if (!active) {
                    var person1 = FirebaseService.getRecord(persons, pair.person1);
                    var person2 = FirebaseService.getRecord(persons, pair.person2);
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
                person1: person1Id,
                person2: person2Id,
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
