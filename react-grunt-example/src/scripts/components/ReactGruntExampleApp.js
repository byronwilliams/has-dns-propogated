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
        <a className='btn' onClick={this.props.onCheckSubmit}>Find Out</a>
    );
  }
});


var SubmitForm = React.createClass({
    mixins: [Navigation],
    handleCheckSubmit: function(comment) {
          var site = this.refs.site.getDOMNode().value.trim();
          var ip = this.refs.ip.getDOMNode().value.trim();

          // A and Cname types dropdown
          $.ajax({
            url: 'http://dns.reactor10.com:7777',
            type: 'get',
            dataType: "json",
            data:{
                'expected': ip,
                'type': 'a',
                'fqdn': site
            },
            success: function(data) {
                this.replaceWith('check', {}, {'result': data});

            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
      },
      render: function() {
        return (
          <div className="">
            <h3>Has my websites DNS been updated?</h3>
            <form className="">
              <input type="text" placeholder="example.com" ref="site" />
              <input type="text" placeholder="ip address" ref="ip" />

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
        <h1>Has it propgated yet</h1>
        <SubmitForm />
      </div>
    );
  }
});

module.exports = ReactGruntExampleApp;
