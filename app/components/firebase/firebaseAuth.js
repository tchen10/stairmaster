'use strict';

var Firebase = require('firebase');

angular.module('stairmaster.firebase.firebase-auth', [])

.factory('FirebaseAuth', ['$firebaseAuth', 'FirebaseService', 'FIREBASE_URL', function($firebaseAuth, FirebaseService, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL);
    return $firebaseAuth(ref);
}]);
