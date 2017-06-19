const config = require('./injector-config');

console.log('Mocha test runner initialised with Tinject...');
const Module = require('module');
const originalRequire = Module.prototype.require;

const requireCache = {};
//let count =0;//debugging

const getConfigModule = function (moduleRequest) {
    return (config[moduleRequest] instanceof Function) ? config[moduleRequest].call(this) : config[moduleRequest];
};
const requireOverride = function () {
    // console.log('hi');
    // console.log('args1: ', arguments[0])
    //count++;
    //console.log(`request ${count} is ${arguments[0]}`);//debugging
    //TODO: use param destruct & arrow function rather than func with arg obj and bound this? Need 'this' below tho
    const moduleRequest = arguments[0];

    //TODO: write as series of rules that fall thru - chain of responsibility kinda...
    //TODO: ERROR - cache key looked up (substr mod name) is different to key cached (full path)??
    //TODO:need to substring and get last token when checking for a mock - write as separate function so created once in memory
    //const reqModule = moduleRequest.substring(moduleRequest.lastIndexOf('/')+1, moduleRequest.lastIndexOf('.'));//first request for mock exp = undefined
    const reqModule = moduleRequest.substring(moduleRequest.lastIndexOf('/')+1, moduleRequest.lastIndexOf('.')) || moduleRequest; //check for .js sans path also? use regexp to speed up?
    //look in cache for module and gets from 2nd arg if cannot find. override cache? see ^
    //const givenModule = requireCache[reqModule] || (arguments[1] instanceof Object ? arguments[1] : undefined);//so 1st request will always use arg
    const givenModule = arguments[1] instanceof Object ? arguments[1] : requireCache[reqModule];
    const mockModule = givenModule || getConfigModule.call(this,moduleRequest); // config local to project first process.cwd()
    // console.log('before caching - modReq', moduleRequest);
    // console.log('before caching - reqMod', reqModule);
    //requireCache[moduleRequest] = mockModule;//cache/re-cache module//TODO: check if kv same before overwriting?
    requireCache[reqModule] = mockModule;
    // console.log('after caching...',requireCache[moduleRequest]);
    return mockModule || originalRequire.apply(this, arguments);
};

module.exports = {
    overrideRequire: () => {
        Module.prototype.require = requireOverride;
        return requireOverride;
    }
}