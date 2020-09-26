import React from 'react';

import backend from '../utils/backend.js';

/**
 * This Component contains information on a particular airspace.
 */
class Airspace extends React.Component {

  constructor(){
      super();
      this.state = {
          name: "Loading...",
          atcAgency: "Loading...",
          loaLoc: "Loading...",
          units: "Loading...",
          lessons: "Loading...",
          logo: "Loading..."
      }
  }
  // Lifecycle function for after the Component has rendered
  componentDidMount(){
    this.getAirspaceInfo();
  }

  // Retrieve the airspace information from the backend, and process for display
  async getAirspaceInfo(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const aspace = urlParams.get('aspace')
    
    let aspaceInfo = await backend.getAirspaceInfo(aspace);

    let unitSplit = aspaceInfo.units.split(",");
    let elems = [<span key="span0">Units:<br/></span>];
    for (var x = 0; x < unitSplit.length; x++){
      elems.push(<a key={unitSplit[x]} href={'/msncrew/unitpage.html?unit=' + unitSplit[x]}> {unitSplit[x]} <br/></a>)
    }

    this.setState({
        name: aspaceInfo.name,
        atcAgency: aspaceInfo.atcAgency,
        loaLoc: aspaceInfo.loaLoc,
        units: elems,
        lessons: <a href={'/msncrew/lessons.html?tags=' + aspaceInfo.name}> Lessons Learned </a>
    })
  }

  render(){
    return (
      <div>
        <table><tbody>
            <tr><th colSpan="2" id="aspace">{this.state.name}</th></tr>
            <tr><td id="atc">{this.state.atcAgency}</td><td id="loaLoc">{this.state.loaLoc}</td></tr>
            <tr><td colSpan="2" id="units">{this.state.units}</td></tr>
            <tr><td colSpan="2" id="lessons">{this.state.lessons}</td></tr>
            <tr><td colSpan="2" height="400px" id="diagram"> {this.state.logo} </td></tr>
        </tbody></table>
      </div>
    )}
}

export default Airspace