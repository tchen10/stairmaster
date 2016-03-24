'use strict';

require('./firebaseService');
require('./firebaseRestService');

angular.module('stairmaster.firebase', [
    'stairmaster.firebase.firebase-service',
    'stairmaster.firebase.firebase-rest-service'
])

.constant('FIREBASE_URL', 'https://stairmaster-dev.firebaseio.com/');
