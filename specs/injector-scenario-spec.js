const rewire = require('rewire');
const injector = rewire('../src/injector');
const expect = require('expect');
const injectorConfig = require('../src/injector-config');

describe('require', () => {
    let require;
    //Get a clean function for each test
    beforeEach(()=>{
        require = injector.overrideRequire();
    });

    describe('given no arguments', () => {
        it('should throw an error ', () => {
            expect(() => {
                try{
                    require();
                }catch(e) {
                    //console.log('real error', e)
                    throw new Error(e);
                }
            }).toThrow(/Cannot read property 'substring' of undefined/);
        });
    });

    describe('given request for module not in npm cache', () => {//TODO: check this is right terminology...
        //TODO: no point writing all same tests again, or looping, just to test path too?
        //const MODULE_REQUEST_PATH = '../FAKEDIR/FAKE_MODULE_REQUEST.js';
        const FAKE_MODULE_REQUEST = 'FAKE_MODULE_REQUEST';
        const FAKE_MODULE = {test:"yay test"};
        describe('not matching a cache entry', () => {
            //requireCache already init'd as empty object
            describe('not matching a config entry', () => {
                //if no match returns nowt (undefined) so no set up required
                it('should throw the expected error', () => {
                    expect(() => {
                        try{
                            require(FAKE_MODULE_REQUEST);
                        }catch(e) {
                            //console.log('real error', e)
                            throw new Error(e);
                        }
                    }).toThrow(/Cannot find module/);
                });
            });
            describe('matching a config entry', () => {
                let restoreConfig;
                beforeEach(() => {
                    restoreConfig = injector.__set__("getConfigModule", () => FAKE_MODULE);
                    require = injector.overrideRequire();
                });
                afterEach(()=>{
                    restoreConfig();
                });
                it('should return config entry',() => {
                    const result = require(FAKE_MODULE_REQUEST);
                    expect(result).toEqual(FAKE_MODULE);
                });
            });
        });
        describe('matching a cache entry', () => {
            let restoreCache;
            beforeEach(()=>{
                //rewire so empty requireCache has matching key
                restoreCache = injector.__set__("requireCache", {FAKE_MODULE_REQUEST: FAKE_MODULE});
            });
            afterEach(()=>{
               restoreCache();
            });
            it('should return cache entry', () => {
                const result = require(FAKE_MODULE_REQUEST);
                expect(result).toEqual(FAKE_MODULE);
            });
        });
    });

    describe('given module override as object', () => {
        const FAKE_MODULE_REQUEST = 'FAKE_MODULE_REQUEST';
        const FAKE_MODULE_OVERRIDE = { testKey: "test value" };
        describe('and cache entry matching module request', () => {
            let configSpy;
            let restoreConfig;
            beforeEach(() => {
                configSpy = expect.createSpy();
                restoreConfig = injector.__set__('getConfigModule', configSpy);
                require = injector.overrideRequire();
            });
            afterEach(()=>{
                restoreConfig();
            });
            after(()=>{
                //reset requireCache after caching override
                injector.__set__("requireCache", {});
            });
            it('should not attempt to get module from config', () => {
                require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE);
                expect(configSpy.calls.length).toEqual(0);
            });
            it('should cache the object supplied', () => {
                require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE);
                const rewiredCache = injector.__get__("requireCache");
                expect(rewiredCache[FAKE_MODULE_REQUEST]).toEqual(FAKE_MODULE_OVERRIDE);
            });
            it('should return the object supplied as a module', () => {
                const result = require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE);
                expect(result).toEqual(FAKE_MODULE_OVERRIDE);
            });
        });
    });

    describe('given module override other than object', ()=> {
        const FAKE_MODULE = {test:"test what?"};
        const FAKE_MODULE_REQUEST = 'FAKE_MODULE_REQUEST';
        const FAKE_MODULE_OVERRIDE_ARRAY = [{ testKey: "test value of object in array" }];//we supply an array. bad.
        describe('and cache entry matching module request',()=> {
            let restoreCache;
            let restoreConfig;
            beforeEach(()=>{
                restoreCache = injector.__set__("requireCache", {FAKE_MODULE_REQUEST : FAKE_MODULE});
            });
            afterEach(()=>{
                restoreCache();
                restoreConfig();
            });
            it('should not attempt to get module from config', () => {
                const configSpy = expect.createSpy();
                restoreConfig = injector.__set__('getConfigModule', configSpy);
                require = injector.overrideRequire();
                require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                expect(configSpy.calls.length).toEqual(0);
            });
            it('should not cache the object supplied', () => {
                const rewiredCache = injector.__get__("requireCache");
                require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                expect(rewiredCache[FAKE_MODULE_REQUEST]).toEqual(FAKE_MODULE);
                expect(rewiredCache[FAKE_MODULE_REQUEST]).toNotEqual(FAKE_MODULE_OVERRIDE_ARRAY);//makes explicit
            });
            it('should return cache entry match', () => {
                const result = require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                expect(result).toEqual(FAKE_MODULE);
            });
        });

        describe('and no cache entry matching module request',()=>{
            let configSpy;
            let restoreConfig;
            let requireSpy;
            let restoreRequire;
            beforeEach(() => {
                configSpy = expect.createSpy();
                restoreConfig = injector.__set__('getConfigModule', configSpy);
                require = injector.overrideRequire();
                requireSpy = expect.createSpy();
                requireSpy.andReturn(FAKE_MODULE);
                restoreRequire = injector.__set__("originalRequire", requireSpy);
            });
            afterEach(()=> {
                configSpy.restore();
                restoreConfig();
                requireSpy.restore();
                restoreRequire();
            });
            describe('and config entry matching module request', () => {
                it('should attempt to get module from config', () => {
                    require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                    expect(configSpy.calls.length).toEqual(1);
                    expect(configSpy).toHaveBeenCalledWith(FAKE_MODULE_REQUEST);
                });
            });
            describe('and no config entry matching module request', () => {
                it('should not cache module', () => {
                    const rewiredCache = injector.__get__("requireCache");
                    require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                    expect(rewiredCache[FAKE_MODULE_REQUEST]).toNotEqual(FAKE_MODULE_OVERRIDE_ARRAY);
                });
                it('should call the original require', () => {
                    require(FAKE_MODULE_REQUEST, FAKE_MODULE_OVERRIDE_ARRAY);
                    expect(requireSpy.calls.length).toEqual(1);
                })
            });
        });
    });
});
