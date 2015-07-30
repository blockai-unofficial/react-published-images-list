'use strict';

var React = require('react');
var openpublish = require('openpublish');
var md5 = require('md5');
var dateFormat = require('dateformat');

var PublishedImagesList = React.createClass({
  displayName: 'PublishedImagesList',
  propTypes: {
    commonBlockchain: React.PropTypes.object.isRequired,
    commonWallet: React.PropTypes.object.isRequired,
    openpublishImageDocuments: React.PropTypes.array.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      tippingState: {},
      loadedImages: [],
      errorImages: []
    };
  },
  tipImage: function tipImage(imageDoc) {
    var component = this;
    var tippingState = this.state.tippingState;
    tippingState[imageDoc.sha1] = 'tipping';
    this.setState({
      tippingState: tippingState
    });
    var commonWallet = this.props.commonWallet;
    var commonBlockchain = this.props.commonBlockchain;
    var destination = imageDoc.sourceAddresses[0];
    var sha1 = imageDoc.sha1;
    var amount = 10000;
    openpublish.tip({
      destination: destination,
      sha1: sha1,
      amount: amount,
      commonWallet: commonWallet,
      commonBlockchain: commonBlockchain
    }, function (error, tipTx) {
      var tippingState = component.state.tippingState;
      tippingState[imageDoc.sha1] = 'tipped';
      component.setState({
        tippingState: tippingState
      });
    });
  },
  render: function render() {
    var component = this;
    var openpublishImageDocuments = this.props.openpublishImageDocuments;

    var createImage = function createImage(imageDoc) {

      // https://jsfiddle.net/etzacpt9/ - it is possible to get an array buffer and compute a sha1 to verify URIs in the client
      // https://developers.google.com/web/updates/2011/09/Workers-ArrayBuffer?hl=en
      // https://www.npmjs.com/package/webworkify
      // http://stackoverflow.com/questions/17819820/how-to-get-correct-sha1-hash-of-blob-using-cryptojs
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays

      var tipClick = function tipClick(event) {
        component.tipImage(imageDoc);
      };
      var imgLoad = function imgLoad(event) {
        var loadedImages = component.state.loadedImages;
        loadedImages.push(imageDoc);
        component.setState({
          loadedImages: loadedImages
        });
      };
      var imgError = function imgError(event) {
        var errorImages = component.state.errorImages;
        errorImages.push(imageDoc);
        component.setState({
          errorImages: errorImages
        });
      };
      var className = 'opendoc-image panel panel-default';
      if (component.state.loadedImages.indexOf(imageDoc) > -1) {
        className += ' loaded';
      }
      if (component.state.errorImages.indexOf(imageDoc) > -1) {
        return React.createElement('div', null);
      }
      var createdAt = dateFormat(new Date(imageDoc.created_at), 'dddd, mmmm dS, yyyy, h:MM TT');
      var blockheightLink = React.createElement(
        'a',
        { href: 'https://www.blocktrail.com/tBTC/tx/' + imageDoc.txout_tx_hash },
        imageDoc.output.height
      );
      return React.createElement(
        'li',
        { className: className, key: imageDoc.sha1 },
        React.createElement(
          'div',
          { className: 'panel-body' },
          React.createElement(
            'div',
            { className: 'created-container' },
            React.createElement(
              'div',
              { className: 'created' },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'blockheight label label-info' },
                  blockheightLink
                ),
                React.createElement(
                  'span',
                  { className: 'time' },
                  createdAt
                )
              )
            )
          ),
          React.createElement('img', { onLoad: imgLoad, onError: imgError, src: imageDoc.uri }),
          React.createElement(
            'div',
            { className: 'info-container' },
            React.createElement(
              'div',
              { className: 'info' },
              React.createElement('img', { src: 'https://secure.gravatar.com/avatar/' + md5(imageDoc.sourceAddresses[0]) + '?d=retro&s=30' }),
              React.createElement(
                'h4',
                { className: 'address' },
                imageDoc.sourceAddresses[0]
              )
            )
          ),
          React.createElement(
            'button',
            { className: 'tip btn btn-xs btn-default', onClick: tipClick },
            React.createElement('img', { src: 'http://blockai-front-page.herokuapp.com/assets/support@2x.png' })
          )
        )
      );
    };
    var header = this.props.showHeader ? React.createElement(
      'h1',
      null,
      'Open Publish Images'
    ) : React.createElement('div', null);
    var instructions = this.props.showInstructions ? React.createElement(
      'p',
      { className: 'alert alert-warning' },
      'Click on ',
      React.createElement(
        'button',
        { className: 'tip btn btn-xs btn-default' },
        React.createElement('img', { src: 'http://blockai-front-page.herokuapp.com/assets/support@2x.png' })
      ),
      ' to tip the owner 110 bits, or about 3 cents worth of Bitcoin!'
    ) : React.createElement('div', null);
    var list = React.createElement(
      'ol',
      { className: 'images-list' },
      openpublishImageDocuments.map(createImage)
    );
    return React.createElement(
      'div',
      { className: 'react-published-images-list' },
      header,
      instructions,
      list
    );
  }
});

module.exports = PublishedImagesList;