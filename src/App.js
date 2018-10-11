import React, { Component } from 'react';
import {HashRouter as Router} from 'react-router-dom';
import ViewRoute from './router';

class App extends Component {
  render() {
    return (
      <Router>
          <ViewRoute />
      </Router>
    )
  }
}

export default App;
