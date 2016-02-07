'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.pairs.pairs-service', [require('angularfire')])

.service('PairsService', ['$firebaseArray', function($firebaseArray) {
    var pairsRef = new Firebase('https://stairmaster.firebaseio.com/Pairs');
    var pairs = $firebaseArray(pairsRef);

    this.generatePairs = function(persons) {
        var that = this;
        var i, j;
        for(i = 0; i < persons.length; i++) {
            for (j = i + 1; j < persons.length; j++) {
                if(that._isUniquePair(pairs, persons[i], persons[j])) {
                    that._addToDatabase(pairs, persons[i], persons[j]);
                }
            }
        }

        return pairs;
    };

    this._addToDatabase = function(pairs, person1, person2) {
        pairs.$add({
            person1: {
                id: person1.$id,
                person: person1
            },
            person2: {
                id: person2.$id,
                person: person2
            }
        }).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
        });
    };

    this._isUniquePair = function(pairs, person1, person2) {
        var that = this;
        var person1Id = person1.$id;
        var person2Id = person2.$id;
        var isUnique = true;

        angular.forEach(pairs, function(pair){
            if(pair.person1.id === person1Id &&
                pair.person2.id === person2Id) {
                isUnique = false;
            }
        });

        return isUnique;
    };

}]);
