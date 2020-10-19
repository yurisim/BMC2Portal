import React from "react";

import { Router, Route } from "react-router";
import { createBrowserHistory } from "history";

import "./css/body.css";
import "./css/styles.css";
import "./css/snackbar.css";
import "./css/fonts.css";
import "./css/chips.css";

import baseMap from './resources/ktik_map.jpg'
import awacsOrbit from './resources/AWACSOrbitMap.pdf'
import triadOrbit from './resources/IronTriadOrbitMap.pdf'

import SideBar from "./components/navigation/sidebar.js";
import AirspaceList from "./components/missioncrew/airspacelist.js";
import LOAList from "./components/missioncrew/loalist.js";
import UnitList from "./components/missioncrew/unitlist.js";
import Airspace from "./components/missioncrew/airspace.js";
import Unit from "./components/missioncrew/unit.js";
import LessonsLearnedList from "./components/lessonslearned/lessonslearned.js";
import ResourceList from "./components/resourcelist.js";
import Home from "./components/home.js";

import ImagePane from "./components/utils/imagepane.js";
import FilePane from "./components/utils/filepane.js";
import FaaMap from "./components/common/faamap";

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
export default class BMC2Portal extends React.PureComponent {

  render(){
    return (
      <div className="app">
        <SideBar />
        <div className="body-content">
          <Router history={browserHistory}>
            <Route exact path="/" component={Home} />
            <Route path="/msncrew/loalist.html" component={LOAList} />
            <Route path="/msncrew/airspacelist.html" component={AirspaceList} />
            <Route path="/msncrew/airspacepage.html" component={Airspace} />
            <Route path="/msncrew/unitlist.html" component={UnitList} />
            <Route path="/msncrew/unitpage.html" component={Unit} />
            <Route path="/resources.html" component={ResourceList} />
            
            <Route path="/loas" component={FilePane} />
            <Route path="/common/faamap.html" component={FaaMap} />
            <Route path="/common/lessons.html" component={LessonsLearnedList}/>
            <Route path="/common/artracks.html" render={(props) => (<ImagePane {...props} imageSrc="UR IMG HURR" /> )}/>
            <Route path="/common/orbits.html" render={(props) => (<FilePane {...props} src={awacsOrbit} /> )}/>
            <Route path="/common/triadorbits.html" render={(props) => (<FilePane {...props} src={triadOrbit} /> )}/>

            <Route path="/common/basemap.html" render={(props) => (<ImagePane {...props} imageSrc={baseMap} /> )}/>
            </Router>
        </div>
        <div id="snackbar"></div>
        <header>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
        </header>
      </div>
    )}
}
