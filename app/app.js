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

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        $state.go('login');
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('common', {
                templateUrl: 'features/common.html',
                abstract: true,
            })
            .state('team', {
                url: '/settings',
                parent: 'common',
                templateUrl: 'features/team/team.html',
                controller: 'TeamCtrl',
                resolve: {
                    currentUser: ['FirebaseAuth', function(FirebaseAuth) {
                        return FirebaseAuth.$requireAuth();
                    }]
                }
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
                controller: 'PairsCtrl',
                resolve: {
                    currentUser: ['FirebaseAuth', function(FirebaseAuth) {
                        return FirebaseAuth.$requireAuth();
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'features/login/login.html',
                controller: 'LoginCtrl'
            });

        $urlRouterProvider.otherwise('/settings');
    }
]);
