'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.firebase.firebase-rest-service', [require('angularfire')])

.service('FirebaseRestService', ['$firebaseArray', 'FIREBASE_URL', '$q', '$http', function($firebaseArray, FIREBASE_URL, $q, $http) {

    return {
        getActivePersons: function() {
            var activePersonsUrl = FIREBASE_URL + 'Persons.json?orderBy="active"&equalTo=true';
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
            var activePairsUrl = FIREBASE_URL + 'Pairs.json?orderBy="active"&equalTo=true';
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
