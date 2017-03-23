/**
 * Created by rudy on 22.03.17.
 */

function Poloniex(tickers, cryptoCurr, countryCurr){

    var ex = require('./exchanger.js');
    var extend = require('extend');
    var autobahn = require('autobahn');

    extend(true, this, new ex('poloniex', tickers, cryptoCurr, countryCurr));

    this._connection = new autobahn.Connection({
        url: 'wss://api.poloniex.com',
        realm: 'realm1'
    });

    this._fixTickers = function(){
        var dict = {
            'USD' : 'USDT'
        };
        for(var our in dict){
            for(var i in this._mapTickerIds){
                var xcgTicker = i.indexOf(our) >=0 ? i.replace(our, dict[our]) : i;
                this._mapTickerIds[i] = xcgTicker;
                this._tickers[xcgTicker] = null;
            }
        }
    };

    this._initTickers = function(cb){
        var request = require('request');
        request('https://poloniex.com/public?command=returnTicker', function (error, response, body) {
            if (error) this.err('error:', error); // Print the error if one occurred
            if (response && response.statusCode && response.statusCode != 200) {
                this.log('statusCode: ' + response.statusCode);
            } if (body) {
                var rt = JSON.parse(body);
                var cnt = 0;
                var notFound = [];
                if (rt){
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
            this.log('_initTickers() done.')
        }.bind(this));

        this.log('_initTickers()...')
    };

    this._init = function() {};

    this._run = function(){
        this.log('opening connection...');
        this._connection.open();
    };

    this._connection.onopen = function(session){

        var _marketEvent = function(pair, args, kwargs) {
            var list = [];
            if (args.length > 0) {
                for (var i in args){
                    var entry = getMktEntry(this.name, pair, args[i], kwargs.seq);
                    if (entry.kind === 'newTrade')
                        this.log('_marketEvent: ' + JSON.stringify(entry));
                    list.push(entry);
                }
            } else {
               //  this.log('_marketEvent (empty)' + JSON.stringify(kwargs.seq));
            }
        }.bind(this);

        function btcXmrEv(args, kwargs){  return _marketEvent('BTC_XMR', args, kwargs);};
        function btcEthEv(args, kwargs){  return _marketEvent('BTC_ETH', args, kwargs);}
        function btcDashEv(args, kwargs){ return _marketEvent('BTC_DASH', args, kwargs);}
        function btcZecEv(args, kwargs){  return _marketEvent('BTC_ZEC', args, kwargs);}
        function btcEtcEv(args, kwargs){  return _marketEvent('BTC_ETC', args, kwargs);}
        function btcLtcEv(args, kwargs){  return _marketEvent('BTC_LTC', args, kwargs);}
        function btcXrpEv(args, kwargs){  return _marketEvent('BTC_XRP', args, kwargs);}
        function btcRepEv(args, kwargs){  return _marketEvent('BTC_REP', args, kwargs);}
        function btcNxtEv(args, kwargs){  return _marketEvent('BTC_NXT', args, kwargs);}
        function btcStrEv(args, kwargs){  return _marketEvent('BTC_STR', args, kwargs);}

        function getMktEntry(x, pair, arg, seq){
            var mkt = {exchanger: x , pair: pair, kind: arg.type};
            for (var i in arg.data) mkt[i] = arg.data[i];
            mkt.seq =seq;
            return mkt;
        }

        var _tickerEvent = function  (args, kwargs) {
            var i = 0;
            var ticker = {
                exchanger: 'poloniex',
                pair: args[i++],
                last: args[i++],
                lowestAsk: args[i++],
                highestBid: args[i++],
                percentChange: args[i++],
                baseVolume: args[i++],
                quotVolume: args[i++],
                isFrozen: args[i++],
                h24high: args[i++],
                h24low: args[i++]
            };
            this.log('_tickerEvent: ' + JSON.stringify(ticker));
        }.bind(this);

        session.subscribe('BTC_XMR', btcXmrEv);
        session.subscribe('BTC_ETH', btcEthEv);
        session.subscribe('BTC_DASH', btcDashEv);
        session.subscribe('BTC_ZEC', btcZecEv);
        session.subscribe('BTC_ETC', btcEtcEv);
        session.subscribe('BTC_LTC', btcLtcEv);
        session.subscribe('BTC_XRP', btcXrpEv);
        session.subscribe('BTC_REP', btcRepEv);
        session.subscribe('BTC_NXT', btcNxtEv);
        session.subscribe('BTC_STR', btcStrEv);
        this.log('running...');
    }.bind(this);

    this._connection.onclose = function () {
        this.running = false;
        this.log('stopped.');
    }.bind(this);

    this._stop = function(){
        this.log('stopping...');
        this._connection.close();
    };
}

module.exports = Poloniex;