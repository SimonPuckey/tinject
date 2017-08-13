//index.js should route  to various testing frameworks - but just use mocha for now
const getConfigModule = require('./injector-config').getConfigModule;

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    injector = require('./injector');

// Instantiate a Mocha instance.
var mocha = new Mocha({reporter:'spec'});

var testDir = './specs';

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    mocha.addFile(
        path.join(testDir, file)
    );
});

//pass in config so can stub from test
//global.mockRequire = injector.overrideRequire(config);
//TODO: even better pass in getConfig func
global.mockRequire = injector.overrideRequire(getConfigModule);
//global.mockRequire = injector.overrideRequire();
global.phantom = {
        exit:() => {}
};




// Run the tests.
mocha.run(function(failures){
    process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
    });
});