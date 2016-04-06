'use strict';

describe('stairmaster.pairs module', function() {
    beforeEach(module('stairmaster.pairs'));

    describe('pairs controller', function() {
        var pairsCtrl, scope, FirebaseServiceMock, FirebaseRestServiceMock, StairsFactoryMock, deferred;

        beforeEach(function() {
            module('stairmaster.pairs.pairs-controller');

            inject(function($q) {
                deferred = $q.defer();
            });

            FirebaseServiceMock = {
                getPerTeamFirebaseArray: function() {
                    return [];
                },
                getPerTeamFirebase: function() {},
                getRecord: function() {},
                add: function() {},
                remove: function() {},
                getTimestamp: function() {
                    return 'timestamp';
                },
                loaded: function() {}
            };

            FirebaseRestServiceMock = {
                getActivePersons: function() {
                    deferred.resolve({});
                    return deferred.promise;
                },
                getActivePairs: function() {
                    deferred.resolve({});
                    return deferred.promise;
                }
            };

            StairsFactoryMock = {
                generateStairs: function() {}
            };

            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                pairsCtrl = $controller('PairsCtrl', { $scope: scope, FirebaseService: FirebaseServiceMock, FirebaseRestService: FirebaseRestServiceMock, StairsFactory: StairsFactoryMock });
            });

            scope.pairs = [];
        });

        describe('.incrementDays', function() {
            var days, id;

            beforeEach(function() {
                id = 12;
                days = [1, 2, 3];

            });


            it('should call firebasearray with correct path', function() {
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray');
                scope.incrementDays(id);
                expect(FirebaseServiceMock.getPerTeamFirebaseArray).toHaveBeenCalledWith('Pairs/12/Days');
            });

            it('should add new day to days array', function() {
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray').and.returnValue(days);
                spyOn(FirebaseServiceMock, 'add');

                var day = {
                    date: moment().format('ll'),
                    timestamp: 'timestamp'
                };

                scope.incrementDays(id);

                expect(FirebaseServiceMock.add).toHaveBeenCalledWith(days, day);
            });

        });

        describe('.decrementDays', function() {
            var days, id;

            beforeEach(function() {
                id = 12;
                days = [4, 5, 6];

                inject(function($q) {
                    deferred = $q.defer();
                });

                spyOn(FirebaseServiceMock, 'loaded').and.callFake(function() {
                    deferred.resolve(days);
                    return deferred.promise;
                });
            });

            it('should call firebasearray with correct path', function() {
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray');
                scope.decrementDays(id, 2);
                expect(FirebaseServiceMock.getPerTeamFirebaseArray).toHaveBeenCalledWith('Pairs/12/Days');
            });

            it('should decrement days when days are greater than 0', function() {
                spyOn(FirebaseServiceMock, 'getPerTeamFirebaseArray').and.returnValue(days);
                spyOn(FirebaseServiceMock, 'remove');

                scope.decrementDays(id, 2);
                scope.$apply();

                expect(FirebaseServiceMock.remove).toHaveBeenCalledWith(days, 5);
            });
        });

        describe('.incrementDayCount', function() {
            it('should increment count', function() {
                var count = scope.incrementDayCount(3);
                expect(count).toBe(4);
            });
        });

        describe('.decrementDayCount', function() {
            it('should return 0 if count is 0', function() {
                var count = scope.decrementDayCount(0);
                expect(count).toBe(0);
            });

            it('should decrement count', function() {
                var count = scope.decrementDayCount(10);
                expect(count).toBe(9);
            });
        });

        describe('.getPersonName', function() {
            var id, name;

            beforeEach(function() {
                id = 12;
                spyOn(FirebaseServiceMock, 'getRecord').and.returnValue({
                    first: 'Po',
                    last: 'Panda'
                });

                name = scope.getPersonName(id);
            });

            it('should return a persons first and last name', function() {
                expect(name).toBe('Po Panda');
            });

            it('should call firebaseService with correct parameters', function() {
                expect(FirebaseServiceMock.getRecord).toHaveBeenCalledWith([], id);
            });
        });

        describe('.deleteDay', function() {
            var pairId, dayId;

            it('should remove day', function() {
                pairId = 'pairId';
                dayId = 'dayId';

                var refMock = {
                    remove: function() {}
                };

                spyOn(FirebaseServiceMock, 'getPerTeamFirebase').and.returnValue(refMock);
                spyOn(refMock, 'remove');

                scope.deleteDay(pairId, dayId);

                expect(FirebaseServiceMock.getPerTeamFirebase).toHaveBeenCalledWith('Pairs/pairId/Days/dayId');
                expect(refMock.remove).toHaveBeenCalled();
            });
        });

    });

    describe('pairs service', function() {
        var pairsService, firebaseServiceMock, pairsRef;

        beforeEach(function() {
            firebaseServiceMock = {
                getPerTeamFirebase: function() {
                    return {
                        on: function() {}
                    };
                },
                getPerTeamFirebaseArray: function() {},
                getFirebaseId: function() {},
                getRecord: function() {},
                save: function() {},
                add: function() {}
            };

            module('stairmaster.pairs.pairs-service');
            module(function($provide) {
                $provide.value('FirebaseService', firebaseServiceMock);
            });

            inject(function(_PairsService_) {
                pairsService = _PairsService_;
            });
        });

        describe('.updatePairStatus', function() {
            var pairs, person, pairToUpdate, person1, person2;

            beforeEach(function() {

                person1 = { id: 'person1Id' };
                person2 = { id: 'person2Id' };

                person = {
                    pairs: {
                        pairkey: {
                            person1: 'person1Id',
                            person2: 'person2Id'
                        }
                    }
                };

                pairToUpdate = {};
                spyOn(firebaseServiceMock, 'getRecord').and.returnValues(pairToUpdate, person1, person2);
                spyOn(firebaseServiceMock, 'save');
            });

            it('should update pair to inactive when pair was previously active', function() {
                pairsService.updatePairStatus(true, person);
                expect(pairToUpdate.active).toBe(false);
                expect(firebaseServiceMock.save).toHaveBeenCalled();
            });

            it('should set pair status based on each person when pair was previous inactive', function() {
                spyOn(pairsService, '_setPairStatus');
                pairsService.updatePairStatus(false, person);
                expect(pairsService._setPairStatus).toHaveBeenCalledWith(person1, person2);
                expect(firebaseServiceMock.save).toHaveBeenCalled();
            });

        });

        describe('._setPairStatus', function() {
            var person1, person2;

            it('should return false if both persons are inactive', function() {
                person1 = { active: false };
                person2 = { active: false };

                var status = pairsService._setPairStatus(person1, person2);

                expect(status).toBe(false);
            });

            it('should return false if only one person is inactive', function() {
                person1 = { active: true };
                person2 = { active: false };

                var status = pairsService._setPairStatus(person1, person2);

                expect(status).toBe(false);
            });

            it('should return true if both persons are active', function() {
                person1 = { active: true };
                person2 = { active: true };

                var status = pairsService._setPairStatus(person1, person2);

                expect(status).toBe(true);
            });
        });

        describe('.generatePairs', function() {

            it('should get id for each person', function() {
                var pairs = {};

                var persons = [0, 1, 2];

                spyOn(pairsService, '_isUniquePair');
                spyOn(firebaseServiceMock, 'getFirebaseId');

                var newPairs = pairsService.generatePairs(pairs, persons);

                expect(firebaseServiceMock.getFirebaseId).toHaveBeenCalledWith(persons[0]);
                expect(firebaseServiceMock.getFirebaseId).toHaveBeenCalledWith(persons[1]);
                expect(firebaseServiceMock.getFirebaseId).toHaveBeenCalledWith(persons[2]);
            });

            it('should determine if every pair is unique', function() {
                var pairs = {};
                var persons = [0, 1, 2];
                spyOn(pairsService, '_isUniquePair');

                var newPairs = pairsService.generatePairs(pairs, persons);

                expect(pairsService._isUniquePair.calls.count()).toEqual(3);
            });


            it('should add pairs of persons to the database when pairs are unique', function() {
                var pairs = {};

                var persons = [0, 1, 2];

                spyOn(pairsService, '_addPairToDatabase');
                spyOn(pairsService, '_isUniquePair').and.returnValue(true);

                var newPairs = pairsService.generatePairs(pairs, persons);

                expect(pairsService._addPairToDatabase).toHaveBeenCalledWith(pairs, persons[0], persons[1]);
                expect(pairsService._addPairToDatabase).toHaveBeenCalledWith(pairs, persons[0], persons[2]);
                expect(pairsService._addPairToDatabase).toHaveBeenCalledWith(pairs, persons[1], persons[2]);
            });

            it('should not add pairs of persons to the database when pairs are not unique', function() {
                var pairs = {};

                var persons = [0, 1, 2];

                spyOn(pairsService, '_addPairToDatabase');
                spyOn(pairsService, '_isUniquePair').and.returnValue(false);

                var newPairs = pairsService.generatePairs(pairs, persons);

                expect(pairsService._addPairToDatabase).not.toHaveBeenCalled();
            });

        });

        describe('._addPairToDatabase', function() {
            var pairs, person1, person2;

            beforeEach(function() {
                pairs = {};

                person1 = {
                    first: 'firstMonkey',
                    last: 'lastMonkey'
                };
                person2 = {
                    first: 'firstTiger',
                    last: 'lastTiger'
                };

                spyOn(firebaseServiceMock, 'add');
                spyOn(firebaseServiceMock, 'getFirebaseId').and.returnValues('monkey', 'tiger');
                spyOn(pairsService, '_setPairStatus').and.returnValue(true);
                pairsService._addPairToDatabase(pairs, person1, person2);
            });

            it('should set pair status when adding pair to database', function() {
                expect(pairsService._setPairStatus).toHaveBeenCalledWith(person1, person2);
            });

            it('should add pairs to database', function() {
                expect(firebaseServiceMock.add).toHaveBeenCalledWith(pairs, {
                    person1: 'monkey',
                    person2: 'tiger',
                    dayCount: 0,
                    active: true
                });

            });
        });

        describe('._isUniquePair', function() {
            it('should return true when pair is unique', function() {
                var pairs = {
                    'pair1': {
                        person1: 'person1Id',
                        person2: 'person2Id'
                    }
                };

                var isUnique = pairsService._isUniquePair(pairs, 'person1Id', 'person3Id');

                expect(isUnique).toBe(true);
            });

            it('should return false when a pair is duplicated', function() {
                var pairs = {
                    'pair1': {
                        person1: 'person1Id',
                        person2: 'person2Id'
                    }
                };

                var isUnique = pairsService._isUniquePair(pairs, 'person1Id', 'person2Id');

                expect(isUnique).toBe(false);
            });
        });

    });
});
