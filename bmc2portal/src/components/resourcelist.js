import React from 'react';

import '../css/styles.css';
import '../css/links.css';

/**
 * This Component contains the rendering of the "Links & Resourcs" 'page'.
 */
class ResourceList extends React.Component {

  constructor(){
    super();
    this.state = {
      curTab: "adminTabLI",
      tabClasses: [ "cur-tab red", "green", "blue" ]
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    var id = e.currentTarget.id
    this.setState({
      curTab: id,
      tabClasses: [
        (id ==="adminTabLI") ? "cur-tab red" : "red",
        (id ==="tinkerTabLI") ? "cur-tab green" : "green",
        (id ==="careerTabLI") ? "cur-tab blue" : "blue",
      ]
    })
  }

  render(){
    this.elems = [];
    return (
      <div>
        <div style={{display:"inline-flex", width:"95%"}}>
          <nav style={{width:"100%"}} className="tabs">
            <ul className="tabs-menu" style={{display:"inline-flex", width:"100%"}}>
              <li id="adminTabLI" className={this.state.tabClasses[0]} onClick={this.handleClick}><a href="/#">Admin/Msn Planning</a></li>
              <li id="tinkerTabLI" className={this.state.tabClasses[1]} onClick={this.handleClick}><a href="/#">Tinker AFB</a></li>
              <li id="careerTabLI" className={this.state.tabClasses[2]} onClick={this.handleClick}><a href="/#">Air Force</a></li>
            </ul>
          </nav>
        </div>
        {this.state.curTab==="adminTabLI" && 
          <nav id="adminTab" className="links red">
            <ul>
              <li><a href="https://tk-webapp-s.tinker.af.mil/epex/Login.asp?server=sql2k5clstv-prd&database=pex58awacs" target="_blank" rel="noopener noreferrer">PEX</a>
                  <a href="https://cs2.eis.af.mil/sites/11483/SitePagesR/Home.aspx" target="_blank" rel="noopener noreferrer">OGV SharePoint</a>
                  <a href="https://cs2.eis.af.mil/sites/11483/FCIF/default.aspx" target="_blank" rel="noopener noreferrer">FCIF Library</a></li>
              <li><a href="#link3">Weather</a><a href="#link5">Tinker Weather</a></li>
              <li><a href="https://wwwmil.nellis.af.mil/units/usafws/" target="_blank" rel="noopener noreferrer">USAFWS Papers (.mil)</a></li>
            </ul>
          </nav> }
        {this.state.curTab==="tinkerTabLI" && 
          <nav id="tinkerTab" className="links green">
            <ul>
              <li><a href="#link1">Tinker AFB Home</a></li>
              <li><a href="https://org2.eis.af.mil/sites/21232/SitePages/Home.aspx" target="_blank" rel="noopener noreferrer">552 ACW Sharepoint</a></li>
              <li><a href="#link4">Military OneSource</a></li>
              <li><a href="#link4">Tinker Services</a></li>
            </ul>
        </nav> }
        { this.state.curTab==="careerTabLI" && 
          <nav id="careerTab" className="links blue">
            <ul>
              <li><a href="https://www.my.af.mil" target="_blank" rel="noopener noreferrer">AF Portal</a></li>
              <li><a href="https://external.mail.af.mil/mail/inbox" target="_blank" rel="noopener noreferrer">OWA</a></li>
              <li><a href="https://www.e-publishing.af.mil/" target="_blank" rel="noopener noreferrer">E-Publishing</a></li>
              <li><a href="#link4">Some Other Link</a></li>
            </ul>
          </nav> }
      </div>
    )}
}

export default ResourceList