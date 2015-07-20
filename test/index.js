var test = require('tapes');
var jsdom = require('jsdom');

var request = require('request');
var blockcast = require('blockcast');

var testCommonWallet = require('test-common-wallet');

var openpublishDocuments = require('../example/opendocs.json');
var openpublishImageDocuments = openpublishDocuments.filter(function(doc) { 
  return doc.type.indexOf("image") > -1 
});

/*

  React and jsdom testing harness informed by: 
    
    https://github.com/jprichardson/react-qr/blob/master/test.js
    http://stackoverflow.com/questions/30039655/react-mocha-rendering-domexception-wrong-document
    https://www.npmjs.com/package/react-test-utils
    https://github.com/silvenon/react-demo/issues/1#issuecomment-122568860

  Keep an eye on: 

    https://discuss.reactjs.org/t/whats-the-prefered-way-to-test-react-js-components/26
    http://facebook.github.io/react/docs/test-utils.html#shallow-rendering
    https://github.com/robertknight/react-testing/blob/master/tests/TweetList_test.js#L98

*/

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator = {
  userAgent: 'node.js'
};

var React = require('react/addons');
var PublishedImagesList = require('../');
var TestUtils = React.addons.TestUtils;

var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet"
});

var commonWallet = testCommonWallet({
  seed: "test",
  network: "testnet",
  commonBlockchain: commonBlockchain
});

test('react-published-images-list', function (t) {

  t.test('should create the component', function (t) {
    var renderedComponent = TestUtils.renderIntoDocument(React.createElement(PublishedImagesList, { commonWallet: commonWallet, commonBlockchain: commonBlockchain, openpublishImageDocuments:openpublishImageDocuments }));
    var component = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'react-published-images-list');
    var element = React.findDOMNode(component);
    t.ok(element, "has react-published-images-list DOM element");
    t.end();
  });

  t.end();

});
