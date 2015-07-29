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

openpublishState.findAllByType({type:'image'}, function(err, openpublishImageDocuments) {
  React.render(React.createElement(PublishedImagesList, { 
    showHeader: true,
    showInstructions: true,
    commonBlockchain: commonBlockchain, 
    commonWallet: commonWallet, 
    openpublishImageDocuments: openpublishImageDocuments
  }), document.getElementById('example'));
});