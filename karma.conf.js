// Karma configuration
// Generated on Fri Mar 04 2016 14:57:18 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '/Users/br5g8ch/dev/workspaces/angular-works/free-cell/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
        'mocha', 
        'chai',
        'chai-as-promised',
        'sinon',
        'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: 'node_modules/angular/angular.js', include: true},
        {pattern: 'node_modules/*/angular-*.js', include: true},
        {pattern: 'js/ng/*/*-definition.js', include: true},
        {pattern: 'js/**/*.js', include: true},
        {pattern: 'specs/**/*-spec.js', include: true }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'js/**/*.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
        type: 'text',
        check: {
            global: {
                statements: 90,
                lines: 90,
                functions: 90,
                branches: 90
            }
        }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
