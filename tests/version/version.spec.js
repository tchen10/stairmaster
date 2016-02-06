'use strict';

describe('stairmaster.version module', function() {
  beforeEach(module('stairmaster.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
