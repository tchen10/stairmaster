'use strict';

require('angular');
require('angular-mocks');
require('angular-ui-router');
require('angular-loader');
require('firebase');
require('angularfire');
require('./features');
require('./components');

var app = angular.module('stairmaster', [
    'ui.router',
    'stairmaster.version',
    'stairmaster.team'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('team', {
            url: '/team',
            templateUrl: 'features/team/team.html',
            controller: 'TeamCtrl'
        })
        .state('team.addPerson', {
            url: '/add',
            templateUrl: 'features/team/_addPerson.html',
            controller: 'TeamCtrl'
        })
        .state('team.editPerson', {
            url: '/edit',
            templateUrl: 'features/team/_editPerson.html',
            controller: 'TeamCtrl'
        });

    $urlRouterProvider.otherwise('/team');
}]);

app.constant('FirebaseUrl', 'https://stairmaster.firebaseio.com/');
