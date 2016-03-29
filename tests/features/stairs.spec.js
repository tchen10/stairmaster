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
                pairs = {
                    'pair1Id': {
                        'person1': 'michaelId',
                        'person2': 'jimId'
                    },
                    'pair2Id': {
                        'person1': 'michaelId',
                        'person2': 'pamId'
                    },
                    'pair3Id': {
                        'person1': 'jimId',
                        'person2': 'pamId'
                    }
                };

                persons = {
                    'michaelId': {
                        'first': 'Michael',
                        'last': 'Scott',
                        'pairs': {
                            'pair1Id': {
                                'person1': 'michaelId',
                                'person2': 'jimId'
                            },
                            'pair2Id': {
                                'person1': 'michaelId',
                                'person2': 'pamId'
                            }
                        }
                    },
                    'jimId': {
                        'first': 'Jim',
                        'last': 'Halpert',
                        'pairs': {
                            'pair1Id': {
                                'person1': 'person1Id',
                                'person2': 'jimId'
                            },
                            'pair3Id': {
                                'person1': 'jimId',
                                'person2': 'pamId'
                            }
                        }
                    },
                    'pamId': {
                        'first': 'Pam',
                        'last': 'Beesley',
                        'pairs': {
                            'pair2Id': {
                                'person1': 'person1Id',
                                'person2': 'pamId'
                            },
                            'pair3Id': {
                                'person1': 'jimId',
                                'person2': 'pamId'
                            }
                        }
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
                            name: 'Michael'
                        },
                        row1: {
                            pairs: {
                                pair0: { id: 'pair3Id' }
                            },
                            name: 'Jim'
                        },
                        row2: {
                            pairs: {},
                            name: 'Pam'
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
