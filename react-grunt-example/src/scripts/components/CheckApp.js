'use strict';

var React = require('react/addons');
var State = require('react-router').State;

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
    "Expected":"178.62.118.87",
    "Type":"a"
};
var Expected = React.createClass({
  render: function() {

  }
});

var Failing = React.createClass({
  render: function() {

  }
});
*/


var Passing = React.createClass({
  render: function() {

  }
});

var CheckApp = React.createClass({
        mixins: [ State ],
        render: function() {
            var result = this.getQuery().result;
            return (
                <Passing />
            );
        }
});


module.exports = CheckApp;
