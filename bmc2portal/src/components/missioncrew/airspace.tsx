import React from 'react';

import backend from '../utils/backend';

import LoaPdf from './loapdf'

type ASState = {
  name: string,
  atcAgency: string,
  loaLoc: string[],
  units: JSX.Element[],
  lessons: JSX.Element[],
  logo: string
}

/**
 * This Component contains information on a particular airspace.
 */
export default class Airspace extends React.Component<Record<string,unknown>, ASState> {

  // Initialize the state
  constructor(props:Record<string,unknown>){
      super(props);
      this.state = {
          name: "Loading...",
          atcAgency: "Loading...",
          loaLoc: ["Loading..."],
          units: [<div>"Loading..."</div>],
          lessons: [<div>"Loading..."</div>],
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
    
    if (aspace === null) return 
    
    let aspaceInfo = await backend.getAirspaceInfo(aspace);

    let unitSplit = aspaceInfo.units.split(",");
    let elems = [<span key="span0">Units:<br/></span>];
    for (var x = 0; x < unitSplit.length; x++){
      elems.push(<a key={unitSplit[x]} href={'/msncrew/unitpage.html?unit=' + unitSplit[x]}> {unitSplit[x]} <br/></a>)
    }

    this.setState({
        name: aspaceInfo.name,
        atcAgency: aspaceInfo.atc,
        loaLoc: aspaceInfo.loaLoc,
        units: elems,
        lessons: [<a href={'/common/lessons.html?tags=' + aspaceInfo.name}> Lessons Learned </a>],
        logo: aspaceInfo.logo
    })
  }

  // main Component render
  render(){
    return (
      <div>
        <table><tbody>
            <tr><th colSpan={2} id="aspace">{this.state.name}</th></tr>
            <tr><td id="atc">{this.state.atcAgency}</td>
                {this.state.loaLoc!=="Loading..." && 
                  <td key={this.state.name}>
                    {this.state.loaLoc && 
                     <LoaPdf
                      update={false}
                      loaLoc={this.state.loaLoc}
                    />}
                    {!this.state.loaLoc && 
                    <div>No LOA associated with this airspace.</div>}
                  </td>
                }
            </tr>
            <tr><td colSpan={2} id="units">{this.state.units}</td></tr>
            <tr><td colSpan={2} id="lessons">{this.state.lessons}</td></tr>
            <tr><td colSpan={2} height="400px" id="diagram"> {this.state.logo} </td></tr>
        </tbody></table>
      </div>
    )}
}