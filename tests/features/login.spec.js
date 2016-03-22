'use strict';

describe('stairmaster.login module', function() {
    beforeEach(module('stairmaster.login'));

    describe('login controller', function() {
        var loginCtrl, scope, state, mockFirebaseService;

        beforeEach(function() {
            module('stairmaster.login.login-controller');

            mockFirebaseService = {
                getTimestamp: function() {
                    return 'timestamp';
                },
                getFirebase: function() {
                    return 'ref';
                },
                set: function() {}
            };

            state = {
                go: function() {}
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                loginCtrl = $controller('LoginCtrl', {
                    $scope: scope,
                    $state: state,
                    FirebaseService: mockFirebaseService
                });
            });
        });

        describe('.addTeam', function() {

            beforeEach(function() {
                scope.teamName = 'Milkshake';
            });

            it('should use FirebaseService to add team', function() {
                spyOn(mockFirebaseService, 'set');
                scope.addTeam();
                scope.$apply();
                expect(mockFirebaseService.set).toHaveBeenCalledWith('ref', 'Milkshake',
                    { teamName: 'Milkshake', timestamp: 'timestamp' });
            });

            it('should clear teamName field after adding team', function() {
                scope.addTeam();
                scope.$apply();

                expect(scope.teamName).toBe('');
            });
        });
    });
});
