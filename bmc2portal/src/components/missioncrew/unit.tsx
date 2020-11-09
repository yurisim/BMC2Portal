import React, { ReactElement } from 'react';

import backend from '../utils/backend';

import {UnitInfo} from '../utils/backendinterface'

type UnitState = {
  unitInfo: UnitInfo,
  failed:boolean,
  lessons: JSX.Element
}

/**
 * This Component contains information on a particular unit.
 */
export default class Unit extends React.Component<Record<string,unknown>, UnitState>{

  // Initialize the state
  constructor(props: Record<string,unknown>){
      super(props);
      this.state = {
          unitInfo: {
            name: "Loading...",
            DSN: "Loading...",
            airfield: "Loading...",
            spinsLoc: "Loading...",
            ifgLoc: "Loading...",
            logo: "Loading..."
          },
          failed:false,
          lessons: <div>Loading...</div>
      }
  }
  // Lifecycle function for after the Component has rendered
  componentDidMount():void{
    this.getUnitInfo();
  }

  // Retrieve the unit information from the backend, and process for display
  async getUnitInfo(): Promise<void>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const unit = urlParams.get('unit')
    const unitQuery = unit ? unit : ""

    let unitInfo = this.state.unitInfo; 
    
    try {
      unitInfo = await backend.getUnitInfo(unitQuery);
    } catch {
      this.setState({failed:true})
    }

    this.setState({
        unitInfo,
        lessons: <a href={'/common/lessons.html?tags=' + unitInfo.name}> Lessons Learned </a>
    });
  }

  // main component render
  render(): ReactElement {
    return (
      <div>
        <table>
          {this.state && !this.state.failed && 
            <tbody>
            <tr><th colSpan={2} id="unitDesig">{this.state.unitInfo.name}</th></tr>
            <tr><td>DSN: </td><td id="unitPhone">{this.state.unitInfo.DSN}</td></tr>
            <tr><td>SPINs:</td><td id="unitSpins">{this.state.unitInfo.spinsLoc}</td></tr>
            <tr><td>IFG:</td><td id="unitIFG">{this.state.unitInfo.ifgLoc}</td></tr>
            <tr><td colSpan={2} id="unitLogo">{this.state.lessons}</td></tr>
            <tr><td colSpan={2} height="400px" id="unitLogo">{this.state.unitInfo.logo}</td></tr>
            </tbody>
          }
          {this.state && this.state.failed &&
            <tbody>
            <tr><th colSpan={2} id="unitDesig">Failed to retrieve data from the server.</th></tr>
            </tbody>
          }    
        </table>
      </div>
    )}
}