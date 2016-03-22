'use strict';

describe('stairmaster.login module', function() {
    beforeEach(module('stairmaster.login'));

    describe('login controller', function() {
        var loginCtrl, scope, state, mockFirebaseService, mockLoginService, deferred;

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

            mockLoginService = {
                validateTeamName: function() {}
            };

            state = {
                go: function() {}
            };

            inject(function($q) {
                deferred = $q.defer();
            });

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                loginCtrl = $controller('LoginCtrl', {
                    $scope: scope,
                    $state: state,
                    FirebaseService: mockFirebaseService,
                    LoginService: mockLoginService
                });
            });
        });

        describe('.addTeam', function() {

            beforeEach(function() {
                spyOn(state, 'go');
                spyOn(mockFirebaseService, 'set').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });
                scope.teamName = 'Wildcats';
            });

            it('should add valid team', function() {
                spyOn(mockLoginService, 'validateTeamName').and.returnValue('');

                scope.addTeam();
                scope.$apply();

                expect(mockFirebaseService.set).toHaveBeenCalledWith('ref', 'Wildcats',
                    { teamName: 'Wildcats', timestamp: 'timestamp' });
            });


            it('should redirect to team settings when team is added', function() {
                spyOn(mockLoginService, 'validateTeamName').and.returnValue('');

                scope.addTeam();
                scope.$apply();

                expect(state.go).toHaveBeenCalledWith('team', {teamId: 'Wildcats'});
            });

            it('should not add team when teamName is invalid', function() {
                spyOn(mockLoginService, 'validateTeamName').and.returnValue('error');

                scope.addTeam();
                scope.$apply();

                expect(mockFirebaseService.set).not.toHaveBeenCalled();
            });


            it('should set error message when teamName is invalid', function() {
                spyOn(mockLoginService, 'validateTeamName').and.returnValue('error');

                scope.addTeam();
                scope.$apply();

                expect(scope.err).toBe('error');
            });

            it('should clear teamName field after adding team', function() {
                scope.addTeam();
                scope.$apply();

                expect(scope.teamName).toBe('');
            });
        });
    });

    describe('login service', function() {
        var loginService, mockFirebaseService;

        beforeEach(function() {
            mockFirebaseService = {
                getRecord: function() {},
                getFirebaseArray: function() {}
            };

            module('stairmaster.login.login-service');
            module(function($provide) {
                $provide.value('FirebaseService', mockFirebaseService);
            });

            inject(function(_LoginService_) {
                loginService = _LoginService_;
            });

        });

        describe('.validateTeamName', function() {
            it('should not return an error if teamName does not exist', function() {
                var teamName = 'wildcats123';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue(null);

                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('');
            });

            it('should return an error if record with teamName does exist', function() {
                var teamName = 'wildcats';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue({ teamName: {} });

                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('Team name "wildcats" already exists');
            });

            it('should return an error if teamName is empty', function() {
                var teamName = '';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue(null);
                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('Team name must be at least 6 characters');
            });

            it('should return an error if teamName is less than 6 characters', function() {
                var teamName = 'boop';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue(null);
                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('Team name must be at least 6 characters');
            });

            it('should return an error if teamName has whitespaces', function() {
                var teamName = 'betty boop';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue(null);
                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('Team name cannot have spaces');
            });

            it('should return an error if teamName has special characters', function() {
                var teamName = 'bettyboop/';
                spyOn(mockFirebaseService, 'getRecord').and.returnValue(null);
                var error = loginService.validateTeamName(teamName);

                expect(error).toBe('Team name can only have alphanumeric characters');
            });
        });
    });
});
