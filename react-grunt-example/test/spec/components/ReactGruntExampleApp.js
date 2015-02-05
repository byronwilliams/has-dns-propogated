'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var ReactGruntExampleApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactGruntExampleApp = require('../../../src/scripts/components/ReactGruntExampleApp.js');
    component = React.createElement(ReactGruntExampleApp);
  });

  it('should create a new instance of ReactGruntExampleApp', function () {
    expect(component).toBeDefined();
  });
});
