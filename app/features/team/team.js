'use strict';

require('./teamCtrl.js');

angular.module('stairmaster.team', [
    'ui.router',
    'stairmaster.team.team-controller'
])

.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('team.addPerson', {
                url: '/add',
                templateUrl: 'features/persons/_addPerson.html',
                controller: 'PersonCtrl'
            })
            .state('team.info', {
                url: '/info',
                templateUrl: 'features/persons/_infoPerson.html',
                controller: 'PersonCtrl'
            })
            .state('team.pairHistory', {
                url: '/pairhistory',
                templateUrl: 'features/pairs/_pairHistory.html',
                controller: 'PairsCtrl'
            });
    }
]);
