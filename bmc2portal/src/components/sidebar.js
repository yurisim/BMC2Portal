import React from "react";
import NavMenuItem from "./navmenuitem.js";

import "../css/sidebar.css";

let fdMenuItems = [
  { text: "Company", link: "/" },
  { text: "Careers", link: "/" },
  { text: "Team", link: "/" },
];

let mcMenuItems = [
  { text: "Airspaces", link: "/msncrew/airspaces.html" },
  { text: "Fighter Units", link: "/msncrew/fighterunits.html" },
  { text: "LOAs", link: "/msncrew/loas.html" },
  { text: "AR Tracks", link: "/common/artracks.html" },
  { text: "E-3 Orbits", link: "/common/orbits.html" },
  { text: "Debrief", link: "/common/debrief.html" },
];

/**
 * This React Component provides the left hand navigation menu for the website.
 * 
 * To add a navigation item, add a <NavMenuItem> in the appropriate spot in this list.
 * 
 * See <NavMenuItem> for options.
 */
class SideBar extends React.PureComponent {
  render() {
    return (
      <div className="navbar">
        <NavMenuItem text="Flight Deck" menuitems={fdMenuItems} />
        <NavMenuItem text="Mission Crew" menuitems={mcMenuItems} />
        <NavMenuItem text="Lessons Learned" link = "/msncrew/lessons.html" />
        <NavMenuItem text="Links & Resources" link = "/resources.html" />
        <NavMenuItem text="Contact" link = "/contact.html" />
      </div>
    );
  }
}

export default SideBar;
