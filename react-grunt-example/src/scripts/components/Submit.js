'use strict';

var React = require('react/addons');
var Navigation = require('react-router').Navigation;
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');
/*
var exampleResponse = {
    "Passing":[
        {"Name":"OpenDNS.A","TTL":300},
        {"Name":"OpenDNS.B","TTL":201},
        {"Name":"Google.A","TTL":201},
        {"Name":"Google.B","TTL":294},
        {"Name":"Norton.A","TTL":202},
        {"Name":"Comodo.A","TTL":300},
    ],
    "Failing":[
        {"Name":"OpenDNS.A","TTL":300}
    ],
    "Expected":"178.62.118.87","Type":"a"
};
*/
var FindOutButton = React.createClass({
  render: function() {
    return (
        <a className='btn btn-default' onClick={this.props.onCheckSubmit}>Find Out</a>
    );
  }
});


var SubmitForm = React.createClass({
    mixins: [Navigation],
    handleCheckSubmit: function(comment) {
            var site = this.refs.site.getDOMNode().value.trim();
            var ip = this.refs.ip.getDOMNode().value.trim();
            var type = this.refs.type.getDOMNode().value.trim();
            // move to the correct url
            this.replaceWith('check', {}, {
                'site': site,
                'ip': ip,
                'type': type
            });

      },
      render: function() {
        return (
          <div className="">
            <h3>Has my websites DNS been updated?</h3>
            <form className="form-inline">
                <input className="form-control" type="text" placeholder="example.com" ref="site" />
                <input className="form-control" type="text" placeholder="ip address" ref="ip" />
                <select className="form-control" ref="type">
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
      <div className='jumbotron'>
        <SubmitForm />
      </div>
    );
  }
});

module.exports = ReactGruntExampleApp;
