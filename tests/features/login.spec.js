'use strict';

describe('stairmaster.login module', function() {
    beforeEach(module('stairmaster.login'));

    describe('login controller', function() {
        var loginCtrl, deferred, scope, mockFirebaseService, mockFirebaseAuth, mockLoginService, state;

        beforeEach(function() {
            module('stairmaster.login.login-controller');

            inject(function($q) {
                deferred = $q.defer();
            });

            var user = { uid: 'someUid' };
            mockFirebaseAuth = {
                $createUser: function() {
                    deferred.resolve(user);
                    return deferred.promise;
                },
                $authWithPassword: function() {
                    deferred.resolve();
                    return deferred.promise;
                }
            };

            mockFirebaseService = {
                getFirebase: function() {},
                set: function() {
                    deferred.resolve();
                    return deferred.promise;
                }
            };

            mockLoginService = {
                validateInput: function() {}
            };

            state = {
                go: function() {}
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                loginCtrl = $controller('LoginCtrl', { $scope: scope, FirebaseService: mockFirebaseService, FirebaseAuth: mockFirebaseAuth, $state: state, LoginService: mockLoginService });
            });

        });

        describe('.createAccount', function() {
            beforeEach(function() {
                scope.email = '123@ABC.com';
                scope.password = 'Abc123!';
                scope.confirmPassword = 'Abc123!';
                scope.teamName = 'Team Name';
                scope.createMode = true;
            });

            it('should create a user with FirebaseAuth', function() {
                spyOn(mockFirebaseAuth, '$createUser').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });

                scope.createAccount();

                expect(mockFirebaseAuth.$createUser).toHaveBeenCalledWith({
                    email: '123@ABC.com',
                    password: 'Abc123!'
                });
            });
        });
    });
});
