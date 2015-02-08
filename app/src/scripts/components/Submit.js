'use strict';

var React = require('react/addons');
var Navigation = require('react-router').Navigation;
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

// var backgroundImageURL = require('../../images/hero-bg.png');

var FindOutButton = React.createClass({
  render: function() {
    return (
        <a className='btn btn-primary btn-lg' onClick={this.props.onCheckSubmit}>Find Out</a>
    );
  }
});


var SubmitForm = React.createClass({
    mixins: [Navigation],
    handleCheckSubmit: function(comment) {
            var site = this.refs.site.getDOMNode().value.trim()
            var ip = this.refs.ip.getDOMNode().value.trim()
            var type = this.refs.type.getDOMNode().value.trim();


            if (site && ip) {
                // move to the correct url
                this.replaceWith('check', {}, {
                    'site': site,
                    'ip': ip,
                    'type': type
                });
            }

            // set warning states
            this.forceUpdate();

      },
      render: function() {
        console.log('rendering')
        return (
          <div className="col-md-6 col-md-offset-3">
            <h1>Has DNS Updated?</h1>
            <form className="form-group">
                <label for="siteEntry">Site</label>
                <input id="siteEntry" className="form-control" type="text" placeholder="example.com" ref="site" />
                <label for="ipEntry">IP</label>
                <input id="ipEntry" className="form-control" type="text" placeholder="ip address" ref="ip" />
                <label for="typeEntry">Type</label>
                <select id="typeEntry" className="form-control" ref="type">
                    <option>A</option>
                    <option>CName</option>
                </select>
            </form>

            <FindOutButton onCheckSubmit={this.handleCheckSubmit}/>
          </div>
        );
      }
});

var ReactGruntExampleApp = React.createClass({
  render: function() {
    return (
        <div className="jumbotron">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-center">
                    <SubmitForm />
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
  }
});

module.exports = ReactGruntExampleApp;
