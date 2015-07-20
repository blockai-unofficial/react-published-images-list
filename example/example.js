var React = require('react');

var bitcoin = require('bitcoinjs-lib');
var randombytes = require('randombytes');

var simpleCommonWallet = require('../test/simple-common-wallet');

var PublishedImagesList = require('../src');

var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet",
  inBrowser: true
});

var commonWallet = simpleCommonWallet({
  seed: "test",
  commonBlockchain: commonBlockchain
});

React.render(
  React.createElement(PublishedImagesList, { commonBlockchain: commonBlockchain, commonWallet: commonWallet}),
  document.getElementById('example')
);
