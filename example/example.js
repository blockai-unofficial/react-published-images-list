var React = require('react');

var bitcoin = require('bitcoinjs-lib');
var randombytes = require('randombytes');
var xhr = require('xhr');

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
  xhr({uri: 'http://localhost:5051/v0/batchPublicInfo/' + addresses.join(",")}, function(err, res, body) {
    var addresses = JSON.parse(body);
    var addressBook = {};
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

openpublishState.findAllByType({type:'image', limit:5}, function(err, openpublishImageDocuments) {
  getAddressBookFromBlockaiWithDocuments(openpublishImageDocuments, function(err, addressBook) {
    React.render(React.createElement(PublishedImagesList, { 
      showHeader: true,
      showInstructions: true,
      addressBook: addressBook,
      commonBlockchain: commonBlockchain, 
      commonWallet: commonWallet, 
      openpublishImageDocuments: openpublishImageDocuments
    }), document.getElementById('example'));
  });
});