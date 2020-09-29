import React from 'react';

import backend from '../utils/backend.js';

import SearchInput from '../utils/searchinput'
import FileUploader from '../fileupload/fileuploader'

/**
 * This Component contains a searchable/filterable table of the CONUS ATC Agencies
 * and their letters of agreement with the 552 ACW.
 */
export default class LOAList extends React.Component {

  // Set default empty state
  constructor(){
    super()
    this.state = {
      loaList:[],
      displayLOAs:[]
    }
  }

  // Lifecycle function for after the Component has rendered
  // We load the LOAs after rendering
  componentDidMount(){
    this.getLOAList();
  }

  // Retrieve the LOA list/data from the backend, and process for display
  async getLOAList(){
    let loas = [];
    try {
      loas = await backend.getLOAList();
      this.setState({loaList: loas, displayLOAs: loas})
    } catch {
      this.setState({ 
        failed:true,
        loaList:[]
      });
    }
  }

  // Filter the table based on search text
  filterLOAs = (value) => {
    value = value.toUpperCase();
    let newLOAs = this.state.loaList.filter((item) => {
      return item.name.toUpperCase().indexOf(value) > -1 || item.loaLoc.toUpperCase().indexOf(value) > -1
    })
    this.setState({
      displayLOAs: newLOAs
    })
  }

  // Check if we are editing at the current index
  isEdit(idx){
    return this.state.editIdx === idx;
  }

  // Retrieve an element for a row that spans both columns
  rowSpan(text) {
      return <tr><td colSpan="2">{text}</td></tr>
  }
  
  // Set the edit index (used to display file Dropzone)
  setEditIdx(idx){
    return () => {this.setState({
      editIdx: idx
    })}
  }

  // Get a button with appropriate styling ('Update' button)
  getButton(text, clickHandler){
    return <button style={{padding:"5px",borderRadius:"5px"}} onClick={clickHandler}>{text}</button>
  }

  // Create the elements for each row in the table
  getLOATableRows(){
    // Default to "Loading..."
    let tableRows = this.rowSpan("Loading...")
    if (this.state){
      // Check if the server is offline, we have an empty database, 
      // or create the elements if there are no errors
      if(this.state.failed){
        tableRows = this.rowSpan("Failed to retrieve data from the server.")
      } else if (this.state.loaList.length===0){
        tableRows = this.rowSpan("No LOAs in the database")
      } else {
        tableRows = this.state.displayLOAs.map((loa,index)=>{
          return (
            <tr key={loa.name+index}>
              <td>
                {loa.name}
              </td>
              <td>
                {this.isEdit(index) &&  // we're editing, so provide the button to close file uploader
                  <div style={{float:"right"}}> {this.getButton("X", this.setEditIdx(-1))} </div>
                }
                <div>{loa.loaLoc}
                  { this.isEdit(index) &&  // we're editing, so provide the file uploader
                    <div style={{margin:"5%"}}>
                      <FileUploader maxFileCount={1} accept="application/pdf,.pdf,.txt"/>
                    </div>
                  } 
                  { !this.isEdit(index) && // we're not editing, so render the update button
                    <div style={{float:"right"}}>
                      {this.getButton("Update", this.setEditIdx(index))}
                    </div>}
                </div>
              </td>
            </tr> )
        })
      }
    }
    return tableRows;
  }

  // Main react rendering
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
            <tr><th>ATC Agency</th><th>LOA</th></tr>
            {this.getLOATableRows()}
            </tbody>
          </table>
        </div>
      </div>
    )}
}