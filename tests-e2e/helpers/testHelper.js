'use strict';

var FIREBASE_URL = 'https://stairmaster-dev.firebaseio.com/';
var protractor = require('protractor');
var Firebase = require('firebase');

var flow = protractor.promise.controlFlow();
var waitOne = function waitOne() {
    return protractor.promise.delayed(500);
};

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

exports.createPerson = function createTeam(teamName, person) {
    var firebaseRef = new Firebase(FIREBASE_URL + 'Teams/' + teamName);
    return firebaseRef.child('Persons').push(person);
};

exports.getFirebase = function getFirebase(parameters) {
    return new Firebase(FIREBASE_URL + parameters);
};

exports.loadData = function loadData(teamName, data) {
    var firebaseRef = new Firebase(FIREBASE_URL + 'Teams');
    firebaseRef.child(teamName).set(data);
    return firebaseRef.child(teamName);
};
