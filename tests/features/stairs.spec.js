'use strict';

describe('stairmaster.stairs.module', function() {
    beforeEach(module('stairmaster.stairs'));

    describe('stairs factory', function() {
        var stairsFactory, firebaseServiceMock;

        beforeEach(function() {
            firebaseServiceMock = {
                getTimestamp: function() {}
            };

            module('stairmaster.stairs.stairs-factory');
            module(function($provide) {
                $provide.value('FirebaseService', firebaseServiceMock);
            });
            inject(function(_StairsFactory_) {
                stairsFactory = _StairsFactory_;
            });
        });

        describe('.generateStairs', function() {
            var persons, pairs, person1, person2, person3;

            beforeEach(function() {
                person1 = { id: 'person1Id', first: 'person1Name' };
                person2 = { id: 'person2Id', first: 'person2Name' };
                person3 = { id: 'person3Id', first: 'person3Name' };

                persons = {
                    person1Id: person1,
                    person2Id: person2,
                    person3Id: person3
                };

                pairs = {
                    pair1Id: {
                        person1: person1,
                        person2: person2
                    },
                    pair2Id: {
                        person1: person1,
                        person2: person3
                    },
                    pair3Id: {
                        person1: person2,
                        person2: person3
                    }
                };

                spyOn(firebaseServiceMock, 'getTimestamp').and.returnValue('timestamp');
            });

            it('should generate stairs', function() {
                var expectedStairs = {
                    rows: {
                        row0: {
                            pairs: {
                                pair0: { id: 'pair1Id' },
                                pair1: { id: 'pair2Id' }
                            },
                            name: 'person1Name'

                        },
                        row1: {
                            pairs: {
                                pair0: { id: 'pair3Id' }
                            },
                            name: 'person2Name'
                        }
                    },
                    timestamp: 'timestamp'
                };
                var stairs = stairsFactory.generateStairs(persons, pairs);

                expect(stairs).toEqual(expectedStairs);
            });
        });

    });
});
