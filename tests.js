/**
 * Created by rudy on 25.03.17.
 */

var config = require('./config.js');
var fetch = require('node-fetch');
var Exchange = require('./exchange.js');
var Translator = require('./translator.js');
var Connector = require('./connector.js');
var Promise = require('bluebird');
var extend = require('extend');
var Kraken = require('./kraken.js');

const ex = {
    name: 'exchg',
    pairs: ['XXBTZUSD',
        'XZECXXBT',
        'XXBTXSKP',
        'XZECZEUR',
        'ZUSDZJPY',
        'ZJPYZUSD',
        'ZJPYXXBT',
        'ZUSDXXBT'],
    _pairFn: function (pair) {
        // remove X or Z prefix from left+right symbols
        return {left: pair.substr(1, 3), right: pair.substr(5)};
    }
};

function translator_test() {

    var tx = new Translator(config.cryptos, config.moneys, config.alias, config.events);

    tx.addExchange(ex.name, ex._pairFn);

    ex.pairs.forEach(function (p) {
        tx.addPair(ex.name, p);
    });


    console.log(tx.pairs[ex.name]);

    console.log('translator.tx.pair(' + ex.pairs[1] + ') => ' + tx.pair(ex.name, ex.pairs[1]));
    console.log('translator.tx.xPair(' + tx.pair(ex.name, ex.pairs[1]) + ') => ' + tx.xPair(ex.name, tx.pair(ex.name, ex.pairs[1])));

    tx.mapEventName(ex.name, 'newTrade', config.events.trade);

    console.log('translator.tx.eventName("newTrade") =>' + tx.eventName(ex.name, 'newTrade'));
}

function connector_test(){

    var cx = new Connector(ex, {kind: 'fetch', uri: 'https://api.kraken.com/0/public/Ticker?pair='+ex.pairs[0]});
    console.log(cx);
}

function allTests() {
    // translator_test();
    // connector_test();

    var tx = new Translator(config.cryptos, config.moneys, config.alias, config.events);
    var k = new Kraken(tx);

    k.init();

}

allTests();