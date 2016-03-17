'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.firebase.firebase-rest-service', [require('angularfire')])

.service('FirebaseRestService', ['$firebaseArray', 'FIREBASE_URL', '$q', '$http', function($firebaseArray, FIREBASE_URL, $q, $http) {

    var ref = new Firebase(FIREBASE_URL);
    var authData = ref.getAuth();
    var userSchema;
    if (authData) {
        userSchema = 'Users/' + authData.uid + '/';
    }

    return {
        getActivePersons: function() {
            var activePersonsUrl = FIREBASE_URL + userSchema + 'Persons.json?orderBy="active"&equalTo=true';
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: activePersonsUrl
            }).then(function successCallback(data) {
                deferred.resolve(data);
            }, function errorCallback(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getActivePairs: function() {
            var activePairsUrl = FIREBASE_URL + userSchema + 'Pairs.json?orderBy="active"&equalTo=true';
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: activePairsUrl
            }).then(function successCallback(data) {
                deferred.resolve(data);
            }, function errorCallback(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    };

}]);
