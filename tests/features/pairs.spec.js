'use strict';

describe('stairmaster.pairs module', function() {
    beforeEach(module('stairmaster.pairs'));

    describe('pairs controller', function() {
        var pairsCtrl, scope;

        beforeEach(module('stairmaster.pairs.pairs-controller'));

        beforeEach(function() {
            inject(function($controller, $rootScope) {
                scope = $rootScope.$new();
                pairsCtrl = $controller('PairsCtrl', {$scope: scope});
            });
        });
    });
});
