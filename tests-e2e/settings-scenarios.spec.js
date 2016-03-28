'use strict';

var helper = require('./helpers/testHelper.js');

describe('settings scenarios', function() {

    var testTeamName = 'settingsScenario' + Date.now();
    var firebaseRef = helper.createTeam(testTeamName);

    afterEach(function() {
        var ref = helper.getFirebase('Teams/' + testTeamName);
        helper.clearFirebaseRef(ref);
    });

    describe('| people management', function() {

        beforeEach(function() {
            browser.get('index.html#' + testTeamName + '/settings');
        });

        describe('| crud functionality', function() {
            it('should create, update, and delete a person', function() {
                var personList = element.all(by.css('.person-list.active > li'));

                element(by.id('addPersonForm')).click();
                element(by.model('person.first')).sendKeys('Alexander');
                element(by.model('person.last')).sendKeys('Hamilton');
                element(by.id('addPersonButton')).click();
                expect(personList.count()).toEqual(1);
                var person = personList.last();
                expect(person.getText()).toEqual('Alexander Hamilton');

                // cancel edit
                var editButton = element.all(by.css('[ui-sref="team.editPerson"]')).first();
                browser.executeScript("arguments[0].click();", editButton.getWebElement());
                element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
                element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
                element(by.id('cancelEditPersonButton')).click();
                expect(person.getText()).toEqual('Alexander Hamilton');

                // edit
                browser.executeScript("arguments[0].click();", editButton.getWebElement());
                element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
                element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
                element(by.id('editPersonButton')).click();
                expect(person.getText()).toEqual('Aaron Burr');

                //delete
                var deleteButton = element.all(by.id('deletePerson')).last();
                browser.executeScript("arguments[0].click();", editButton.getWebElement());
                deleteButton.click();
                expect(personList.count()).toEqual(0);
            });
        });

        describe('| deactivation', function() {
            beforeEach(function() {
                var matilda = {
                    active: true,
                    first: 'Matilda',
                    last: 'Wormwood'
                };
                var agatha = {
                    active: true,
                    first: 'Agatha',
                    last: 'Trunchbull'
                };
                var jennifer = {
                    active: true,
                    first: 'Jennifer',
                    last: 'Honey'
                };

                helper.createPerson(testTeamName, matilda);
                helper.createPerson(testTeamName, agatha);
                helper.createPerson(testTeamName, jennifer);
            });

            it('should deactivate a person', function() {
                var activePersonList = element.all(by.css('.person-list.active > li'));
                var inactivePersonList = element.all(by.css('.person-list.inactive > li'));
                helper.sleep();

                var editButton = element.all(by.css('[ui-sref="team.editPerson"]')).first();
                browser.executeScript("arguments[0].click();", editButton.getWebElement());

                // deactivate
                var deactivateButton = element(by.id('deactivatePerson'));
                deactivateButton.click();
                expect(activePersonList.count()).toEqual(2);
                expect(inactivePersonList.count()).toEqual(1);
            });
        });
    });
});
