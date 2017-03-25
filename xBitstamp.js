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
        this._channels = {};
        // prepare channels
        for(var t in this._tickers){
            var postfix = t === 'btcusd' ? '' : ('_'+t);
            this._channels[t] = {
                trades: { name: 'live_trades' + postfix,  event: 'trade', pusher: 'pushTradeEvent', channel: null},
                order_created: { name: 'live_orders' + postfix,  event: 'order_created', pusher: 'pushOrderBookEvent', channel: null},
                order_changed: { name: 'live_orders' + postfix,  event: 'order_changed', pusher: 'pushOrderBookEvent', channel: null},
                order_deleted: { name: 'live_orders' + postfix,  event: 'order_deleted', pusher: 'pushOrderBookEvent', channel: null}
            }
        }
        // subscribe all channels
        for(var id in this._channels){
            var c = this._channels[id];
            for(var e in c){
                var ch = pusher.subscribe(c[e].name);
                ch.id = id;
                ch.event = c[e].event;
                ch.pusher = c[e].pusher;
                ch.listen = function(event, cb){
                    this.bind(event, function(data){
                        cb(this.event, this.id, this.pusher, data);
                    });
                };
                c[e].channel = ch;
            }
        }
    };

    this._run = function(){
        this.log('running...');
        for(var id in this._channels){
            var c = this._channels[id];
            for(var e in c){
                var channel = c[e].channel;
                this.log('_run() listening to <' + e +'> of ' + channel.id);
                channel.listen(c[e].event, function(ev, id, pusher, data){
                    data._exchange = this.name;
                    data._id = id;
                    data._event = ev;
                    this[pusher](data);
                    //this.log(ev + '<'+id+'> data: ' + JSON.stringify(data));
                }.bind(this));
            }
        }
    };

    this._stop = function(){
        this.log('stopped.');
    }
}

module.exports = Bitstamp;