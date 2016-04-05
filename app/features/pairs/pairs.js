'use strict';

require('./pairsCtrl.js');
require('./pairsService.js');

angular.module('stairmaster.pairs', [
    'stairmaster.pairs.pairs-controller',
    'stairmaster.pairs.pairs-service'
])

.directive('pairingDays', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/pairs/_pairingDays.html'
    };
})

.directive('editPairingDays', function() {
    return {
        restrict: 'E',
        templateUrl: 'features/pairs/_editPairingDays.html'
    };
});
