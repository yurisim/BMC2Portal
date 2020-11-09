import React, { ReactElement } from 'react';

import '../../css/sidebar.css';
import { Hyperlink } from '../utils/interfaces';

interface NMIProps{
  link?: string,
  text: string,
  menuItems?: Hyperlink[]
}

/**
 * This Component contains the logic for Navigation Pane menus and menu items.
 * 
 * A NavMenuItem has props:
 * - "text": the text of the top-level menu item
 * - "link": (optional) which 'page' the top-level menu item takes you to
 * - "menuitems": (optional) An array of submenuitems { text, link }
 */
export default class NavMenuItem extends React.Component<NMIProps, Record<string, unknown>> {

  
  // If this menu item has a link, navigate to that link when it is clicked
  navigate = () => {
    if (this.props.link){
      window.location.href = this.props.link;
    }
  }

  // main component render
  render(){
    let elems:ReactElement[]= [];
    return (
      <div className="subnav">
        <button className="subnavbtn" onClick={this.navigate}>{this.props.text}</button>
        {this.props.menuItems && 
            <div className="subnav-content">
                {this.props.menuItems.forEach((itm:Hyperlink) => {
                    elems.push(<div key={itm.text}><a href={itm.link}>{itm.text}</a></div>)
                })}
                {elems}
            </div>
        }
      </div>
    )}
}