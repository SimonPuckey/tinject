let getConfigModule;

console.log('Mocha test runner initialised with Tinject...');
const Module = require('module');
//this should be const but changed to let so can rewire :-(
let originalRequire = Module.prototype.require;
//this should be const but changed to let so can rewire :-(
//Pass cache in as dependency and stub
let requireCache = {};

const getModuleName = (moduleName) => {
    //check for .js sans path also? use regexp to speed up?
    return moduleName.substring(moduleName.lastIndexOf('/')+1, moduleName.lastIndexOf('.')) || moduleName;
};
const getSuppliedModule = (moduleName,moduleOverride, moduleCache) =>
    moduleOverride instanceof Object && !Array.isArray(moduleOverride) ?
        moduleOverride :
        moduleCache[moduleName];

const requireOverride = function () {
    //TODO: use param destruct & arrow function rather than func with arg obj and bound this? Need 'this' below tho
    //TODO: write as series of rules that fall thru
    //TODO: ERROR - cache key looked up (substr mod name) is different to key cached (full path)??
    const moduleName = getModuleName(arguments[0]);
    const givenModule = getSuppliedModule(moduleName,arguments[1],requireCache);
    const mockModule = givenModule || getConfigModule.call(this,moduleName); // config local to project first process.cwd()
    //NOTE: if we supply a module override arg then it will overwrite cache
    requireCache[moduleName] = mockModule;
    return mockModule || originalRequire.apply(this, arguments);
};

module.exports = {
    overrideRequire: (getModuleConfig) => {
        getConfigModule = getModuleConfig;
        Module.prototype.require = requireOverride;
        return requireOverride;
    }
};