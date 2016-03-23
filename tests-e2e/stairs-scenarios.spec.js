'use strict';

var helper = require('./helpers/testHelper.js');
var seed = require('./helpers/seed.js');

describe('stairs scenarios', function() {

    var testTeamName = 'stairsScenario' + Date.now();
    var firebaseRef = helper.createTeam(testTeamName);

    beforeEach(function() {
        browser.get('index.html#' + testTeamName + '/pairstairs');
    });

    describe('| stairs', function() {

        beforeEach(function() {
            helper.loadData(testTeamName, seed.data);
        });

        it('should create pair stairs', function() {
            var rows = element.all(by.repeater('row in stairs.rows'));
            expect(rows.count()).toBe(3);
        });
    });
});
