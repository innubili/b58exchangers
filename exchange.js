/**
 * Created by rudy on 27.03.17.
 */

function Exchange(name, pairFn, translator, injector){
    this.name= name || 'excg?';
    this.connectors = [];
    this.translator = translator;
    this.injector = injector;
    this.pairFn = pairFn || function(pair){return pair;};

    this._tbi = function(fnName){ console.log('Exchange<'+this.name+'>.' + fnName + '() not yet implemented'); };
    this.log = function(text){
        console.log('Exchange<'+this.name+'>: ' + text);};
    this.error = function(error){
       if(error && error.message)
           throw new Error('Exchange<'+this.name+'> error:' + (error && error.message ? error.message : error));
       console.error('Exchange<'+this.name+'> error:' + (error && error.message ? error.message : error));
    };

    this.init = function(){this._tbi('init')};
    this.run = function(){this._tbi('run')};
    this.stop = function(){this._tbi('init')};

    this.addAllPairs = function(pairs, pairFn){
        //this.translator.set
        this.translator.addAllPairs(this.name, pairs);
    };

    this.addPair = function(pair){
        if (this.translator){
            this.translator.addPair(this.name, pair);
        }
    };

    this.addConnector = function(connector){
        connector.id = 'Connector_' + this.name + '_' + this.connectors.length;
        this.connectors.push(connector);
    };

    this.pairs = function(){return this.translator.getPairs(this.name); };

    if (this.translator) {
        this.translator.addExchange(this.name, this.pairFn);
    }
}


module.exports = Exchange;
