

module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', 'requirejs'],
        files: [
            {pattern: 'server/serverUtil.js', included: false},
            {pattern: 'client/emitterUtil.js', included: false},
            {pattern: 'test/testServer.Spec.js', included: false},
            {pattern: 'test/testClient.Spec.js', included: false},
            'test/test-main.js',
        ],
        exclude: [
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 60000,
        singleRun: false
    });
};
