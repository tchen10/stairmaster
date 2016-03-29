'use strict';

require('./teamCtrl.js');
require('./teamService.js');

angular.module('stairmaster.team', [
    'stairmaster.team.team-controller',
    'stairmaster.team.team-service'
]);

