'use strict';

describe('stairmaster.team module', function() {
    beforeEach(module('stairmaster.team'));

    describe('team controller', function() {
        var teamCtrl, scope, state, stateParams, PairsServiceMock, FirebaseServiceMock;

        beforeEach(module('stairmaster.team.team-controller'));

        beforeEach(function() {
            PairsServiceMock = {
                generatePairs: function(persons) {},
                updatePairStatus: function(active, person) {}
            };
            FirebaseServiceMock = {
                getPerTeamFirebaseArray: function() {},
                add: function() {},
                getTimestamp: function() {},
                getRecord: function(id) {},
                save: function() {},
                remove: function() {}
            };
            state = {
                go: function() {}
            };

            stateParams = {
                teamId: 'teamId'
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                teamCtrl = $controller('TeamCtrl', {
                    $scope: scope,
                    $state: state,
                    PairsService: PairsServiceMock,
                    FirebaseService: FirebaseServiceMock,
                    $stateParams: stateParams });
            });

        });

        describe('addPerson', function() {
            var deferred;
            beforeEach(function() {
                inject(function($q) {
                    deferred = $q.defer();
                });
                spyOn(PairsServiceMock, 'generatePairs');
                spyOn(FirebaseServiceMock, 'add').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });

                scope.person = {};
                scope.person.first = 'Po';
                scope.person.last = 'Panda';
            });

            it('should generate pairs when person is added', function() {
                scope.addPerson();
                scope.$apply();

                expect(PairsServiceMock.generatePairs).toHaveBeenCalled();
            });

            it('should clear person fields after adding person', function() {
                scope.addPerson();
                scope.$apply();

                expect(scope.person.first).toBe('');
                expect(scope.person.last).toBe('');
            });
        });

        describe('.editPerson', function() {
            var person;

            beforeEach(function() {
                person = {
                    $id: 'personId',
                    first: 'Michael',
                    last: 'Scott',
                    active: true
                };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);
            });

            it('should get person to edit', function() {
                scope.editPerson();

                expect(scope.personToUpdate.id).toBe('personId');
                expect(scope.personToUpdate.first).toBe('Michael');
                expect(scope.personToUpdate.last).toBe('Scott');
                expect(scope.personToUpdate.active).toBe(true);
            });

        });

        describe('.updatePerson', function() {
            var person, deferred;

            beforeEach(function() {
                inject(function($q) {
                    deferred = $q.defer();
                });

                person = {
                    $id: 'personId',
                    first: 'Michael',
                    last: 'Scott',
                    active: true
                };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);
                spyOn(FirebaseServiceMock, 'save').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });
                spyOn(state, 'go');

                scope.personToUpdate = {};
                scope.personToUpdate.first = 'Dwight';
                scope.personToUpdate.last = 'Schrute';

                scope.updatePerson();
                scope.$apply();
            });

            it('should update person', function() {
                expect(person.first).toBe('Dwight');
                expect(person.last).toBe('Schrute');
            });

            it('should redirect to team', function() {
                expect(state.go).toHaveBeenCalledWith('team');
            });

        });

        describe('deletePerson', function() {
            var person;

            beforeEach(function() {
                person = { first: 'Jim' };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);
                spyOn(FirebaseServiceMock, 'remove');

                scope.persons = [1, 2, 3];
                scope.pairs = [4, 5, 6];
                scope.personToUpdate = { id: 'id' };

                scope.deletePerson();
            });

            it('should remove person from persons array', function() {
                expect(FirebaseServiceMock.remove).toHaveBeenCalledWith(scope.persons, person);
            });
        });

        describe('deactivatePerson', function() {
            var deferred, person;

            beforeEach(function() {
                inject(function($q) {
                    deferred = $q.defer();
                });

                person = {};

                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);
                spyOn(FirebaseServiceMock, 'save').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });

                scope.persons = [1,2,3];
                scope.personToUpdate = {id: 'id'};
            });

            it('should deactivate person when person is active', function() {
                scope.deactivatePerson(true);
                scope.$apply();

                expect(person.active).toBe(false);
            });

            it('should activate person when person is inactive', function() {
                scope.deactivatePerson(false);
                scope.$apply();

                expect(person.active).toBe(true);
            });

            it('should updatePairStatus when save is successful', function() {
                spyOn(PairsServiceMock, 'updatePairStatus');
                spyOn(state, 'go');

                scope.deactivatePerson(true);
                scope.$apply();

                expect(PairsServiceMock.updatePairStatus).toHaveBeenCalledWith(true, person);
                expect(state.go).toHaveBeenCalledWith('team');
            });

        });
    });
});
