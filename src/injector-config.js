//Modules requiring object ctxt from calling code defined as functions
const phantom = {
    system: function() {
        return {
            env:{
                PWD: this.id.substring(0, this.id.lastIndexOf('/'))
            },
            args: []
        }
    }
};

module.exports = {
    system: phantom.system,
    webpage: {}
};
