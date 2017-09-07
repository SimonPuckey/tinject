let getConfigModule = require('./injector-config').getConfigModule;
console.log('Mocha test runner initialised with Tinject...');
const Module = require('module');
//these should be constants but need let to rewire :-(
let originalRequire = Module.prototype.require;
let requireCache = {};

const getModuleName = (moduleName) => {
    //check for .js sans path also? use regexp to speed up?
    return moduleName.substring(moduleName.lastIndexOf('/')+1, moduleName.lastIndexOf('.')) || moduleName;
};
const getSuppliedModule = (moduleName,moduleOverride, moduleCache) =>
    moduleOverride instanceof Object && !Array.isArray(moduleOverride) ?
        moduleOverride :
        moduleCache[moduleName];

// const requireOverride = function() {
const requireOverride = (...args) => {
    let [moduleName, mockModule] = args;
    //TODO: write as series of rules that fall thru
    //TODO: ERROR - cache key looked up (substr mod name) is different to key cached (full path)??
    moduleName = getModuleName(moduleName);
    const givenModule = getSuppliedModule(moduleName,mockModule,requireCache);
    mockModule = givenModule || getConfigModule.call(this,moduleName); // config local to project first process.cwd()
    //NOTE: if we supply a module override arg then it will overwrite cache
    requireCache[moduleName] = mockModule;
    return mockModule || originalRequire.apply(this, args);
};

module.exports = {
    overrideRequire: () => {
        Module.prototype.require = requireOverride;
        return requireOverride;
    }
};