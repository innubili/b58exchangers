/**
 * Created by rudy on 20.03.17.
 */

var Exchanger = require('./exchanger.js');
var Poloniex = require('./xPoloniex.js');

const currencies = {
    'REP'  : 'Augur',
    'BANX' : 'BanxShares',
    'BTC'  : 'Bitcoin',
    'BTS'  : 'BitShares',
    'XCP'  : 'Counterparty',
    'DASH' : 'Dash',
    'DGD'  : 'DigixDAO',
    'DOGE' : 'Dogecoin',
    'ETH'  : 'Ethereum',
    'ETC'  : 'Ethereum Classic',
    'ICN'  : 'Iconomi',
    'LSK'  : 'Lisk',
    'LTC'  : 'Litecoin',
    'MAID' : 'MaidSafeCoin',
    'XMR'  : 'Monero',
    'XEM'  : 'NEM',
    'NXT'  : 'Nxt',
    'XPY'  : 'PayCoin',
    'PPC'  : 'Peercoin',
    'XRP'  : 'Ripple',
    'STEEM': 'Steem',
    'XLM'  : 'Stellar',
    'DAO'  : 'The DAO',
    'ZEC'  : 'Zcash',
    'ZCL'  : 'Zclassic',
    'USD'  : 'US Dollar',
    'JPY'  : 'Japanese Yen',
    'EUR'  : 'Euro',
    'GBP'  : 'British Pounds',
    'CNY'  : 'Chinese Yuan' };

var tickers = {};
function initTickers(){
    var cnt = 0;
    for (var left in currencies) {
        for (var right in currencies) {
            if (left !== right) {
               cnt++;
               tickers[left + '_' + right] = left + '_' + right;
            }
        }
    }
}

initTickers();

const exchangers = {
    bitstamp: null,
    kraken: new Exchanger('kraken', tickers),
    poloniex: new Poloniex(tickers)
};

function init(){

    var p = exchangers.poloniex;
    p.run();

    // exchangers.kraken._init = function(){this.log('initialized');};
    // exchangers.kraken._initTickers = function(){this.log('_initTickers() done.')};
    // exchangers.kraken.run();
}

init();