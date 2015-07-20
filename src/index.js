var React = require('react');

var PublishedImagesList = React.createClass({
  displayName: 'PublishedImagesList',
  propTypes: {
    commonBlockchain: React.PropTypes.object.isRequired,
    commonWallet: React.PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div className='react-published-images-list'>

      </div>
    )
  }
});

module.exports = PublishedImagesList
