import React from 'react';

import backend from '../utils/backend';

import SearchInput from '../utils/searchinput'

import '../../css/search.css'

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
export default class UnitList extends React.Component {

  // Initialize state
  constructor(){
    super()
    this.state= {
      units:[],
      displayUnits:[]
    }
  }

  // Lifecycle function for after the Component has rendered
  componentDidMount(){
    this.getUnits();
  }

  // Retrieve the airspace list from the backend, and process for display
  async getUnits(){
    let units = [];

    try {
      units = await backend.getUnitList();
    } catch {
      this.setState({failed:true})
    }

    // set state with units for rendering
    this.setState({units:units, displayUnits:units});
  }

  // Filter the table based on search text
  filterUnits = (value) => {
    value = value.toUpperCase()
    let newDisplay = this.state.units.filter((unit) => {
      return unit.name.toUpperCase().indexOf(value) > -1 || unit.airfield.toUpperCase().indexOf(value) > -1
    })
    this.setState({
      displayUnits: newDisplay
    })
  }

  // Create elements for each unit in the table
  getUnitTableRows() {
    let tableRows = <tr><td colSpan="2">Loading...</td></tr>
    if (this.state){
      if (this.state.failed){
        tableRows = <tr><td colSpan="2">Failed to retrieve data from the server.</td></tr>
      } else if (this.state.displayUnits.length ===0){
        tableRows = <tr><td colSpan="2">No units in the database.</td></tr>
      } else {
        tableRows = this.state.displayUnits.map((unit)=>{
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
  render(){
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