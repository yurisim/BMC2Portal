import React from 'react';

import backend from '../../backend.js';
import common from '../../common.js';

import SearchInput from '../utils/searchinput'

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
class AirspaceList extends React.Component {

  // Lifecycle function for after the Component has rendered
  componentDidMount(){
    this.getAirspaces();
  }

  // Retrieve the airspace list from the backend, and process for display
  async getAirspaces(){
    let aspaces = await backend.getAirspaceList();
    let aspaceRows = [];
    aspaces.forEach((aspace) => {
      let name = aspace.name;

      let td1 = <td><a href={"/msncrew/airspacepage.html?aspace="+name}>{aspace.name}</a></td>;
      let td2 = <td><a href={aspace.loaLoc}>{aspace.atcAgency}LOA.pdf</a></td>
      aspaceRows.push(<tr key={aspace.name}>{td1}{td2}</tr>)
    })

    // set state with new 'child' element for rendering
    this.setState({aspaceRows: aspaceRows});
  }

  // Filter the table based on search text
  filterAirspaces(){
    common.filterTable("aspaceTable", "searchText");
  }

  render(){
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
            {/** Conditionally, display "Loading..." or the data if we have it. */}
            {this.state && this.state.aspaceRows}
            {!this.state && <tr><td colSpan="2">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )}
}

export default AirspaceList