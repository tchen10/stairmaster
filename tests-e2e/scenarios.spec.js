'use strict';

describe('stairmaster', function() {

    it('should automatically redirect to /settings when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch('/settings');
    });

    describe('settings', function() {
        beforeEach(function() {
            browser.get('index.html#/settings');
        });

        it('should create, update, edit, delete a person', function() {
            var personList = element.all(by.repeater('person in persons'));
            var editButton = element.all(by.css('[ui-sref="team.editPerson"]')).last();
            var deleteButton = element.all(by.id('deletePerson')).last();

            // add
            element(by.id('addPersonForm')).click();
            element(by.model('person.first')).sendKeys('Alexander');
            element(by.model('person.last')).sendKeys('Hamilton');
            element(by.id('addPersonButton')).click();

            expect(personList.count()).toEqual(1);
            var person = personList.last();
            expect(person.getText()).toEqual('Alexander Hamilton');

            // cancel edit
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

            // delete
            browser.executeScript("arguments[0].click();", editButton.getWebElement());
            deleteButton.click();
            expect(personList.count()).toEqual(0);
        });
    });

    describe('pair stairs', function() {
        beforeEach(function() {
            browser.get('index.html#/settings');

            element(by.id('addPersonForm')).click();
            element(by.model('person.first')).sendKeys('Alexander');
            element(by.model('person.last')).sendKeys('Hamilton');
            element(by.id('addPersonButton')).click();

            element(by.id('addPersonForm')).click();
            element(by.model('person.first')).sendKeys('Aaron');
            element(by.model('person.last')).sendKeys('Burr');
            element(by.id('addPersonButton')).click();

            element(by.id('addPersonForm')).click();
            element(by.model('person.first')).sendKeys('Thomas');
            element(by.model('person.last')).sendKeys('Jefferson');
            element(by.id('addPersonButton')).click();

        });

        it('should create pair stairs', function() {
            var pairStairTab = element.all(by.css('[ui-sref="pairs"]')).last();
            pairStairTab.click();
            expect(element.all(by.css('[ui-view] h2')).first().getText()).
            toMatch(/Pairs/);

            var stairRows = element.all(by.repeater('person in persons'));
            expect(stairRows.count()).toEqual(3);
        });
    });
});
