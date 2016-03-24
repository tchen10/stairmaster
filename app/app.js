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
    'stairmaster.pairs',
    'stairmaster.stairs',
    'stairmaster.login'
]);

app.run(['$rootScope', '$state', 'LoginService', function($rootScope, $state, LoginService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toParams.teamId && LoginService.findTeamName(toParams.teamId)) {
            $state.go('login');
            event.preventDefault();
        }
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('common', {
                url: '/{teamId}',
                templateUrl: 'components/navigation/navigation.html',
                controller: 'NavigationCtrl',
                abstract: true,
                resolve: {
                    teamId: ['$stateParams', function($stateParams) {
                        return $stateParams.teamId;
                    }]
                }
            })
            .state('team', {
                url: '/settings',
                parent: 'common',
                templateUrl: 'features/team/team.html',
                cache: false,
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

        $urlRouterProvider.otherwise('/welcome');
    }
]);
