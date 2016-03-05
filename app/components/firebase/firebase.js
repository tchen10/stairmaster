'use strict';

require('./firebaseService');

angular.module('stairmaster.firebase', [
        'stairmaster.firebase.firebase-service'
    ])

    .constant('FIREBASE_URL', 'https://stairmaster.firebaseio.com/');
