import React, { ReactElement } from 'react';

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
export default class Airspace extends React.PureComponent<Record<string,unknown>, ASState> {

  // Initialize the state
  constructor(props:Record<string,unknown>){
      super(props);
      this.state = {
          name: "Loading...",
          atcAgency: "Loading...",
          loaLoc: ["Loading..."],
          units: [<div key="loadu">Loading...</div>],
          lessons: [<div key="loadl">Loading...</div>],
          logo: "Loading..."
      }
  }
  // Lifecycle function for after the Component has rendered
  componentDidMount():void {
    this.getAirspaceInfo();
  }

  // Retrieve the airspace information from the backend, and process for display
  async getAirspaceInfo(): Promise<void> {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const aspace = urlParams.get('aspace')
    
    if (aspace === null) return 
    
    const aspaceInfo = await backend.getAirspaceInfo(aspace);

    const unitSplit = aspaceInfo.units.split(",");
    const elems = [<span key="span0">Units:<br/></span>];
    for (let x = 0; x < unitSplit.length; x++){
      elems.push(<a key={unitSplit[x]} href={'/msncrew/unitpage.html?unit=' + unitSplit[x]}> {unitSplit[x]} <br/></a>)
    }

    this.setState({
        name: aspaceInfo.name,
        atcAgency: aspaceInfo.atc,
        loaLoc: aspaceInfo.loaLoc,
        units: elems,
        lessons: [<a key="lla" href={'/common/lessons.html?tags=' + aspaceInfo.name}> Lessons Learned </a>],
        logo: aspaceInfo.logo
    })
  }

  // main Component render
  render(): ReactElement {
    const { 
      name,
      loaLoc,
      atcAgency,
      units,
      lessons,
      logo
     } = this.state
    return (
      <div>
        <table><tbody>
            <tr><th colSpan={2} id="aspace">{name}</th></tr>
            <tr><td id="atc">{atcAgency}</td>
                {loaLoc!==["Loading..."] && 
                  <td key={name}>
                    {loaLoc && 
                     <LoaPdf
                      update={false}
                      loaLoc={loaLoc}
                    />}
                    {!loaLoc && 
                    <div>No LOA associated with this airspace.</div>}
                  </td>
                }
            </tr>
            <tr><td colSpan={2} id="units">{units}</td></tr>
            <tr><td colSpan={2} id="lessons">{lessons}</td></tr>
            <tr><td colSpan={2} height="400px" id="diagram"> {logo} </td></tr>
        </tbody></table>
      </div>
    )}
}