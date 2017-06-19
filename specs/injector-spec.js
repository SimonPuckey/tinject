const injector = require('../src/injector');
const expect = require('expect');

describe('require', () => {
    let require;

    //Get a clean function for each test
    beforeEach(()=>{
        require = injector.overrideRequire();
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
                    console.log('real error', e)
                    throw new Error(e);
                }
            }).toThrow(/Cannot read property 'substring' of undefined/);
        });
    });

    const FAKE_MODULE_REQUEST_PATH = '../FAKEDIR/FAKE_MODULE_REQUEST.js';

    describe('given module request as path', () => {
        describe('[Function or Condition]', () => {

            beforeEach(() => {

            });

            it('it should ', () => {

            });
        });
    });

    const FAKE_MODULE_REQUEST = 'FAKE_MODULE_REQUEST';
    describe('given fake module as argument, empty cache, no config match', () => {
        it('should throw the expected error', () => {
            expect(() => {
                try{
                    require(FAKE_MODULE_REQUEST);
                }catch(e) {
                    throw new Error(e);
                }
            }).toThrow(/Cannot find module/);
        });
    });



});
