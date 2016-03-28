'use strict';
var helper = require('./helpers/testHelper.js');

describe('login scenarios', function() {

    var testTeamName = 'loginScenario' + Date.now();
    var firebaseRef = helper.createTeam(testTeamName);

    afterEach(function() {
        var ref = helper.getFirebase('Teams/' + testTeamName);
        helper.clearFirebaseRef(ref);
    });

    describe('create a team', function() {
        var teamName = 'loginScenarioNewTeam' + Date.now();
        var createTeamButton = element(by.id('createTeamButton'));
        var createTeamInput = element(by.model('newTeamName'));

        beforeEach(function() {
            browser.get('index.html#/welcome');
        });

        afterEach(function() {
            var ref = helper.getFirebase('Teams/' + teamName);
            helper.clearFirebaseRef(ref);
        });

        it('should not create a team when team already exists', function() {
            createTeamInput.clear().sendKeys(testTeamName);
            helper.sleep();
            createTeamButton.click();
            expect(element(by.id('add-error')).getText()).toEqual('Team name "' + testTeamName + '" already exists');
        });

        it('should create a team and redirect to team settings page', function() {
            createTeamInput.clear().sendKeys(teamName);
            createTeamButton.click();
            helper.sleep();
            expect(element(by.id('team-settings-header')).getText()).toContain(teamName);
            expect(browser.getLocationAbsUrl()).toMatch('/settings');
        });
    });

    describe('go to team', function() {
        var goTeamInput = element(by.model('teamName'));
        var goTeamButton = element(by.id('goToTeamButton'));

        beforeEach(function() {
            browser.get('index.html#/welcome');
        });

        it('should not redirect when team does not exist', function() {
            var notATeamName = 'randomTeamName';
            goTeamInput.clear().sendKeys(notATeamName);
            goTeamButton.click();
            expect(element(by.id('go-error')).getText()).toEqual('Team name "randomTeamName" does not exist');
        });

        // it('should redirect when team exists', function() {
        //     goTeamInput.clear().sendKeys(testTeamName);
        //     goTeamButton.click();
        //     sleep();
        //     expect(browser.getLocationAbsUrl()).toMatch('/settings');
        // });
    });

});
