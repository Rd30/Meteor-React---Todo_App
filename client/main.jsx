import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.jsx';
import '../imports/startup/accounts-config.js';

// Client side entry point
Meteor.startup(() => {
  render(<App/>, document.getElementById('render-target'));
});
