/**
 * Created by rudy on 22.03.17.
 */

function Kraken(tickers, cryptoCurr, countryCurr){

    var ex = require('./exchanger.js');
    var extend = require('extend');
    var autobahn = require('autobahn');
    var polling = require('async-polling');
    const pollTime = 500;

    extend(true, this, new ex('kraken', tickers, cryptoCurr, countryCurr));

    this._poller = null;

    this._fixTickers = function(){
        var dict = { 'BTC' : 'XBT'};
        for(var our in dict){
            for(var i in this._mapTickerIds){
                var xcgTicker = i.indexOf(our) >=0 ? i.replace(our, dict[our]) : i;
                var left = xcgTicker.split('_')[0];
                var right = xcgTicker.split('_')[1];
                if (left === 'ETC' && right === 'ETH'){
                    console.log('gotcha');
                }
                left = (this.isCountryCurrency(left) ? 'Z' : 'X') + left;
                right = (this.isCountryCurrency(right) ? 'Z' : 'X') + right;
                xcgTicker = left+right;
                this._mapTickerIds[i] = xcgTicker;
                this._tickers[xcgTicker] = null;
            }
        }
    };

    this._initTickers = function(cb){
        var request = require('request');
        request('https://api.kraken.com/0/public/AssetPairs', function (error, response, body) {if (error) this.err('error:', error); // Print the error if one occurred
            if (body) {
                var rt = JSON.parse(body).result;
                var cnt = 0;
                var notFound = [];
                if (rt){
                    this.log('_initTickers(before clean) [' + Object.keys(rt).length + '] entries:\n\t' + Object.keys(rt).join('\t'));
                    for(var t in rt){
                        var tickerId = this.hasTicker(t);
                        if (tickerId) {
                            cnt++;
                            this._tickers[t] = tickerId;
                           // this.log('_initTicker()[' + cnt + ' found: ' + t);
                        } else {
                            notFound.push(t);
                        }
                    }
                }
                for(var i in this._tickers){
                    if (!this._tickers[i]) delete this._tickers[i];
                }
                this.log('_initTickers(after clean) ' + Object.keys(this._tickers).length + ' entries, missing: \n\t' + notFound.join('\t') +'\n_tickers: \n\t' + Object.keys(this._tickers).join('\t'));
                if (cb) cb();
            }
            if (response && response.statusCode && response.statusCode != 200) {
                this.log('statusCode: ' + response.statusCode);
            }
            this.log('_initTickers() done.')
        }.bind(this));

        this.log('_initTickers()...')
    };

    this._init = function() {
        var uriAllTickers = 'https://api.kraken.com/0/public/Ticker?pair=' + Object.keys(this._tickers).join(',');

        this._poller = polling(function(end){
            var request = require('request');
            request(uriAllTickers,
                function (error, response, body) {
                    if (error) {
                        end(error);
                        return;
                    }
                    if (response && response.statusCode && response.statusCode != 200) {
                        this.log('statusCode: ' + response.statusCode);
                    }
                    if (body) {
                        end(null, JSON.parse(body).result);
                    }
                }.bind(this));
        }.bind(this), pollTime);

        this._poller.on('error', function(err){
            this.err(err);
            this.stop();
        }.bind(this));

        this._poller.on('result', function(result){
            this.log(JSON.stringify(result));
        }.bind(this));

        this._poller.on('stop', function () {
            this.running = false;
            this.log('stopped.');
        }.bind(this));
    };

    this._run = function(){
        this.log('running...');
        this._poller.run();
    };

    this._stop = function(){
        this.log('stopping...');
        this._poller.stop();
    }
}

module.exports = Kraken;