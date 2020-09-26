import React from 'react';
  
import { Router, Route } from 'react-router'
import { createBrowserHistory } from 'history'

// import logo from './logo.svg';
import './css/body.css';
import './css/styles.css';
import './css/fonts.css';
import './css/sidebar.css';
import './css/spoiler.css';
import './css/chips.css';

import SideBar from './components/sidebar.js'
import AirspaceList from './components/missioncrew/airspacelist.js'
import Home from './components/home.js'

let browserHistory = createBrowserHistory();

function BMC2Portal() {
  return (
    <div className="app">
      <SideBar/>
      <div className="body-content">
      <Router history={browserHistory}>
        <Route path="/" component={Home} />
        <Route path="/msncrew/airspaces.html" component={AirspaceList} />
      </Router>
      </div>
      <header>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
    </div>
  );
}

export default BMC2Portal;
