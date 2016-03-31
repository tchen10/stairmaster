'use strict';

var helper = require('./helpers/testHelper.js');
var seed = require('./helpers/seed.js');

describe('stairs scenarios', function() {

    var testTeamName = 'stairsScenario' + Date.now();
    var firebaseRef = helper.createTeam(testTeamName);

    beforeEach(function() {
        browser.get('index.html#' + testTeamName + '/pairstairs');
    });

    afterEach(function() {
        var ref = helper.getFirebase('Teams/' + testTeamName);
        helper.clearFirebaseRef(ref);
    });

    describe('| stairs', function() {

        beforeEach(function() {
            helper.loadData(testTeamName, seed.data);
        });

        it('should create pair stairs with correct count', function() {
            var rows = element.all(by.repeater('(rowkey, row) in stairs.rows'));
            expect(rows.count()).toBe(3);

            expect(element(by.id('row0-name')).getText()).toBe('Daffy');
            expect(element(by.id('row1-name')).getText()).toBe('Elmer');
            expect(element(by.id('row2-name')).getText()).toBe('Bugs');

            var row1pairs = element.all(by.css('#row1 .stair-pair'));
            expect(row1pairs.count()).toEqual(1);
            var row2pairs = element.all(by.css('#row2 .stair-pair'));
            expect(row2pairs.count()).toEqual(2);

            var count = element(by.id('row1-pair0-count'));
            expect(count.getText()).toEqual('0');

            var incrementButton = element(by.id('row1-pair0-increment'));
            browser.executeScript('arguments[0].click();', incrementButton.getWebElement());
            expect(count.getText()).toEqual('1');

            var decrementButton = element(by.id('row1-pair0-decrement'));
            browser.executeScript('arguments[0].click();', decrementButton.getWebElement());
            expect(count.getText()).toEqual('0');

            browser.executeScript('arguments[0].click();', decrementButton.getWebElement());
            expect(count.getText()).toEqual('0');

        });
    });
});
