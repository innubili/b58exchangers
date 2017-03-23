/**
 * Created by rudy on 20.03.17.
 */

var extend = require('extend');

var Exchanger = require('./exchanger.js');
var Poloniex = require('./xPoloniex.js');
var Kraken = require('./xKraken.js');
var Bitstamp = require('./xBitstamp.js');

const cryptoCurrencies = {
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
    'ZCL'  : 'Zclassic'};

const countryCurrencies = {
    'USD'  : 'US Dollar',
    'JPY'  : 'Japanese Yen',
    'EUR'  : 'Euro',
    'GBP'  : 'British Pounds',
    'CNY'  : 'Chinese Yuan' };

var tickers = {};
function initTickers(){
    var currencies = {};
    extend(currencies, cryptoCurrencies, countryCurrencies);
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
   kraken: new Kraken(tickers, cryptoCurrencies, countryCurrencies),
   poloniex: new Poloniex(tickers, cryptoCurrencies, countryCurrencies),
    bitstamp: new Bitstamp(tickers, cryptoCurrencies, countryCurrencies)
};

function run(){
    for (var x in exchangers) exchangers[x].run();
}

run();