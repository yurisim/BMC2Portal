import React from 'react';
  
import { Router, Route, Link, IndexRoute } from 'react-router'
import { createBrowserHistory } from 'history'

// import logo from './logo.svg';
import './css/styles.css';
import './css/fonts.css';
import './css/sidebar.css';
import './css/spoiler.css';
import './css/chips.css';

import SideBar from './components/sidebar.js'

let browserHistory = createBrowserHistory();

function BMC2Portal() {
  return (
    <div className="app">
    
      <Router history={browserHistory}>
        
      </Router>
      <SideBar/>
      <header>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
    </div>
  );
}

export default BMC2Portal;
