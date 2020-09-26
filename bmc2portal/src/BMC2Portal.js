import React from "react";

import { Router, Route } from "react-router";
import { createBrowserHistory } from "history";

// import logo from './logo.svg';
import "./css/body.css";
import "./css/styles.css";
import "./css/fonts.css";
import "./css/spoiler.css";
import "./css/chips.css";

import './components/utils/common.js';
import './components/utils/backend.js';

import SideBar from "./components/navigation/sidebar.js";
import AirspaceList from "./components/missioncrew/airspacelist.js";
import ResourceList from "./components/resourcelist.js";
import Home from "./components/home.js";

let browserHistory = createBrowserHistory();

/**
 * This is the main application. 
 * 
 * The application is loaded via 'chunks' (Googe: webpack code-splitting), but 
 * once the application is loaded up front, there is no loading time latency.
 * 
 * This main page contains the <Sidebar> component (loads the left navigation pane),
 * and controls the components that are displayed on navigation.
 * 
 * Note: Links don't actually navigate (POST http), the <Router> controls which 
 * React component is rendered in the "Content" pane.
 * 
 * To add a 'page', one would:
 * - Determine the desired URL/path
 * - Add a "Route" in the Router below.
 *   -- "path" is the url from step 1.
 *   -- "component" is the react component to render
 * - (Optional) Edit the "SideBar" component to add a menu item to navigate to that page
 * - (Alternate) Determine what component will link to it
 *               the AirspacePage Route and Component follow this example;
 *               it isn't in the navigation pane but the AirspaceList component links to it
 * - Design/implement your Component
 */
class BMC2Portal extends React.PureComponent {
  render(){
    return (
      <div className="app">
        <SideBar />
        <div className="body-content">
          <Router history={browserHistory}>
            <Route exact path="/" component={Home} />
            <Route path="/msncrew/airspaces.html" component={AirspaceList} />
            <Route path="/msncrew/airspacepage.html" component={AirspaceList} />
            <Route path="/resources.html" component={ResourceList} />
          </Router>
        </div>
        <header>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
        </header>
      </div>
    )}
}

export default BMC2Portal;
