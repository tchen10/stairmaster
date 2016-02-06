'use strict';

require('./interpolate-filter.js');
require('./version-directive');

angular.module('stairmaster.version', [
  'stairmaster.version.interpolate-filter',
  'stairmaster.version.version-directive'
])

.value('version', '0.1');
