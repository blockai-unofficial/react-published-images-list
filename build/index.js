'use strict';

var React = require('react');

var PublishedImagesList = React.createClass({
  displayName: 'PublishedImagesList',
  propTypes: {
    commonBlockchain: React.PropTypes.object.isRequired,
    commonWallet: React.PropTypes.object.isRequired
  },
  render: function render() {
    return React.createElement('div', { className: 'react-published-images-list' });
  }
});

module.exports = PublishedImagesList;