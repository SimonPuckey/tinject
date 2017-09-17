//Modules requiring object ctxt from calling code defined as functions
const config = {
    system: function() {
        return {
            env:{
                PWD: this.id.substring(0, this.id.lastIndexOf('/'))
            },
            args: []
        }
    },
    webpage: {}
};

//Modules requiring object ctxt from calling code defined as functions
const configES6 = {
    system: function(options) {
        return {
            env:{
                PWD: options.path.substring(0, options.path.lastIndexOf('/'))
            },
            args: []
        }
    },
    webpage: {}
};

//exporting objects with methods rather than functions allows for easier extension and changes to dependent code
module.exports = {
    //es6 -> so pass in arg rather than 'this'
    getConfigModuleES6 : (requestedModule, options) =>{
        return (configES6[requestedModule] instanceof Function) ? configES6[requestedModule](options) : configES6[requestedModule];
    },
    //think will also need to pass in 'this' as arg, as ctxt diff here. Or is obj ctxt defined when called? Test
    getConfigModule : function (moduleRequest) {
        return (config[moduleRequest] instanceof Function) ? config[moduleRequest].call(this) : config[moduleRequest];
    },
    setConfigModule: function(filePath){
        //read in contents of file at path
        //call once when init prog
    }
};