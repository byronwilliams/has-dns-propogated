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
        getInitialState: function() {
        return {
          passing: [],
          failing: []
        };
        },
        componentDidMount: function() {
            var site = this.getQuery().site;
            var ip = this.getQuery().ip;
            var type = this.getQuery().type;

            $.ajax({
                url: 'http://dns.reactor10.com:7777',
                type: 'get',
                dataType: "json",
                data:{
                    'expected': ip,
                    'type': type,
                    'fqdn': site
                },
                success: function(data) {
                if (this.isMounted()) {
                   this.setState({
                      passing: data.Passing,
                      failing: data.Failing
                    });
                }

                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function() {
            // call could take up to 2secs
            // with upto 28 results
            return (
                <div>
                <PassingDNS results={this.state.passing} />
                <FailingDNS results={this.state.failing} />
                </div>
            );
        }
});


module.exports = CheckApp;
