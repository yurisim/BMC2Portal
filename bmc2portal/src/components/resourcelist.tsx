import React, { ReactElement } from 'react';

import '../css/styles.css';
import '../css/links.css';

interface RLState{
  curTab: string,
  tabClasses: string[]
}

/**
 * This Component contains the rendering of the "Links & Resourcs" 'page'.
 */
export default class ResourceList extends React.PureComponent<Record<string,unknown>, RLState> {

  // Set initial tabs
  constructor(props:Record<string,unknown>){
    super(props);
    this.state = {
      curTab: "adminTabLI",
      tabClasses: [ "cur-tab red", "green", "blue" ]
    }
  }

  // Handle a click on a top tab (menu item)
  handleMenuClick = (e: React.MouseEvent<HTMLLIElement>):void => {
    e.preventDefault();
    const id = e.currentTarget.id
    this.setState({
      curTab: id,
      tabClasses: [
        (id ==="adminTabLI") ? "cur-tab red" : "red",
        (id ==="tinkerTabLI") ? "cur-tab green" : "green",
        (id ==="careerTabLI") ? "cur-tab blue" : "blue",
      ]
    })
  }

  // main render
  render(): ReactElement{
    const { 
      tabClasses,
      curTab
    } = this.state
    return (
      <div>
        <div style={{display:"inline-flex", width:"95%"}}>
          <nav style={{width:"100%"}} className="tabs">
            <ul className="tabs-menu" style={{display:"inline-flex", width:"100%"}}>
              <li id="adminTabLI" className={tabClasses[0]} onClick={this.handleMenuClick}><a href="/#">Admin/Msn Planning</a></li>
              <li id="tinkerTabLI" className={tabClasses[1]} onClick={this.handleMenuClick}><a href="/#">Tinker AFB</a></li>
              <li id="careerTabLI" className={tabClasses[2]} onClick={this.handleMenuClick}><a href="/#">Air Force</a></li>
            </ul>
          </nav>
        </div>
        {curTab==="adminTabLI" && 
          <nav id="adminTab" className="links red">
            <ul>
              <li><a href="https://tk-webapp-s.tinker.af.mil/epex/Login.asp?server=sql2k5clstv-prd&database=pex58awacs" target="_blank" rel="noopener noreferrer">PEX</a>
                  <a href="https://cs2.eis.af.mil/sites/11483/SitePagesR/Home.aspx" target="_blank" rel="noopener noreferrer">OGV SharePoint</a>
                  <a href="https://cs2.eis.af.mil/sites/11483/FCIF/default.aspx" target="_blank" rel="noopener noreferrer">FCIF Library</a></li>
              <li><a href="#link3">Weather</a><a href="#link5">Tinker Weather</a></li>
              <li><a href="https://wwwmil.nellis.af.mil/units/usafws/" target="_blank" rel="noopener noreferrer">USAFWS Papers (.mil)</a></li>
            </ul>
          </nav> }
        {curTab==="tinkerTabLI" && 
          <nav id="tinkerTab" className="links green">
            <ul>
              <li><a href="#link1">Tinker AFB Home</a></li>
              <li><a href="/common/basemap.html">Base Map</a></li>
              <li><a href="https://org2.eis.af.mil/sites/21232/SitePages/Home.aspx" target="_blank" rel="noopener noreferrer">552 ACW Sharepoint</a></li>
              <li><a href="#link4">Military OneSource</a></li>
              <li><a href="#link4">Tinker Services</a></li>
            </ul>
        </nav> }
        { curTab==="careerTabLI" && 
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