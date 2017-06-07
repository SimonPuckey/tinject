//index.js should route  to various testing frameworks - but just use mocha for now

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

global.mockRequire = injector.init();
global.phantom = {
        exit:() => {}
};




// Run the tests.
mocha.run(function(failures){
    process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
    });
});