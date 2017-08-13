const injector = require('../src/injector');
const expect = require('expect');
//const sinon = require('sinon');
const getConfigModule = require('../src/injector-config').getConfigModule;//need to stub this

describe('require', () => {
    let require;

    //Get a clean function for each test
    beforeEach(()=>{
        // require = injector.overrideRequire(config);
        require = injector.overrideRequire(getConfigModule);
    });
    //PSEUDO-FLOW of func under test
    //TODO: make these individually testable functions(rules)??
    //1.substrings moduleRequest str if path
    //2.gets givenModule from arg list or requireCache
    //3.gets mockModule from givenModule or config
    //4.caches mockModule in requireCache object with requestModule str as key
    //5. returns mockModule or calls copy of original require func

    describe('given no arguments', () => {
        it('it should throw an error ', () => {
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

    const VALID_MODULE_REQUEST_PATH = '../FAKEDIR/FAKE_MODULE_REQUEST.js';

    describe('given request for unregistered module', () => {//TODO: check this is right terminology...
        const FAKE_MODULE_REQUEST = 'MODULE_REQUEST';
        describe('not matching a cache entry', () => {
            //requireCache already init'd as empty object
            describe('not matching a config entry', () => {
                //TODO: need to mock 'injector-config' so returns empty object
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

            });
        });
        describe('matching a cache entry', () => {

        });
    });

    describe('given module override as object', () => {
        describe('and cache entry matching module request', () => {
            it('should not attempt to get module from config', () => {

            });
            it('should cache the object supplied', () => {

            });
            it('should return the object supplied as a module', () => {

            });
        });
    });

    describe('given module override other than object', ()=> {
        describe('and cache entry matching module request',()=> {
            it('should not attempt to get module from config', () => {

            });
            it('should not cache the object supplied', () => {

            });
            it('should return cache entry match', () => {

            });
        });
        //GOOD! shows if separate into functions can narrow boundaries of what is being tested
        //BAD! 3 level deep subscribe shows testing too much and need to split into functions
        describe('and no cache entry matching module request',()=>{
            it('should attempt to get module from config', () => {

            });
            describe('and no config entry matching module request', () => {
                it('should not cache module', () => {
                    //TODO: at moment does attempt to cache a null object
                });
                it('should call the original require', () => {

                })
            });
        });
    });

});
