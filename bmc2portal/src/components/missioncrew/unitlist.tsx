import React, { ReactElement } from 'react';

import backend from '../utils/backend';

import SearchInput from '../utils/searchinput'

import '../../css/search.css'
import { UnitInfo } from '../utils/backendinterface';

type ULState = {
  units: UnitInfo[],
  displayUnits: UnitInfo[],
  failed: boolean
}

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
export default class UnitList extends React.PureComponent<Record<string,unknown>,ULState> {

  // Initialize state
  constructor(props:Record<string,unknown>){
    super(props)
    this.state= {
      units:[],
      displayUnits:[],
      failed:false,
    }
  }

  // Lifecycle function for after the Component has rendered
  componentDidMount():void{
    this.getUnits();
  }

  // Retrieve the airspace list from the backend, and process for display
  async getUnits():Promise<void>{
    let units: UnitInfo[] = [];

    try {
      units = await backend.getUnitList();
    } catch {
      this.setState({failed:true})
    }

    // set state with units for rendering
    this.setState({units:units, displayUnits:units});
  }

  // Filter the table based on search text
  filterUnits = (value:string):void => {
    const {units} = this.state 
    value = value.toUpperCase()
    const newDisplay = units.filter((unit) => {
      return unit.name.toUpperCase().indexOf(value) > -1 || unit.airfield.toUpperCase().indexOf(value) > -1
    })
    this.setState({
      displayUnits: newDisplay
    })
  }

  // Create elements for each unit in the table
  getUnitTableRows():JSX.Element[] {
    const {failed, displayUnits } = this.state
    let tableRows:JSX.Element[] = [<tr key="loadrow"><td colSpan={2}>Loading...</td></tr>]
    if (this.state){
      if (failed){
        tableRows = [<tr key="failrow"><td colSpan={2}>Failed to retrieve data from the server.</td></tr>]
      } else if (displayUnits.length ===0){
        tableRows = [<tr key="nourow"><td colSpan={2}>No units in the database.</td></tr>]
      } else {
        tableRows = displayUnits.map((unit)=>{
          return (
            <tr key={unit.name}>
              <td><a href={"/msncrew/unitpage.html?unit="+unit.name}>{unit.name}</a></td>
              <td>{unit.airfield}</td>
            </tr> )
        })
      }
    }
    return tableRows;
  }

  // main component render
  render(): ReactElement {
    return (
      <div>
        <div>
          <div className="searchDiv">
            <SearchInput searchFunc={this.filterUnits} />
          </div>
        </div>
        <div style={{paddingTop:"5%"}}>
          <table id="unitTable">
            <tbody>
              <tr><th>Unit</th><th>Airfeld</th></tr>
              {this.getUnitTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    )}
}