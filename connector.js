/**
 * Created by rudy on 27.03.17.
 */

const types = {fetch: 'fetch', pusher: 'pusher', autobahn: 'autobahn'};

var extend = require('extend');
var fetch = require('node-fetch');
var polling = require('async-polling');
var Promise = require('bluebird');

var _defaultOptions = {
    kind: types.fetch,
    apiKey: '',
    apiSecret: '',
    uri: '',
    realm: '',
    channel: '',
    ebent: '',
    time: 500,
    retries: 10,
    timeout: 300000 };

function Connector(owner, options) {

    this.owner = owner;

    extend(false, this, _defaultOptions);
    extend(false, this, options);

    this.toString = function(){
        return 'Connector<> options: ' + JSON.stringify(this.options).replace(',',',\n\t');
    };

    this.connect = function(){
        switch(this.options.type) {
            case types.fetch:
                return _fetchConnect();
            case types.pusher:
                return _pusherConnect();
            case types.autobahn:
                return _autobahnConnect();
        }
    };

    function _fetchConnect(){
        return null;
    }

    function _pusherConnect(){
        return this._Ponnect;
    }

    function _autobahnConnect(){
        return this._Ponnect;
    }
}

module.exports = Connector;