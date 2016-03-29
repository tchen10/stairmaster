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
    'stairmaster.navigation',
    'stairmaster.team',
    'stairmaster.persons',
    'stairmaster.pairs',
    'stairmaster.stairs',
    'stairmaster.login'
]);

app.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        AuthService.checkExistingTeam(event, toParams.teamId);
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('common', {
                url: '/{teamId}',
                templateUrl: 'components/navigation/navigation.html',
                controller: 'NavigationCtrl',
                abstract: true
            })
            .state('team', {
                url: '/settings',
                parent: 'common',
                templateUrl: 'features/team/team.html',
                controller: 'TeamCtrl',
                resolve: {
                    teamId: function(FirebaseService, $stateParams) {
                        return FirebaseService.setTeamId($stateParams.teamId);
                    }
                }
            })
            // .state('team.addPerson', {
            //     url: '/add',
            //     templateUrl: 'features/persons/_addPerson.html',
            //     controller: 'PersonCtrl'
            // })
            // .state('team.info', {
            //     url: '/info',
            //     templateUrl: 'features/persons/_infoPerson.html',
            //     controller: 'PersonCtrl'
            // })
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

        $urlRouterProvider.otherwise('/welcome');
    }
]);
