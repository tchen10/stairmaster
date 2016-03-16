'use strict';

angular.module('stairmaster.login.login-controller', [])

.controller('LoginCtrl', ['$scope', 'FirebaseService', 'FirebaseAuth', '$state', 'LoginService', function($scope, FirebaseService, FirebaseAuth, $state, LoginService) {

    $scope.createAccount = function() {
        var input = {
            email: $scope.email,
            password: $scope.password,
            teamName: $scope.teamName
        };

        $scope.error = LoginService.validateInput(input);
        if (!$scope.error) {
            FirebaseAuth.$createUser({ email: input.email, password: input.password })
                .then(function() {
                    return FirebaseAuth.$authWithPassword({ email: input.email, password: input.password });
                })
                .then(function(user) {
                    var parameters = '/Users/' + user.uid;
                    var ref = FirebaseService.getFirebase(parameters);
                    var newUser = {
                        email: input.email,
                        teamName: input.teamName
                    };
                    return FirebaseService.set(ref, newUser);
                })
                .then(function() {
                    $state.go('team');
                }, function(err) {
                    $scope.error = errMessage(err);
                });
        }
    };

    function errMessage(err) {
        return angular.isObject(err) && err.code ? err.code : err + '';
    }

}]);
