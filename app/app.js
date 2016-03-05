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
    'stairmaster.team',
    'stairmaster.pairs',
    'stairmaster.firebase'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('team', {
                url: '/settings',
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
            })
            .state('pairstairs', {
                url: '/pairstairs',
                templateUrl: 'features/pairs/pairs.html',
                controller: 'PairsCtrl'
            });

        $urlRouterProvider.otherwise('/settings');
    }
]);

app.constant('FirebaseUrl', 'https://stairmaster.firebaseio.com/');
