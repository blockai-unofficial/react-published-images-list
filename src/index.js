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
      tippingState: {},
      loadedImages: [],
      errorImages: []
    };
  },
  tipImage: function(imageDoc) {
    var component = this;
    var tippingState = this.state.tippingState;
    tippingState[imageDoc.sha1] = "tipping";
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
      var tippingState = component.state.tippingState;
      tippingState[imageDoc.sha1] = "tipped";
      component.setState({
        tippingState: tippingState
      });
    });
  },
  render: function () {
    var component = this;
    var openpublishImageDocuments = this.props.openpublishImageDocuments;
    var createImage = function(imageDoc) {
      var tipClick = function(event) {
        component.tipImage(imageDoc);
      };
      var imgLoad = function(event) {
        var loadedImages = component.state.loadedImages;
        loadedImages.push(imageDoc);
        component.setState({
          loadedImages: loadedImages
        })
      }
      var imgError = function(event) {
        var errorImages = component.state.errorImages;
        errorImages.push(imageDoc);
        component.setState({
          errorImages: errorImages
        });
      }
      var className = "opendoc-image panel panel-default";
      if (component.state.loadedImages.indexOf(imageDoc) > -1) {
        className += " loaded";
      }
      if (component.state.errorImages.indexOf(imageDoc) > -1) {
        return <div />;
      }
      return (
        <li className={className} key={imageDoc.sha1}>
          <div className="panel-body">
            <img onLoad={imgLoad} onError={imgError} src={imageDoc.uri} />
            <button className="tip btn btn-xs btn-default" onClick={tipClick}><img src="http://blockai-front-page.herokuapp.com/assets/support@2x.png" /></button>
          </div>
        </li>
      )
    };
    var header = this.props.showHeader ? <h1>Open Publish Images</h1> : <div />;
    var instructions = this.props.showInstructions ? <p className="alert alert-warning">Click on <button className="tip btn btn-xs btn-default"><img src="http://blockai-front-page.herokuapp.com/assets/support@2x.png" /></button> to tip the owner 110 bits, or about 3 cents worth of Bitcoin!</p> : <div />;
    var list = <ol className="images-list">{openpublishImageDocuments.map(createImage)}</ol>
    return (
      <div className='react-published-images-list'>
        {header}
        {instructions}
        {list}
      </div>
    );
  }
});

module.exports = PublishedImagesList
