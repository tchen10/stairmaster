'use strict';

describe('stairmaster', function() {

  it('should automatically redirect to /team when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/team");
  });

  describe('team', function() {
    beforeEach(function() {
      browser.get('index.html#/team');
    });

    it('should render team view when user navigates to /team', function() {
      expect(element.all(by.css('[ui-view] h2')).first().getText()).
        toMatch(/Team/);
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
      editButton.click();
      element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
      element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
      element(by.id('cancelEditPersonButton')).click();
      expect(person.getText()).toEqual('Alexander Hamilton');

      // edit
      editButton.click();
      element(by.model('personToUpdate.first')).clear().sendKeys('Aaron');
      element(by.model('personToUpdate.last')).clear().sendKeys('Burr');
      element(by.id('editPersonButton')).click();
      expect(person.getText()).toEqual('Aaron Burr');

      // delete
      deleteButton.click();
      expect(personList.count()).toEqual(0);
    });
  });
});
