import React from 'react';

import '../css/sidebar.css';

/**
 * This Component contains the logic for Navigation Pane menus and menu items.
 * 
 * A NavMenuItem has props:
 * - "text": the text of the top-level menu item
 * - "link": (optional) which 'page' the top-level menu item takes you to
 * - "menuitems": (optional) An array of submenuitems { text, link }
 */
class NavMenuItem extends React.Component {

  navigate = () => {
    if (this.props.link){
      window.location.href = this.props.link;
    }
  }

  render(){
    this.elems = [];
    return (
      <div className="subnav">
        <button className="subnavbtn" onClick={this.navigate}>{this.props.text}</button>
        {this.props.menuitems && 
            <div className="subnav-content">
                {this.props.menuitems.forEach((itm) => {
                    this.elems.push(<div key={itm.text}><a href={itm.link}>{itm.text}</a></div>)
                })}
                {this.elems}
            </div>
        }
      </div>
    )}
}

export default NavMenuItem