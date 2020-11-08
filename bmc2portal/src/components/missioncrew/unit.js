import React from 'react';

import backend from '../utils/backend';

/**
 * This Component contains information on a particular unit.
 */
export default class Unit extends React.Component {

  // Initialize the state
  constructor(){
      super();
      this.state = {
          name: "Loading...",
          dsn: "Loading...",
          afld: "Loading...",
          spinsloc: "Loading...",
          ifgloc: "Loading...",
          logo: "Loading..."
      }
  }
  // Lifecycle function for after the Component has rendered
  componentDidMount(){
    this.getUnitInfo();
  }

  // Retrieve the unit information from the backend, and process for display
  async getUnitInfo(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const unit = urlParams.get('unit')

    let unitInfo = {}; 
    
    try {
      unitInfo = await backend.getUnitInfo(unit);
    } catch {
      this.setState({failed:true})
    }

    this.setState({
        name: unitInfo.name,
        dsn: unitInfo.DSN,
        spinsloc: unitInfo.spinsLoc,
        ifgloc: unitInfo.ifgLoc,
        logo: unitInfo.logo,
        lessons: <a href={'/common/lessons.html?tags=' + unitInfo.name}> Lessons Learned </a>
    });
  }

  // main component render
  render(){
    return (
      <div>
        <table>
          {this.state && !this.state.failed && 
            <tbody>
            <tr><th colSpan="2" id="unitDesig">{this.state.name}</th></tr>
            <tr><td>DSN: </td><td id="unitPhone">{this.state.dsn}</td></tr>
            <tr><td>SPINs:</td><td id="unitSpins">{this.state.spinsloc}</td></tr>
            <tr><td>IFG:</td><td id="unitIFG">{this.state.ifgloc}</td></tr>
            <tr><td colSpan="2" id="unitLogo">{this.state.lessons}</td></tr>
            <tr><td colSpan="2" height="400px" id="unitLogo">{this.state.logo}</td></tr>
            </tbody>
          }
          {this.state && this.state.failed &&
            <tbody>
            <tr><th colSpan="2" id="unitDesig">Failed to retrieve data from the server.</th></tr>
            </tbody>
          }    
        </table>
      </div>
    )}
}