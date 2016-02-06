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

    it('should add person and display in person list', function() {
      element(by.id('addPersonForm')).click();
      element(by.model('person.first')).sendKeys('Alexander');
      element(by.model('person.last')).sendKeys('Hamilton');
      element(by.id('addPersonButton')).click();

      var taskList = element.all(by.repeater('person in persons'));
      expect(taskList.count()).toEqual(1);
    });
  });
});
