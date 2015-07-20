var React = require('react');
var openpublish = require('openpublish');

var PublishedImagesList = React.createClass({
  displayName: 'PublishedImagesList',
  propTypes: {
    commonBlockchain: React.PropTypes.object.isRequired,
    commonWallet: React.PropTypes.object.isRequired,
    openpublishImageDocuments: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      tippingState: {} 
    };
  },
  tipImage: function(imageDoc) {
    var component = this;
    console.log("tip", imageDoc, openpublish);
    var tippingState = this.state.tippingState;
    tippingState[imageDoc.sha1] = "Tipping...";
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
    }, function(error, tipTx) {
      console.log("did tip", error, tipTx);
      var tippingState = component.state.tippingState;
      tippingState[imageDoc.sha1] = "Tipped";
      component.setState({
        tippingState: tippingState
      });
    });
  },
  render: function () {
    console.log(this.state.tippingState);
    var component = this;
    var openpublishImageDocuments = this.props.openpublishImageDocuments;
    var createImage = function(imageDoc) {
      var tipClick = function(event) {
        component.tipImage(imageDoc);
      };
      var buttonText = component.state.tippingState[imageDoc.sha1] || "Tip";
      return (
        <li className="opendoc-image" key={imageDoc.sha1}>
          <img src={imageDoc.uri} />
          <button onClick={tipClick}>{buttonText}</button>
        </li>
      )
    };
    return (
      <div className='react-published-images-list'>
        <h1>Recently Registered Open Publish Images</h1>
        <ol className="images-list">
          {openpublishImageDocuments.map(createImage)}
        </ol>
      </div>
    )
  }
});

module.exports = PublishedImagesList
