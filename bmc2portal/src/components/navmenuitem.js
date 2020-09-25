import React from 'react';

import '../css/styles.css';
import '../css/fonts.css';
import '../css/sidebar.css';
import '../css/spoiler.css';
import '../css/chips.css';

class NavMenuItem extends React.PureComponent {

  render(){
    let navFunc = this.props.navFunc;
    if (navFunc===undefined){
        navFunc = ()=>{};
    }
    this.elems = [];
    return (
      <div className="subnav">
        <button className="subnavbtn" onClick={navFunc}>{this.props.title}</button>
        {this.props.menuitems && 
            <div className="subnav-content">
                {this.props.menuitems.forEach((itm) => {
                    this.elems.push(<div key={itm.name}><a href={itm.link}>{itm.name}</a></div>)
                })}
                {this.elems}
            </div>
        }
      </div>
    )}
}

export default NavMenuItem