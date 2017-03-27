/**
 * Created by rudy on 26.03.17.
 */

const _cryptos = {
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
    'ZCL'  : 'Zclassic'
};

const _moneys = {
    'USD'  : 'US Dollar',
    'JPY'  : 'Japanese Yen',
    'EUR'  : 'Euro',
    'GBP'  : 'British Pounds',
    'CNY'  : 'Chinese Yuan'
};

const _events = {
    trade: 'TRADE',
    order_book_new: 'OB_NEW',
    order_book_change: 'OB_CHG',
    order_book_delete: 'OB_DEL'
};

var config = {
    cryptoCurrencies: _cryptos,
    cryptos : Object.keys(_cryptos),
    moneyCurrencies: _moneys,
    moneys: Object.keys(_moneys),
    alias: {'BTC': ['XBT'], 'XDG': ['DOGE']},
    events: _events
};

module.exports = config;

