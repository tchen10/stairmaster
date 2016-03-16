'use strict';

require('./firebaseService');
require('./firebaseRestService');
require('./firebaseAuth');

angular.module('stairmaster.firebase', [
    'stairmaster.firebase.firebase-service',
    'stairmaster.firebase.firebase-rest-service',
    'stairmaster.firebase.firebase-auth'
])

.constant('FIREBASE_URL', 'https://stairmaster.firebaseio.com/');
