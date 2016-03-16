'use strict';

require('./loginCtrl');
require('./loginService');

angular.module('stairmaster.login', [
    'stairmaster.login.login-controller',
    'stairmaster.login.login-service'
]);
