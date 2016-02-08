'use strict';

describe('stairmaster.pairs module', function() {
    beforeEach(module('stairmaster.pairs'));

    describe('pairs controller', function() {
        var pairsCtrl, scope;

        beforeEach(function() {
            module('stairmaster.pairs.pairs-controller');
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                pairsCtrl = $controller('PairsCtrl', {$scope: scope});
            });
        });

        it('should create pairs array in scope', function() {
            expect(Object.prototype.toString.call(scope.pairs)).toBe('[object Array]');
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

        it('should add pairs of persons to the database when pairs are unique', function() {
            var pairs = {};

            var persons = [0, 1, 2];

            spyOn(pairsService, '_addToDatabase');
            spyOn(pairsService, '_isUniquePair').and.returnValue(true);

            var newPairs = pairsService.generatePairs(pairs, persons);

            expect(pairsService._addToDatabase).toHaveBeenCalledWith(pairs, persons[0], persons[1]);
            expect(pairsService._addToDatabase).toHaveBeenCalledWith(pairs, persons[0], persons[2]);
            expect(pairsService._addToDatabase).toHaveBeenCalledWith(pairs, persons[1], persons[2]);
        });

        it('should not add pairs of persons to the database when pairs are not unique', function() {
            var pairs = {};

            var persons = [0, 1, 2];

            spyOn(pairsService, '_addToDatabase');
            spyOn(pairsService, '_isUniquePair').and.returnValue(false);

            var newPairs = pairsService.generatePairs(pairs, persons);

            expect(pairsService._addToDatabase).not.toHaveBeenCalled();
        });

        it('should add pairs to database', function() {
            var pairs = {
                $add: function() {}
            };

            var person1 = { $id: 'monkey'};
            var person2 = { $id: 'tiger'};

            spyOn(pairs, '$add');

            pairsService._addToDatabase(pairs, person1, person2);

            expect(pairs.$add).toHaveBeenCalledWith({
                person1: {
                    id: 'monkey',
                    person: { $id: 'monkey' }
                },
                person2: {
                    id: 'tiger',
                    person: { $id: 'tiger' }
                }
            });
        });

        it('should return true when pair is unique', function() {
            var pairs = {
                'pair1' : {
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
                'pair1' : {
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
