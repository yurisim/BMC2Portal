import React from 'react';

import backend from '../utils/backend.js';
import common from '../utils/common.js';

import SearchInput from '../utils/searchinput'

/**
 * This Component contains a searchable/filterable table of the CONUS SUAs.
 */
class LOAList extends React.Component {

  // Lifecycle function for after the Component has rendered
  componentDidMount(){
    this.getLOAList();
  }

  // Retrieve the airspace list from the backend, and process for display
  async getLOAList(){
    let loas = [];
    try {
      loas = await backend.getLOAList();
    } catch {
      this.setState({failed:true});
    }
    let loaRows = [];
    loas.forEach((loa) => {
      let name = loa.name;

      let td1 = <td>{name}</td>;
      let td2 = <td>{loa.loaLoc}</td>
      loaRows.push(<tr key={loa.name}>{td1}{td2}</tr>)
    })

    // set state with new 'child' element for rendering
    this.setState({loaRows: loaRows});
  }

  // Filter the table based on search text
  filterLOAs(){
    common.filterTable("loaTable", "searchText");
  }

  render(){
    return (
      <div>
        <div>
          <div className="searchDiv">
            <SearchInput searchFunc={this.filterLOAs} />
          </div>
        </div>
        <div style={{paddingTop:"5%"}}>
          <table id="loaTable">
            <tbody>
            <tr><th>LOA</th><th>ATC Agency</th></tr>
            {/** Conditionally, display "Loading..." or the data if we have it. */}
            {this.state && !this.state.failed && this.state.loaRows}
            {this.state && this.state.failed && <tr><td colSpan="2">Failed to retrieve data from server.</td></tr>}
            {!this.state && <tr><td colSpan="2">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )}
}

export default LOAList