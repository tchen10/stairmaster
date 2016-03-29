'use strict';

var helper = require('./helpers/testHelper.js');
var seed = require('./helpers/seed.js');

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
                var pairsList = element.all(by.css('.pairs-list.active > li'));

                // add person
                element(by.id('addPersonForm')).click();
                element(by.model('person.first')).sendKeys('Alexander');
                element(by.model('person.last')).sendKeys('Hamilton');
                element(by.id('addPersonButton')).click();
                expect(personList.count()).toEqual(1);
                var person = personList.last();
                expect(person.getText()).toEqual('Alexander Hamilton');
                expect(pairsList.count()).toEqual(0);

                // cancel edit
                var viewPerson = element.all(by.css('.person-link')).first();
                var editButton = element(by.id('editingButton'));
                viewPerson.click();
                editButton.click();
                element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
                element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
                element(by.id('cancelEditPersonButton')).click();
                expect(person.getText()).toEqual('Alexander Hamilton');

                // update
                editButton.click();
                element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
                element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
                element(by.id('editPersonButton')).click();
                expect(person.getText()).toEqual('Aaron Burr');

                // add another person
                element(by.id('addPersonForm')).click();
                element(by.model('person.first')).sendKeys('George');
                element(by.model('person.last')).sendKeys('Washington');
                element(by.id('addPersonButton')).click();
                expect(personList.count()).toEqual(2);
                expect(pairsList.count()).toEqual(1);

                //delete
                viewPerson.click();
                editButton.click();
                element(by.id('confirmDelete')).click();
                element(by.id('deletePerson')).click();
                expect(personList.count()).toEqual(1);
                expect(pairsList.count()).toEqual(0);
            });
        });

        describe('| deactivation', function() {
            beforeEach(function() {
                helper.loadData(testTeamName, seed.data);
            });

            it('should deactivate a pair when a person is deactivated', function() {
                var activePersonList = element.all(by.css('.person-list.active > li'));
                var inactivePersonList = element.all(by.css('.person-list.inactive > li'));
                var activePairsList = element.all(by.css('.pairs-list.active > li'));
                var inactivePairsList = element.all(by.css('.pairs-list.inactive > li'));
                helper.sleep();

                element.all(by.css('.person-link')).first().click();
                element(by.id('editingButton')).click();

                // deactivate
                var deactivateButton = element(by.id('deactivatePerson'));
                deactivateButton.click();
                expect(activePersonList.count()).toEqual(2);
                expect(inactivePersonList.count()).toEqual(1);
                expect(activePairsList.count()).toEqual(1);
                expect(inactivePairsList.count()).toEqual(2);
            });
        });
    });
});
