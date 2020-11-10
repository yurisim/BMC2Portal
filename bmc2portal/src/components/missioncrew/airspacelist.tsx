import React, { ReactElement } from 'react';

import backend from '../utils/backend';
import SearchInput from '../utils/searchinput'

import LoaPdf from './loapdf'

import '../../css/search.css'
import { Airspace } from '../utils/backendinterface';

type ALState = {
  airspaces: Airspace[],
  displayAirspaces: Airspace[],
  failed: boolean
}

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
export default class AirspaceList extends React.Component<Record<string,unknown>, ALState>{

  // Construct Component with empty state
  constructor(props: Record<string,unknown>){
    super(props)
    this.state = {
      airspaces: [],
      displayAirspaces: [],
      failed:false
    }
  }

  // Lifecycle function for after the Component has rendered
  // We load the airspaces after
  componentDidMount():void{
    this.getAirspaces();
  }

  // Retrieve the airspace list from the backend, and process for display
  async getAirspaces():Promise<void>{
    let aspaces:Airspace[] = []
    try {
      aspaces = await backend.getAirspaceList()
    } catch {
      this.setState({failed:true})
    }

    // set state with new 'child' element for rendering
    this.setState({airspaces: aspaces, displayAirspaces: aspaces});
  }

  // Filter the table based on search text
  filterAirspaces = (value:string):void => {
    const searchVal = value.toUpperCase()
    const newAspaces = this.state.airspaces.filter((aspace)=>{
      let foundMatch = false;
      if (!aspace.loaLoc) return false
      for (let i = 0; i < aspace.loaLoc.length; i++){
        if (!foundMatch && aspace.loaLoc[i].toUpperCase().indexOf(searchVal) > -1)
        foundMatch = true;  
      }
      return aspace.name.toUpperCase().indexOf(searchVal) > -1 || foundMatch
    })
    this.setState({
      displayAirspaces: newAspaces
    })
  }
  
  // Retrieve an element for a row that spans both columns
  rowSpan(elem: JSX.Element):JSX.Element {
    return <tr key={elem.key}><td colSpan={2}>{elem}</td></tr>
  }

  // Construct all of the airspace table rows for rendering
  getAirspaceTableRows():JSX.Element[]{
    // Default to "Loading...""
    let tableRows:JSX.Element[] = [this.rowSpan(<div>Loading...</div>)]
    if(this.state){
      // check if server returned data, returned [], or succeeded
      if (this.state.failed){
        tableRows = [this.rowSpan(<div>Failed to fetch data from the server.</div>)]
      } else if (this.state.displayAirspaces.length ===0 ){
        tableRows = [this.rowSpan(<div>No airspaces in the database.</div>)]
      } else {
        tableRows = this.state.displayAirspaces.map((aspace)=>{
          return <tr key={aspace.name}>
            <td><a href={"/msncrew/airspacepage.html?aspace="+aspace.name}>{aspace.name}</a></td>
            <td>
            {aspace.loaLoc && <LoaPdf 
              update={false}
              loaLoc={aspace.loaLoc}
            />}
            {!aspace.loaLoc && <div>No LOA for this airspace.</div>}
            </td>
          </tr>
        })
      }
    }
    return tableRows
  }

  // main Component render
  render(): ReactElement{
    return (
      <div>
        <div>
          <div className="searchDiv">
            <SearchInput searchFunc={this.filterAirspaces} />
          </div>
        </div>
        <div style={{paddingTop:"5%"}}>
          <table id="aspaceTable">
            <tbody>
            <tr><th>Airspace</th><th>ATC Agency</th></tr>
            {this.getAirspaceTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    )}
}