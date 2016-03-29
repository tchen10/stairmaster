'use strict';

describe('stairmaster.persons module', function() {
    beforeEach(module('stairmaster.persons'));

    describe('persons controller', function() {
        var personCtrl, scope, state, PairsServiceMock, FirebaseServiceMock, PersonServiceMock;

        beforeEach(module('stairmaster.persons.persons-controller'));

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
            PersonServiceMock = {
                validateName: function() {}
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                personCtrl = $controller('PersonCtrl', {
                    $scope: scope,
                    $state: state,
                    PairsService: PairsServiceMock,
                    FirebaseService: FirebaseServiceMock,
                    PersonService: PersonServiceMock
                });
            });

        });

        describe('.addPerson', function() {
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

            it('should generate pairs when names are valid', function() {
                spyOn(PersonServiceMock, 'validateName').and.returnValue('');

                scope.addPerson();
                scope.$apply();

                expect(PairsServiceMock.generatePairs).toHaveBeenCalled();
            });

            it('should not generate pairs when names are invalid', function() {
                spyOn(PersonServiceMock, 'validateName').and.returnValue('errors');

                scope.addPerson();
                scope.$apply();

                expect(PairsServiceMock.generatePairs).not.toHaveBeenCalled();
            });

            it('should clear person fields after adding person', function() {
                scope.addPerson();
                scope.$apply();

                expect(scope.person.first).toBe('');
                expect(scope.person.last).toBe('');
            });

            it('should set error when name is invalid', function() {
                spyOn(PersonServiceMock, 'validateName').and.returnValues('first error', 'last error');
                scope.addPerson();
                scope.$apply();

                expect(scope.firstError).toBe('first error');
                expect(scope.lastError).toBe('last error');
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
                expect(state.go).toHaveBeenCalledWith('team.info');
            });

        });

        describe('.deletePerson', function() {
            var person, deferred;

            beforeEach(function() {
                inject(function($q) {
                    deferred = $q.defer();
                });

                person = { first: 'Jim' };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);
                spyOn(FirebaseServiceMock, 'remove').and.callFake(function() {
                    deferred.resolve();
                    return deferred.promise;
                });
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray').and.returnValue([1, 2, 3]);

                spyOn(state, 'go');

                scope.personToUpdate = { $id: 'id' };

                scope.deletePerson();
                scope.$apply();
            });

            it('should remove person from persons array', function() {
                expect(FirebaseServiceMock.remove).toHaveBeenCalledWith(scope.persons, person);
            });

            it('should redirect to team', function() {
                expect(state.go).toHaveBeenCalledWith('team');
            });
        });

        describe('.deactivatePerson', function() {
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
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray').and.returnValue([1, 2, 3]);

                scope.personToUpdate = { $id: 'id' };
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
                expect(scope.personToUpdate.active).toBe(false);
            });

        });

        describe('.getPair', function() {
            var id, pairs, pair;

            beforeEach(function() {
                id = 'pairId';

                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue({
                    pair: 4
                });

                pair = scope.getPair(id);
                scope.$apply();
            });

            it('should get record from FirebaseService', function() {
                expect(pair).toEqual({
                    pair: 4
                });
                expect(FirebaseServiceMock.getRecord).toHaveBeenCalled();
            });
        });

        describe('.getPersonName', function() {
            var id, person;

            it('should get the person same', function() {
                id = 'personId';
                person = {
                    first: 'Missy',
                    last: 'Elliot'
                };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);

                var name = scope.getPersonName(id);
                scope.$apply();

                expect(name).toBe('Missy');
            });
        });
    });

    describe('person service', function() {
        var personService;

        beforeEach(function() {
            module('stairmaster.persons.persons-service');

            inject(function(_PersonService_) {
                personService = _PersonService_;
            });
        });

        describe('.validateName', function() {
            it('should return an error when name is less than 1 character', function() {
                var name = '';
                var error = personService.validateName(name);
                expect(error).toBe('Name must be at least 1 character');
            });

            it('should return an error when name has spaces', function() {
                var name = 'betty boop';
                var error = personService.validateName(name);
                expect(error).toBe('Name can only have alphanumeric characters');
            });

            it('should return an error when name has special characters', function() {
                var name = 'betty!';
                var error = personService.validateName(name);
                expect(error).toBe('Name can only have alphanumeric characters');
            });

            it('should not return an error when name is valid', function() {
                var name = 'betty';
                var error = personService.validateName(name);
                expect(error).toBe('');
            });
        });
    });
});
