/**
 * Created by rudy on 22.03.17.
 */

function Exchanger(name, tickers, cryptoCurr, countryCurr){

    var extend = require('extend');

    // PRIVATE,  TBI by exchanger
    this._init  = function(){this._tbi('_init');}; // exchnage specific intialization
    this._initTickers  = function(cb){this._tbi('_initTickers');}; // exchnage specific intialization
    this._fixTickers = function(){this._tbi('_fixTickers');};
    this._mapTickerIds = tickers;  // map with ALL tickerId(b58)
    this._tickers = {}; // list with all exchanger's tickers;
    this.cryptoCurrencies = Object.keys(cryptoCurr);
    this.countryCurrencies = Object.keys(countryCurr);
    this._lastTickers = null;   // map with all last fetched tickers
    this._lastOrderBooks = {};  // map with all last fetched order books
    this._run = function(){this._tbi('_run');}; // converter JSON(exchanger)->JSON(b58)
    this._stop = function(){this._tbi('_stop');}; // converter JSON(exchanger)->JSON(b58)
    this._getTicker = function(){this._tbi('_getTicker');}; // converter JSON(exchanger)->JSON(b58)
    this._getOrderBook = function(){this._tbi('_getOrderBook');}; // converter JSON(exchanger)->JSON(b58)
    this._transformData = function(kind, data){this.log('_transformData('+kind+') TBI!');return data;};
    this.ready = false;
    this.running = false;

    // public properties
    this.name = name || '???';
    this.lastOrderBooks = [];
    this.tickerIds = function(){ return Object.keys(this._mapTickerIds); }; // std ticker names

    this.isCountryCurrency = function(ticker){
        return ticker && this.countryCurrencies.indexOf(ticker.trim()) > -1;
    };

    this.isCryptoCurrency = function(ticker){
        return ticker && this.cryptoCurrencies.indexOf(ticker.trim()) > -1;
    };

    this.lastTickers = function(){
       if (!this._lastTickers) {
           for (var i in this.tickerIds) {
               this._lastTickers[i] = this._getTicker(this._mapTickerIds[i]);
           }
       }
       return this._lastTickers;
    };

    this.lastOrderBooks = function(){
        if (!this._lastOrderBooks) {
            for (var i in this.tickerIds) {
                this._lastOrderBooks[i] = this._getTicker(this._mapTickerIds[i]);
            }
        }
        return this._lastOrderBooks;
    };

    this.fetchLastTickers = function(){
        this._tbi('fetchLastTickers(in Exchanger!)');
        return this;
    };

    this.init = function(cb){
        this.initTickers(function(){
            this._init();
            if (cb) cb();
        }.bind(this));
    };

    this._tbi = function(fnName){
      throw new Error(this.name + '.'+fnName+'(): not implemented yet!');
    };

    this.err = function(text){
        throw new Error(this.name + ' ' + text);
    };

    this.log = function(text){ console.log(this.name + ': ' + text) };

    this.run = function(){
        if (!this.ready){
            this.init(function(){ this._run(); }.bind(this));
        } else {
            this._run();
        }
    };

    this.pushTradeEvent = function(data){
        data = this._transformData('trade', data);
        this.log('TradeEvent: ' + JSON.stringify(data));
    };

    this.pushOrderBookEvent = function(data){
        data = this._transformData('orderBook', data);
        this.log( 'OrderBookEvent: ' + JSON.stringify(data));
    };

    this.stop = function() {
        if (this.running) {
            this._stop();
            this.log('stopped(was running).');
        } else {
            this.log('stopped(but was NOT running).');
        }
    };

    this.initTickers = function(cb) {
        this._fixTickers();
        this.log('initTickers(all) created ' + (this._mapTickerIds ? Object.keys(this._mapTickerIds).length : 0) + ' entries');
        this._initTickers(cb);
    };

    this.hasTicker = function(xTicker){
        for(var i in this._mapTickerIds){
           if(this._mapTickerIds[i] === xTicker){
               return i;
           }
        }
    };

    this.isReady = function() {return this.ready; }
    this.isRunning = function() {return this.running; }
}

module.exports = Exchanger;
