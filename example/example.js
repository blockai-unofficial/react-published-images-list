var React = require('react');

var bitcoin = require('bitcoinjs-lib');
var randombytes = require('randombytes');
var xhr = require('xhr');

var testCommonWallet = require('test-common-wallet');

var PublishedImagesList = require('../src');

var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet",
  inBrowser: true
});

var getOpenpublishImageDocuments = function(callback) {
  var uri = "http://localhost:9001/opendocs.json";
  xhr({
    uri: uri
  }, function (err, resp, body) {
    var openpublishDocuments = JSON.parse(body);
    var openpublishImageDocuments = openpublishDocuments.filter(function(doc) { 
      return doc.type.indexOf("image") > -1 
    });
    callback(err, openpublishImageDocuments);
  });
};

var commonWallet = testCommonWallet({
  seed: "test",
  network: "testnet",
  commonBlockchain: commonBlockchain
});


getOpenpublishImageDocuments(function(err, openpublishImageDocuments) {
  React.render(React.createElement(PublishedImagesList, { commonBlockchain: commonBlockchain, commonWallet: commonWallet, openpublishImageDocuments:openpublishImageDocuments}), document.getElementById('example'));
});
