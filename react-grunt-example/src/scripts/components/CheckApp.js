'use strict';

var React = require('react/addons');
var State = require('react-router').State;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var FailingDNS = React.createClass({
  render: function() {
      var items = {};
      this.props.results.forEach(function(result) {
        items['result-' + result.Name] = <li>{result.Name}</li>;
      });
      return (
        <div>
            <h3>Failing DNS lookups</h3>
            <ol>
                {items}
            </ol>
        </div>
      );
  }
});

var PassingDNS = React.createClass({
  render: function() {
      var items = {};
      this.props.results.forEach(function(result) {
        items['result-' + result.Name] = <li>{result.Name}</li>;
      });
      return (
        <div>
            <h3>Passing DNS lookups</h3>
        <ol>
            {items}
        </ol>
        </div>
      );
  }
});

var CheckApp = React.createClass({
        mixins: [State],
        render: function() {
            var result = this.getQuery().result;
            var passing = result.Passing || [];
            var failing = result.Failing || [];

            return (
                <div>
                <PassingDNS results={passing} />
                <FailingDNS results={failing} />
                </div>
            );
        }
});


module.exports = CheckApp;
