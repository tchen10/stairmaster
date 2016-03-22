'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.firebase.firebase-service', [require('angularfire')])

.service('FirebaseService', ['$firebaseArray', 'FIREBASE_URL', '$q', '$stateParams', function($firebaseArray, FIREBASE_URL, $q, $stateParams) {

    var teamRoute = 'Teams/' + $stateParams.teamId + '/';
    var personsRef = new Firebase(FIREBASE_URL + teamRoute + 'Persons');
    var pairsRef = new Firebase(FIREBASE_URL + teamRoute + 'Pairs');

    pairsRef.on('child_added', function(snapshot) {
        var pair = snapshot.val();
        var person1Id = pair.person1.id;
        var person2Id = pair.person2.id;
        personsRef.child(person1Id + '/pairs/' + snapshot.key()).set(pair);
        personsRef.child(person2Id + '/pairs/' + snapshot.key()).set(pair);
    });

    return {
        getFirebase: function(parameters) {
            return new Firebase(FIREBASE_URL + parameters);
        },
        getFirebaseArray: function(parameters) {
            var ref = new Firebase(FIREBASE_URL + teamRoute + parameters);
            return $firebaseArray(ref);
        },
        getFirebaseId: function(object) {
            return object.$id;
        },
        getTimestamp: function() {
            return Firebase.ServerValue.TIMESTAMP;
        },
        getRecord: function(array, id) {
            return array.$getRecord(id);
        },
        add: function(array, element) {
            var deferred = $q.defer();
            array.$add(element).then(function(ref) {
                deferred.resolve(ref);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        save: function(array, element) {
            var deferred = $q.defer();
            array.$save(element).then(function(ref) {
                deferred.resolve(ref);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        remove: function(array, element) {
            var deferred = $q.defer();
            array.$remove(element).then(function(ref) {
                deferred.resolve(ref);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        loaded: function(object) {
            var deferred = $q.defer();
            object.$loaded().then(function(data) {
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        set: function(ref, childParams, object) {
            var deferred = $q.defer();
            ref.child(childParams).set(object).then(function(ref) {
                deferred.resolve(ref);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

}]);
