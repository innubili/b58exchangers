/**
 * Created by rudy on 25.03.17.
 */

function Translator(cryptos, moneys, alias, events){
    const pairMaker = '_';
    var bimap = require('bidirectional-map');

    this.cryptos = cryptos || [];
    this.moneys = moneys || [];
    this.alias = alias || {};
    this.events = events || [];
    this.allPairs = _getAllPairs(cryptos, moneys, alias);
    this.pairs = {};
    this._eventNames = {};
    this._functions = {};

    function _getAllPairs(crypto, moneys, alias){
        function isMoney(x){
            return moneys.indexOf(x) > -1
        }

        var list = crypto.concat(moneys);
        var all = [];
        list.forEach(function (left){
            list.forEach(function (right){
                // add if not the same and both are not meney currencies
                if (left !== right && !(isMoney(left) && isMoney(right))) {
                    all.push(left + '_' + right);
                }
            });
        });
        return all;
    }

    this._setFn = function(ex, key, fn){
        if (!this._functions[ex]) {
            throw new Error('exchange not defined, use addExchange first');
        }
        this._functions[ex][key] = fn;
    };

    this._findPair = function(pair){
        pair = pair.toUpperCase();
    };

    this._mainCurr = function(curr){
        if (this.moneys.indexOf(curr) > -1)
            return curr;
        if (this.cryptos.indexOf(curr) > -1)
            return curr;
        for(var main in this.alias){
            if (this.alias[main].indexOf(curr) > -1)
                return main;
        }
    };

    this._mainPair = function(left, right){
        var _left = this._mainCurr(left);
        var _right = this._mainCurr(right);
        return _left && _right && _left + pairMaker + _right;
    };

    this._wantedPair = function(mainPair){
        return this.allPairs.indexOf(mainPair) > -1;
    };

    this.addExchange = function(exchangeName, pairFn){
        this.pairs[exchangeName] = new bimap();
        this._functions[exchangeName] = {pairFn: pairFn};
        this._eventNames[exchangeName] =  new bimap();
    };

    this.setTradeFunction = function(exchange, fn){
       this._setFn(exchange, 'trade', fn);
    };

    this.setOrderBookFunction = function(exchange, fn){
        this._setFn(exchange, 'obook', fn);
    };

    this.addPair = function(exchange, pair){
       var _pair = this._functions[exchange].pairFn(pair);
       var mainPair = this._mainPair(_pair.left, _pair.right);
       if (this._wantedPair(mainPair)) {
           this.pairs[exchange].set(pair, mainPair);
           console.log('addPair('+pair+') wanted: ' + mainPair);
       } else {
           console.log('addPair('+pair+') skip: ' + _pair.left + '_' + _pair.right);
       }
    };

    this.pair = function(exchange, pair){
        return this.pairs[exchange] && this.pairs[exchange].get(pair);
    };

    this.xPair = function(exchange, mainPair){
        return this.pairs[exchange] && this.pairs[exchange].getKey(mainPair);
    };

    this.mapEventName = function(exchange, event, mainEvent){
        this._eventNames[exchange].set(event, mainEvent);
    };

    this.eventName = function(exchange, event){
        return this._eventNames[exchange].get(event);
    };

    this.trade = function(exchange, data){
        return this._functions[exchange].trade(data);
    };

    this.orderBook = function(exchange, data){
        return this._functions[exchange].obook(data);
    };
}


module.exports = Translator