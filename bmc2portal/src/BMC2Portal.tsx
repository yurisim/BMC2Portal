import React, { Suspense, lazy, ReactElement } from "react";

import { Router, Route, RouteComponentProps, StaticContext } from "react-router";
import { createBrowserHistory } from "history";

import "./css/snackbar.css";
import "./css/styles.css";
import "./css/body.css";
import "./css/fonts.css";

import baseMap from './resources/ktik_map.jpg'
import awacsOrbit from './resources/AWACSOrbitMap.pdf'
import triadOrbit from './resources/IronTriadOrbitMap.pdf'

import {ParrotSour} from 'parrotsour-components'

const SideBar = lazy(()=>import('./components/navigation/sidebar'))

const AirspaceList = lazy(()=>import("./components/missioncrew/airspacelist"))
const LOAList = lazy(()=>import("./components/missioncrew/loalist"))
const UnitList = lazy(()=>import("./components/missioncrew/unitlist"))
const Airspace = lazy(()=>import("./components/missioncrew/airspace"))
const Unit = lazy(()=>import("./components/missioncrew/unit"))
const LessonsLearnedList = lazy(()=>import("./components/lessonslearned/lessonslearned"))
const ResourceList = lazy(()=>import("./components/resourcelist"))

const Home = lazy(()=> import("./components/home"))

//const ParrotSour = lazy(()=>import("./components/parrotsour/parrotsour"))

const ImagePane = lazy(()=>import("./components/utils/imagepane"))
const FilePane = lazy(()=>import("./components/utils/filepane"))
const FaaMap = lazy(()=>import("./components/common/faamap"))

const browserHistory = createBrowserHistory();

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
//export default class BMC2Portal extends React.PureComponent {
const BMC2Portal = ():ReactElement => {

  function getARTracks (props:RouteComponentProps<string, StaticContext, unknown>): JSX.Element {
    return <ImagePane {...props} imageSrc="UR IMG HURR" />
  }
  
  function getBaseMap ( props:RouteComponentProps<string, StaticContext, unknown>): JSX.Element {
    return <ImagePane {...props} imageSrc={baseMap} />
  }

  function getIronTriad ( props: RouteComponentProps<string, StaticContext, unknown>): JSX.Element {
    return <FilePane {...props} title="Iron Triad Map" src={triadOrbit} />
  }

  function getOrbits ( props: RouteComponentProps<string, StaticContext, unknown>) : JSX.Element{
    return <FilePane {...props} title="AWACS Orbits" src={awacsOrbit} />
  }

  function getPS() : JSX.Element {
    return <ParrotSour type="chooser" />
  }

  function getPSP(): JSX.Element {
    return <ParrotSour type="procedural"/>
  }

  function getPSI(): JSX.Element {
    return <ParrotSour type="intercept"/>
  }

  return (
    <div className="app">
    <Suspense fallback={<div>Loading...</div>} >
      <SideBar />
    </Suspense>
    <div className="body-content">
      <Router history={browserHistory}>
        <Suspense fallback={<div>Loading...</div>} >
        <Route exact path="/" component={Home} />
        <Route path="/msncrew/loalist.html" component={LOAList} />
        <Route path="/msncrew/airspacelist.html" component={AirspaceList} />
        <Route path="/msncrew/airspacepage.html" component={Airspace} />
        <Route path="/msncrew/unitlist.html" component={UnitList} />
        <Route path="/msncrew/unitpage.html" component={Unit} />
        <Route path="/msncrew/parrotsour.html" render={getPS} />
        <Route path="/msncrew/parrotsourintercept.html" render={getPSI} />
        <Route path="/msncrew/parrotsourprocedural.html" render={getPSP} />
        <Route path="/resources.html" component={ResourceList} />
        
        <Route path="/loas" component={FilePane} />
        <Route path="/common/faamap.html" component={FaaMap} />
        <Route path="/common/lessons.html" component={LessonsLearnedList}/>
        <Route path="/common/artracks.html" render={getARTracks}/>
        <Route path="/common/orbits.html" render={getOrbits}/>
        <Route path="/common/triadorbits.html" render={getIronTriad} />

        <Route path="/common/basemap.html" render={getBaseMap} />
        </Suspense>
      </Router>
    </div>
    <div id="snackbar" />
  </div>
  )
}

export default BMC2Portal