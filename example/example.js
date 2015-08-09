var React = require('react');

var bitcoin = require('bitcoinjs-lib');
var randombytes = require('randombytes');
var xhr = require('xhr');
var NoBalance = require('./no-balance');

var DEV_HOST = "http://localhost:5051";

var coreHost = "https://core.quickcoin.co";
if (typeof(DEV_HOST) != "undefined") {
  coreHost = DEV_HOST;
}

var openpublishState = require('openpublish-state')({
  network: "testnet"
});

var testCommonWallet = require('test-common-wallet');

var PublishedImagesList = require('../src');

var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet",
  inBrowser: true
});

var commonWallet = testCommonWallet({
  seed: "test",
  network: "testnet",
  commonBlockchain: commonBlockchain
});

var getAddressBookFromBlockaiWithDocuments = function(openpublishDocuments, callback) {
  var onlyUnique = function(value, index, self) { 
    return self.indexOf(value) === index;
  }
  var addresses = openpublishDocuments.map(function(d) { return d.sourceAddresses[0] }).filter(onlyUnique);
  xhr({uri: coreHost + '/v0/batchPublicInfo/' + addresses.join(",")}, function(err, res, body) {
    var addressBook = {};
    if (res.statusCode >= 400) {
      return callback(false, addressBook);
    }
    var addresses = JSON.parse(body);
    addresses.forEach(function(a) {
      addressBook[a.publicAddress] = {
        avatarImageUrl: a.profileImageUrl,
        avatarName: a.quickCode,
        avatarSource: 'blockai'
      };
    });
    callback(false, addressBook);
  });
};

commonBlockchain.Addresses.Summary([commonWallet.address], function(err, adrs) { 
  var balance = adrs && adrs[0] ? adrs[0].balance : 0;
  openpublishState.findAllByType({type:'image', limit:1}, function(err, openpublishImageDocuments) {
    getAddressBookFromBlockaiWithDocuments(openpublishImageDocuments, function(err, addressBook) {
      React.render(React.createElement(PublishedImagesList, { 
        showHeader: true,
        showInstructions: true,
        addressBook: addressBook,
        balance: balance,
        NoBalance: NoBalance,
        commonBlockchain: commonBlockchain, 
        commonWallet: commonWallet, 
        openpublishImageDocuments: openpublishImageDocuments
      }), document.getElementById('example'));
    });
  });
});