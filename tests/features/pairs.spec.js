'use strict';

describe('stairmaster.pairs module', function() {
    beforeEach(module('stairmaster.pairs'));

    describe('pairs controller', function() {
        var pairsCtrl, scope, mockPairsService, mockFirebaseArray;

        beforeEach(function() {
            module('stairmaster.pairs.pairs-controller');
            inject(function($controller, $rootScope, _PairsService_) {
                mockPairsService = _PairsService_;
                scope = $rootScope.$new();
                pairsCtrl = $controller('PairsCtrl', { $scope: scope, PairsService: mockPairsService });
            });
        });

        it('should create persons array in scope', function() {
            expect(Object.prototype.toString.call(scope.persons)).toBe('[object Array]');
        });
    });

    describe('pairs service', function() {
        var pairsService;

        beforeEach(function() {
            module('stairmaster.pairs.pairs-service');
            inject(function(_PairsService_) {
                pairsService = _PairsService_;
            });
        });

        describe('generatePairs', function() {

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

        describe('_addPairToDatabase', function() {
            var pairs;

            beforeEach(function() {
                pairs = {
                    $add: function() {
                        return {
                            then: function(ref) {
                                return ref;
                            }
                        };
                    }
                };

                var person1 = {
                    $id: 'monkey',
                    first: 'firstMonkey',
                    last: 'lastMonkey'
                };
                var person2 = {
                    $id: 'tiger',
                    first: 'firstTiger',
                    last: 'lastTiger'
                };

                spyOn(pairs, '$add').and.callThrough();

                pairsService._addPairToDatabase(pairs, person1, person2);
            });

            it('should add pairs to database', function() {
                expect(pairs.$add).toHaveBeenCalledWith({
                    person1: {
                        id: 'monkey',
                        person: {
                            first: 'firstMonkey',
                            last: 'lastMonkey'
                        }
                    },
                    person2: {
                        id: 'tiger',
                        person: {
                            first: 'firstTiger',
                            last: 'lastTiger'
                        }
                    },
                    days: 0,
                    active: false
                });
            });
        });

        it('should return true when pair is unique', function() {
            var pairs = {
                'pair1': {
                    person1: { id: 'person1Id' },
                    person2: { id: 'person2Id' }
                }
            };

            var person1 = { $id: 'person1Id' };
            var person3 = { $id: 'person3Id' };

            var isUnique = pairsService._isUniquePair(pairs, person1, person3);

            expect(isUnique).toBe(true);
        });

        it('should return false when a pair is duplicated', function() {
            var pairs = {
                'pair1': {
                    person1: { id: 'person1Id' },
                    person2: { id: 'person2Id' }
                }
            };

            var person1 = { $id: 'person1Id' };
            var person2 = { $id: 'person2Id' };

            var isUnique = pairsService._isUniquePair(pairs, person1, person2);

            expect(isUnique).toBe(false);
        });
    });
});
