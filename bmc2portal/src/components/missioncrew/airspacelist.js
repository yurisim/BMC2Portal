import React from 'react';

import backend from '../../backend.js';
import common from '../../common.js';

class AirspaceList extends React.Component {

  componentDidMount(){
    this.getAirspaces();
  }

  async getAirspaces(){
    console.log("getting airspaces");
    let aspaces = await backend.getAirspaceList();
    let aspaceRows = [];
    aspaces.forEach((aspace) => {
      let name = aspace.name;

      let td1 = <td><a href={"/msncrew/airspacepage.html?aspace="+name}>{aspace.name}</a></td>;
      let td2 = <td><a href={aspace.loaLoc}>{aspace.atcAgency}LOA.pdf</a></td>
      aspaceRows.push(<tr key={aspace.name}>{td1}{td2}</tr>)
    })

    this.setState({aspaceRows: aspaceRows});
  }

  filterAirspaces(){
    common.filterTable("aspaceTable", "searchText");
  }

  render(){
    return (
      <div>
        <div>
          <div className="searchDiv">
            <input className="searchInput" type="text" id="searchText" defaultValue="Enter search text here" style={{color:"gray"}} onInput={this.filterAirspaces} onBlur={(itm)=>common.WaterMark(itm,"blur")} onFocus={(itm)=>common.WaterMark(itm,"focus")} />
            <button className="searchButton" onClick={this.filterAirspaces}>Search</button>
          </div>
        </div>
        <div style={{paddingTop:"5%"}}>
          <table id="aspaceTable">
            <tbody>
            <tr><th>Airspace</th><th>ATC Agency</th></tr>
            {this.state && this.state.aspaceRows}
            {!this.state && <tr><td colSpan="2">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )}
}

export default AirspaceList