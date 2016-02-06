'use strict';

describe('stairmaster.team module', function() {
    beforeEach(module('stairmaster.team'));

    describe('team controller', function() {
        var teamCtrl, scope, state;

        beforeEach(module('stairmaster.team.team-controller'));

        beforeEach(function() {
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                state = {};
                teamCtrl = $controller('TeamCtrl', {$scope: scope, $state: state});
            });
        });

        it('should create persons array in scope', function() {
          expect(Object.prototype.toString.call(scope.persons)).toBe('[object Array]');
        });

        describe('addPerson', function() {
            it('should add a person to persons array', function() {
                scope.person = {};
                scope.person.first = 'Po';
                scope.person.last = 'Panda';
                scope.addPerson(scope.person);
                scope.$digest();

                expect(scope.persons.length).toBe(1);
                expect(scope.persons[0].first).toBe('Po');
                expect(scope.persons[0].last).toBe('Panda');
            });

            it('should clear person fields after adding person', function() {
                scope.person = {};
                scope.person.first = 'Po';
                scope.person.last = 'Panda';
                scope.addPerson(scope.person);
                scope.$digest();

                expect(scope.person.first).toBe('');
                expect(scope.person.last).toBe('');
            });
        });

        describe('editPerson', function() {
            var id;

            beforeEach(function() {
                scope.persons.$add({
                    first: 'Alexander',
                    last: 'Hamilton'
                });
                scope.$digest();

                id = scope.persons[0].$id;
            });

            it('should get person to be edited', function() {
                scope.editPerson(id);
                scope.$digest();

                expect(scope.persons[0].first).toBe('Alexander');
                expect(scope.persons[0].last).toBe('Hamilton');
            });

            it('should update person', function() {
                scope.editPerson(id);
                scope.$digest();

                scope.personToUpdate.first = 'Aaron';
                scope.personToUpdate.last = 'Burr';

                scope.updatePerson();

                expect(scope.persons[0].first).toBe('Aaron');
                expect(scope.persons[0].last).toBe('Burr');
            });
        });

        describe('deletePerson', function() {
            it('should delete person', function() {
                scope.persons.$add({
                    first: 'Po',
                    last: 'Panda'
                });
                scope.$digest();

                var id = scope.persons[0].$id;

                scope.deletePerson(id);
                scope.$digest();

                expect(scope.persons.length).toBe(0);
                expect(scope.persons.$getRecord(id)).toBeNull();
            });
        });

        afterEach(function() {
            scope.persons.$remove(scope.persons[0]);
        });

    });
});
