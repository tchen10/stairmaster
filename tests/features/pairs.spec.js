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

        xit('should generate unique pairs of persons', function() {
            var persons = {'A':'Alexander', 'B':'Burr', 'C':'Candy'};

            var pairs = pairsService.generatePairs(persons);

            expect(pairs.length).toBe(3);
        });

        xit('should return true when pair is unique', function() {
            var pairs = {
                'pair1' : {
                    person1 : 'Alexander',
                    person2: 'Aaron'
                }
            };

            var person1 = 'Alexander';
            var person2 = 'Lafayette';

            var isUnique = pairsService._isUniquePair(pairs, person1, person2);

            expect(isUnique).toBe(true);
        });

        xit('should return false when a pair is duplicated', function() {
            var pairs = {
                'pair1' : {
                    person1: {
                        id: 'person1Id'
                    },
                    person2: {
                        id: 'person2Id'
                    }
                }
            };

            var person1 = { id: 'person1Id' };
            var person2 = { id: 'person2Id' };

            var isUnique = pairsService._isUniquePair(pairs, person1, person2);

            expect(isUnique).toBe(false);
        });

    });
});
