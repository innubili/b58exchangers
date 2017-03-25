/**
 * Created by rudy on 25.03.17.
 */

var config = require('./config.js');
var Translator = require('./translator.js');
var tx = new Translator(config.cryptos, config.moneys, config.alias, config.events);

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
    pairFn: function(pair){
        // remove X or Z prefix from left+right symbols
        return {left: pair.substr(1,3), right: pair.substr(5)};
    },
    tradeFn: function(data){
        return {};
    },
    obFn: function(data){
        return {}
    }
};

tx.addExchange(ex.name, ex.pairFn);

ex.pairs.forEach(function(p){
    tx.addPair(ex.name, p);
});


console.log(tx.pairs[ex.name]);

console.log('translator.tx.pair('+ex.pairs[1]+') => ' + tx.pair(ex.name, ex.pairs[1]));
console.log('translator.tx.xPair('+tx.pair(ex.name, ex.pairs[1])+') => ' + tx.xPair(ex.name, tx.pair(ex.name, ex.pairs[1])));

tx.mapEventName(ex.name, 'newTrade', config.events.trade);

console.log('translator.tx.eventName("newTrade") =>'+ tx.eventName(ex.name, 'newTrade'));