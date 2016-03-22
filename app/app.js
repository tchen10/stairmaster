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
    'stairmaster.firebase',
    'stairmaster.team',
    'stairmaster.pairs',
    'stairmaster.stairs',
    'stairmaster.login'
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('common', {
                templateUrl: 'features/common.html',
                abstract: true
            })
            .state('team', {
                url: '/settings',
                parent: 'common',
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
                parent: 'common',
                templateUrl: 'features/pairs/pairs.html',
                controller: 'PairsCtrl'
            })
            .state('login', {
                url: '/welcome',
                templateUrl: 'features/login/login.html',
                controller: 'LoginCtrl'
            });

        $urlRouterProvider.otherwise('/login');
    }
]);
