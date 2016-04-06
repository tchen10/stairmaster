'use strict';

var helper = require('./helpers/testHelper.js');
var seed = require('./helpers/seed.js');

describe('settings scenarios', function() {
    var testTeamName;

    beforeEach(function() {
        testTeamName = 'settingsScenario' + Date.now();
        var firebaseRef = helper.createTeam(testTeamName);
    });

    afterEach(function() {
        var ref = helper.getFirebase('Teams/' + testTeamName);
        helper.clearFirebaseRef(ref);
    });

    describe('| people management', function() {

        beforeEach(function() {
            browser.get('index.html#' + testTeamName + '/settings');
        });

        afterEach(function() {
            var personsRef = helper.getFirebase('Teams/' + testTeamName).child('Persons');
            var pairsRef = helper.getFirebase('Teams/' + testTeamName).child('Pairs');
            helper.clearFirebaseRef(personsRef);
            helper.clearFirebaseRef(pairsRef);
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


                // add another person and check unique pairs
                element(by.id('addPersonForm')).click();
                element(by.model('person.first')).sendKeys('Marquis');
                element(by.model('person.last')).sendKeys('Lafayette');
                element(by.id('addPersonButton')).click();
                expect(personList.count()).toEqual(3);
                expect(pairsList.count()).toEqual(3);

                //delete
                viewPerson.click();
                editButton.click();
                element(by.id('confirmDelete')).click();
                element(by.id('deletePerson')).click();
                expect(personList.count()).toEqual(2);
                expect(pairsList.count()).toEqual(1);
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

    describe('| display information', function() {

        beforeEach(function() {
            helper.loadData(testTeamName, seed.data);
            browser.get('index.html#' + testTeamName + '/settings');
            helper.sleep();
        });

        afterEach(function() {
            var personsRef = helper.getFirebase('Teams/' + testTeamName).child('Persons');
            var pairsRef = helper.getFirebase('Teams/' + testTeamName).child('Pairs');
            helper.clearFirebaseRef(personsRef);
            helper.clearFirebaseRef(pairsRef);
        });

        it('should display person & pairinformation', function() {
            var viewPerson = element.all(by.css('.person-link')).first();
            viewPerson.click();

            expect(element(by.id('personName')).getText()).toEqual('Bugs Bunny');

            viewPerson = element.all(by.css('.person-link')).last();
            viewPerson.click();

            expect(element(by.id('personName')).getText()).toEqual('Daffy Duck');

            var viewPair = element.all(by.css('.pair-link')).first();
            viewPair.click();

            var pairNames = element(by.id('pairNames'));
            var pairStatus = element(by.id('pairStatus'));
            var pairingDays = element(by.id('pairingDays'));

            expect(pairNames.getText()).toEqual('Elmer Fudd + Daffy Duck');
            expect(pairStatus.getText()).toEqual('Active');
            expect(pairingDays.getText()).toEqual('0');

            viewPair = element.all(by.css('.pair-link')).last();
            viewPair.click();

            expect(pairNames.getText()).toEqual('Bugs Bunny + Elmer Fudd');
            expect(pairStatus.getText()).toEqual('Active');
            expect(pairingDays.getText()).toEqual('2');
        });
    });

    describe('| pair history mangement', function() {

        beforeEach(function() {
            helper.loadData(testTeamName, seed.data);
            browser.get('index.html#' + testTeamName + '/settings');
            helper.sleep();
        });

        afterEach(function() {
            var personsRef = helper.getFirebase('Teams/' + testTeamName).child('Persons');
            var pairsRef = helper.getFirebase('Teams/' + testTeamName).child('Pairs');
            helper.clearFirebaseRef(personsRef);
            helper.clearFirebaseRef(pairsRef);
        });

        it('should edit and delete pairing days', function() {
            var viewPair = element.all(by.css('.pair-link')).last();
            var editingButton = element(by.id('editingButton'));

            viewPair.click();
            editingButton.click();

            element.all(by.model('day.date')).first().clear().sendKeys('May 16, 2016');
            element.all(by.model('day.note')).first().clear().sendKeys('Noted');
            element(by.id('day1-delete')).click();

            var cancelEditingButton = element(by.id('cancelEditPersonButton'));
            cancelEditingButton.click();

            var day0date = element.all(by.id('day0-date')).first();
            var day0note = element.all(by.id('day0-note')).first();
            var pairingDays = element(by.id('pairingDays'));

            expect(day0date.getText()).toEqual('May 16, 2016');
            expect(day0note.getText()).toEqual('Noted');
            expect(pairingDays.getText()).toEqual('1');
        });

    });
});
