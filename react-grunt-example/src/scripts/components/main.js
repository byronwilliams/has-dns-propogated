var ReactGruntExampleApp = require('./ReactGruntExampleApp');
var CheckApp = require('./CheckApp');

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link
var RouteHandler = Router.RouteHandler;

var content = document.getElementById('content');

var App = React.createClass({
  render: function () {
    return (
      <div>
        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});


var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={ReactGruntExampleApp} />
    <Route name="check" handler={CheckApp} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, content);
});
