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
    var addressBook = this.props.addressBook || {};

    var createImage = function(imageDoc) {

      // https://jsfiddle.net/etzacpt9/ - it is possible to get an array buffer and compute a sha1 to verify URIs in the client
      // https://developers.google.com/web/updates/2011/09/Workers-ArrayBuffer?hl=en
      // https://www.npmjs.com/package/webworkify
      // http://stackoverflow.com/questions/17819820/how-to-get-correct-sha1-hash-of-blob-using-cryptojs
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays

      // http://regex.info/exif.cgi?imgurl=https%3A%2F%2Fbitstore-test.blockai.com%2FmsLoJikUfxbc2U5UhRSjc2svusBSqMdqxZ%2Fsha1%2F4172700449af9e9bdaf22982e223ace206733a4d
      // what about showing EXIF data?

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
      var createdAt = dateFormat(new Date(imageDoc.created_at), "dddd, mmmm dS, yyyy, h:MM TT");
      var blockheightLink = <a href={"https://www.blocktrail.com/tBTC/tx/" + imageDoc.txout_tx_hash}>{imageDoc.output.height}</a>;
      var sourceAddress = imageDoc.sourceAddresses[0];
      var avatarInfo = addressBook[sourceAddress] || false;
      var avatarImageUrl = avatarInfo ? avatarInfo.avatarImageUrl : "https://secure.gravatar.com/avatar/" + md5(sourceAddress) + "?d=retro&s=30";
      var avatarName = avatarInfo ? avatarInfo.avatarName : sourceAddress;
      return (
        <li className={className} key={imageDoc.sha1}>
          <div className="panel-body">
            <div className="created-container">
              <div className="created">
                <div><span className="blockheight label label-info">{blockheightLink}</span><span className="time">{createdAt}</span></div>
              </div>
            </div>
            <img onLoad={imgLoad} onError={imgError} src={imageDoc.uri} />
            <div className="info-container">
              <div className="info">
                <img src={avatarImageUrl} />
                <h4>{avatarName}</h4>
              </div>
            </div>
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
