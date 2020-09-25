import React from 'react';
import NavMenuItem from './navmenuitem.js'

import '../css/styles.css';
import '../css/fonts.css';
import '../css/sidebar.css';
import '../css/spoiler.css';
import '../css/chips.css';

let fdMenuItems = [
    { name: "Company", link:"/" },
    { name: "Careers", link: "/" },
    { name: "Team", link: "/" }
];

let mcMenuItems = [
    { name: "Airspaces", link: "/msncrew/airspaces.html" },
    { name: "Fighter Units", link: "/msncrew/fighterunits.html"},
    { name: "LOAs", link: "/msncrew/loas.html" },
    { name: "AR Tracks", link: "/common/artracks.html" },
    { name: "E-3 Orbits", link: "/common/orbits.html" },
    { name: "Debrief", link: "/common/debrief.html" }
]

class SideBar extends React.PureComponent {
    render(){
      return (
        <div className="navbar">
            <NavMenuItem title="Flight Deck" menuitems={fdMenuItems} />
            <NavMenuItem title="Mission Crew" menuitems={mcMenuItems} />
            <NavMenuItem title="Lessons Learned" navFunc={()=>{window.location.href="/msncrew/lessons.html"}} />
            <NavMenuItem title="Links & Resources" navFunc={()=>{window.location.href="/resources.html"}} />
            <NavMenuItem title="Contact" navFunc={()=>{window.location.href="/contact.html"}} />
      </div>  
    )}
  }
  
export default SideBar;
  