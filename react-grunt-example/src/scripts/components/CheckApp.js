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
        items[result.Name] = <li className="list-group-item alert alert-danger">
            <div className="row">
                <div className="col-xs-offset-2 col-xs-6">{result.Name}</div>
                <div className="col-xs-2">{result.TTL}</div>
            </div>
            </li>;
      });
      return (
        <div>
            <h3>Failing DNS lookups</h3>
            <ul className="list-group container">
                {items}
            </ul>
        </div>
      );
  }
});

var PassingDNS = React.createClass({
  render: function() {
      var items = {};
      this.props.results.forEach(function(result) {
        items[result.Name] = <li className="list-group-item">
            <div className="row">
                <div className="col-xs-offset-2 col-xs-6">{result.Name}</div>
            </div>
            </li>;
      });
      return (
        <div>
            <h3>Passing DNS lookups</h3>
            <ul className="list-group container">
                {items}
            </ul>
        </div>
      );
  }
});
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
var CheckApp = React.createClass({
        mixins: [State],
        getInitialState: function() {
        return {
          passing: [],
          failing: [],
          pollInterval: 10000
        };
        },
        lookUpDNS: function() {
            console.log('polling')
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
                    var ttl = data.Failing.map(function(result) {
                        return result.TTL;
                    }).reduce(function(previousValue, currentValue, index, array) {
                        if (previousValue < currentValue) {
                            return previousValue;
                        } else {
                            return currentValue;
                        }
                    });

                    this.setState({
                      passing: data.Passing,
                      failing: data.Failing,
                      pollInterval: ttl * 1000
                    });
                }

                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function() {
            // polling code
            this.lookUpDNS();
            setInterval(this.lookUpDNS,  this.state.pollInterval);

        },
        render: function() {
            // call could take up to 2secs
            // with upto 28 results
            return (
                <div className="jumbotron">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="text-center">
                                <PassingDNS results={this.state.passing} />
                                <FailingDNS results={this.state.failing} />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

            );
        }
});


module.exports = CheckApp;
