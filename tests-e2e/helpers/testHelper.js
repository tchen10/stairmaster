'use strict';

var protractor = require('protractor');
var Firebase = require('firebase');

var flow = protractor.promise.controlFlow();
var waitOne = function waitOne() {
    return protractor.promise.delayed(500);
};

var FIREBASE_URL = 'https://stairmaster.firebaseio.com/';

exports.FIREBASE_URL = FIREBASE_URL;

exports.sleep = function sleep() {
    flow.execute(waitOne);
};

exports.clearFirebaseRef = function clearFirebaseRef(ref) {
    var deferred = protractor.promise.defer();

    ref.remove(function(error) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.fulfill();
        }
    });

    return deferred.promise;
};

exports.createTeam = function createTeam(teamName) {
    var firebaseRef = new Firebase(FIREBASE_URL + 'Teams');
    firebaseRef.child(teamName).set({
        teamName: teamName
    });
    return firebaseRef.child(teamName);
};

exports.getFirebase = function getFirebase(parameters) {
    return new Firebase(FIREBASE_URL + parameters);
};
