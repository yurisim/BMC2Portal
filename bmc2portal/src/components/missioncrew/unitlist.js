import React from 'react';

import backend from '../utils/backend.js';
import common from '../utils/common.js';

import SearchInput from '../utils/searchinput'

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
class UnitList extends React.Component {

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
    let unitRows = [];
    units.forEach((unit) => {
      let name = unit.name;

      let td1 = <td><a href={"/msncrew/unitpage.html?unit="+name}>{unit.name}</a></td>;
      let td2 = <td>{unit.airfield}</td>
      unitRows.push(<tr key={unit.name}>{td1}{td2}</tr>)
    })

    // set state with new 'child' element for rendering
    this.setState({unitRows: unitRows});
  }

  // Filter the table based on search text
  filterUnits(){
    common.filterTable("unitTable", "searchText");
  }

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
            {/** Conditionally, display "Loading..." or the data if we have it. */}
            {this.state && !this.state.failed && this.state.unitRows}
            {!this.state && <tr><td colSpan="2">Loading...</td></tr>}
            {this.state && this.state.failed && <tr><td colSpan="2">Failed to retrieve data from server.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )}
}

export default UnitList