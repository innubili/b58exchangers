/**
 * Created by rudy on 22.03.17.
 */

function Bitstamp(tickers, cryptoCurr, countryCurr){

    var ex = require('./exchanger.js');
    var Pusher = require('pusher-client');
    var extend = require('extend');

    var polling = require('async-polling');
    const pollTime = 2500;

    extend(true, this, new ex('bitstamp', tickers, cryptoCurr, countryCurr));

    this._poller = null;

    this._fixTickers = function(){
        for(var i in this._mapTickerIds){
            var xcgTicker = i.toLowerCase().replace('_','');
            this._mapTickerIds[i] = xcgTicker;
            this._tickers[xcgTicker] = null;
        }
    };

    this._initTickers = function(cb){
        this.log('_initTickers()...');
        this._fixTickers();
        var cnt = 0;
        var notFound = [];
        var rt = {
            btcusd: null, btceur: null, eurusd: null,
            xrpusd: null, xrpeur: null, xrpbtc: null};
        this.log('_initTickers(before clean) [' + Object.keys(rt).length + '] entries:\n\t' + Object.keys(rt).join('\t'));
        for(var t in rt){
            var tickerId = this.hasTicker(t);
            if (tickerId) {
                cnt++;
                this._tickers[t] = tickerId;
            } else {
                notFound.push(t);
            }
        }
        for(var i in this._tickers){
            if (!this._tickers[i]) delete this._tickers[i];
        }
        this.log('_initTickers(after clean) ' + Object.keys(this._tickers).length + ' entries, missing: \n\t' + notFound.join('\t') +'\n_tickers: \n\t' + Object.keys(this._tickers).join('\t'));
        if (cb) cb();
        this.log('_initTickers() done.')
    };

    this._init = function() {
        var pusher = new Pusher('de504dc5763aeef9ff52');
        this._tickerChannels = {};
        for(var t in this._tickers){
            var channel = pusher.subscribe('live_trades'+ (t === 'btcusd' ? '' : ('_'+t)));
            channel.id = t;
            channel.listen = function(event, cb){
                this.bind(event, function(data){
                    cb(this.id, data);
                });
            };
            this._tickerChannels[t] = channel;
        }

        // var uriAllTickers = 'https://api.kraken.com/0/public/Ticker?pair=' + Object.keys(this._tickers).join(',');
        //
        // this._poller = polling(function(end){
        //     var request = require('request');
        //     request(uriAllTickers,
        //         function (error, response, body) {
        //             if (error) {
        //                 end(error);
        //                 return;
        //             }
        //             if (response) {
        //                 this.log('statusCode: ' + response.statusCode);
        //             }
        //             if (body) {
        //                 end(null, JSON.parse(body).result);
        //             }
        //         }.bind(this));
        // }.bind(this), pollTime);
        //
        // this._poller.on('error', function(err){
        //     this.err(err);
        //     this.stop();
        // }.bind(this));
        //
        // this._poller.on('result', function(result){
        //     this.log(JSON.stringify(result));
        // }.bind(this));
        //
        // this._poller.on('stop', function () {
        //     this.running = false;
        //     this.log('stopped.');
        // }.bind(this));
    };

    this._run = function(){
        this.log('running...');
        for(var t in this._tickers) {
            this._tickerChannels[t].listen('trade', function(id, data){
                this.log('trade <'+id+'> data: ' + JSON.stringify(data));
            }.bind(this));
        }
    };

    this._stop = function(){
//        this.log('stopping...');
        this.log('stopped.');
//        this._poller.stop();
    }
}

module.exports = Bitstamp;