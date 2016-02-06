'use strict';

module.exports = function(config){
  config.set({

    basePath : '../.',

    files : [
      'node_modules/mockfirebase/browser/mockfirebase.js',
      'app/bundle.js',
      'tests/**/*.spec.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
