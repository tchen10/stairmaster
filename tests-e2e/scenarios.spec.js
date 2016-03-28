'use strict';
var helper = require('./helpers/testHelper.js');

describe('stairmaster', function() {

    describe('| navigation', function() {
        it('should automatically redirect to /welcome when location hash/fragment is empty', function() {
            browser.get('index.html');
            expect(browser.getLocationAbsUrl()).toMatch('/welcome');
        });

        it('should automatically redirect to /welcome when team does not exist', function() {
            browser.get('index.html#/notarealteamname/settings');
            helper.sleep();
            expect(browser.getLocationAbsUrl()).toMatch('/welcome');
        });
    });

});
