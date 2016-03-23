'use strict';

describe('stairmaster', function() {

    describe('| navigation', function() {
        it('should automatically redirect to /welcome when location hash/fragment is empty', function() {
            browser.get('index.html');
            expect(browser.getLocationAbsUrl()).toMatch('/welcome');
        });
    });

})
