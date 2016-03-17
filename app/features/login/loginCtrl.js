'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', 'FirebaseService', 'FirebaseAuth', '$state', 'LoginService', function($scope, FirebaseService, FirebaseAuth, $state, LoginService) {

    $scope.login = function(email, password) {
        $scope.error = null;
        FirebaseAuth.$authWithPassword({ email: email, password: password }, { rememberMe: true })
            .then(function() {
                $state.go('team');
            }, function(err) {
                $scope.error = errMessage(err);
            });
    };

    $scope.createAccount = function() {
        var input = {
            email: $scope.email,
            password: $scope.password,
            confirmPassword: $scope.confirmPassword,
            teamName: $scope.teamName
        };

        $scope.error = LoginService.validateInput(input);
        if (!$scope.error) {
            FirebaseAuth.$createUser({ email: input.email, password: input.password })
                .then(function(user) {
                    var parameters = '/Users/' + user.uid;
                    var ref = FirebaseService.getFirebaseRef(parameters);
                    var newUser = {
                        email: input.email,
                        teamName: input.teamName,
                        timestamp: FirebaseService.getTimestamp()
                    };
                    return FirebaseService.set(ref, newUser);
                })
                .then(function() {
                    $state.go('login');
                }, function(err) {
                    $scope.error = errMessage(err);
                });
        }
    };

    function errMessage(err) {
        return angular.isObject(err) && err.code ? err.code : err + '';
    }

}]);
