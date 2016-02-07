'use strict';

require('./pairsCtrl.js');
require('./pairsService.js');

angular.module('stairmaster.pairs', [
    'stairmaster.pairs.pairs-controller',
    'stairmaster.pairs.pairs-service'
]);
