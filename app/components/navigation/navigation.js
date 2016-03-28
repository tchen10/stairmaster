'use strict';

require('./navigationCtrl');
require('./authService');

angular.module('stairmaster.navigation', [
  'stairmaster.navigation.navigation-controller',
  'stairmaster.navigation.auth-service'
]);
