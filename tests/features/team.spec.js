'use strict';

describe('stairmaster.team module', function() {
    beforeEach(module('stairmaster.team'));

    describe('team controller', function() {
        var teamCtrl, scope, state, stateParams, PairsServiceMock, FirebaseServiceMock, TeamServiceMock;

        beforeEach(module('stairmaster.team.team-controller'));

        beforeEach(function() {

            FirebaseServiceMock = {
                getPerTeamFirebaseArray: function() {},
                getRecord: function(id) {},
            };

            stateParams = {
                teamId: 'teamId'
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                teamCtrl = $controller('TeamCtrl', {
                    $scope: scope,
                    FirebaseService: FirebaseServiceMock,
                    $stateParams: stateParams
                });
            });

        });

        describe('.viewPerson', function() {
            var id, person;

            beforeEach(function() {
                scope.persons = [1, 2, 3];
                id = 'personId';
                person = {
                    first: 'Missy',
                    last: 'Elliot'
                };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);

                scope.viewPerson(id);
                scope.$apply();
            });

            it('should get record from Firebase', function() {
                expect(FirebaseServiceMock.getRecord).toHaveBeenCalledWith([1, 2, 3], 'personId');
            });

            it('should set scope of personInfo', function() {
                expect(scope.personInfo).toEqual(person);
            });

            it('should set scope of personToUpdate', function() {
                expect(scope.personToUpdate).toEqual(person);
            });

        });

        describe('.getPersonName', function() {
            var id, person;

            it('should get the person same', function() {
                scope.persons = [1, 2, 3];
                id = 'personId';
                person = {
                    first: 'Missy',
                    last: 'Elliot'
                };
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue(person);

                var name = scope.getPersonName(id);
                scope.$apply();

                expect(name).toBe('Missy');
                expect(FirebaseServiceMock.getRecord).toHaveBeenCalledWith([ 1, 2, 3 ], 'personId');
            });
        });

    });
});
