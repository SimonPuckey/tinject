const injector = require('../src/injector');
var expect = require('expect');

describe('init', () => {
    let subject;

    //Get a clean function for each test
    beforeEach(()=>{
        subject = injector.init();
    });
    describe('requireOverride',() => {
        //PSEUDO-FLOW of func under test
        //1.substrings moduleRequest str if path
        //2.gets givenModule from arg list or requireCache
        //3.gets mockModule from givenModule or config
        //4.caches mockModule in requireCache object with requestModule str as key
        //5. returns mockModule or calls copy of original require func

        const FAKE_MODULE_REQUEST = 'FAKE_MODULE_REQUEST';

        // describe('given no arguments', () => {
        //     it('it should throw an error ', () => {
        //         expect(() => {
        //             try{
        //                 subject();
        //             }catch(e) {
        //                 console.log('real error', e)
        //                 throw new Error(e);
        //             }
        //         }).toThrow(/blah/);
        //     });
        // });

        describe('given fake module as argument, empty cache, no config match', () => {
            it('should throw the expected error', () => {
                expect(() => {
                    try{
                        subject(FAKE_MODULE_REQUEST);
                    }catch(e) {
                        throw new Error(e);
                    }
                }).toThrow(/Cannot find module/);
            });
        });

        // describe('[File or Function]', () => {
        //     it('it should ', () => {
        //
        //     });
        // });

    });
});
