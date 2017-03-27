/**
 * Created by rudy on 27.03.17.
 */

var Exchange = require('./exchange.js');
var Connector = require('./connector.js');
var extend = require('extend');
var fetch = require('node-fetch');

var Kraken = function(translator, injector){

    // API: https://www.kraken.com/help/api

    var _pairFn = function(pair){
        // remove X or Z prefix from left+right symbols
        return {left: pair.substr(1, 3), right: pair.substr(5)};
    };

    extend(this, new Exchange('kraken', _pairFn, translator, injector));

    this.init = function(){
        var fetchPairs = fetch('https://api.kraken.com/0/public/AssetPairs');
        this.log('init(): fetching pairs...');
        fetchPairs
            .then(function(res) {
                if (res.status === 200) return res.json();
                return Promise.reject('init(res) [' + res.status + ']: ' + res.statusText);
            })
            .then(function(json){
                if (json && json.result){
                    // add supported pairs
                    var fetched = Object.keys(json.result);
                    this.log('init(): got ' + fetched.length + ' pairs, parsing...');
                    this.addAllPairs(fetched);

                    // create connectors
                    var pairs = this.pairs();
                    this.log('init(): ' + pairs.length +' pairs created...');
                    var uriOB = 'https://api.kraken.com/0/public/Depth?pair={{pair}}&count=1000';
                    for(var i in pairs){
                        var pair = pairs[i];
                        var uri = uriOB.replace('{{pair}}', pair);
                        this.addConnector(new Connector(this, {kind: 'fetch', uri: uri}));
                    }
                    this.log('init(): ' + this.connectors.length +' fetch connectors created (each polling every 0.5s)...');

                    // TODO what else?

                    this.log('init(): done.');
                } else {
                    return Promise.reject('init(json) wrong data format');
                }
            }.bind(this))
            .catch(function(error){
                this.error(error);
            }.bind(this));
    };

    this.run = function(){

    };

    this.stop = function(){

    };
};

module.exports = Kraken;