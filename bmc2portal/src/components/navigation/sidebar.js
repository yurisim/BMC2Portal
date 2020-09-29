import React from "react";
import NavMenuItem from "./navmenuitem.js";

import "../../css/sidebar.css";

let fdMenuItems = [
  { text: "First Link", link: "/" },
  { text: "Second Link", link: "/" },
  { text: "AR Tracks", link: "/common/artracks.html"},
  { text: "E-3 Orbits", link: "/common/orbits.html"},
  { text: "Debrief", link: "/common/debrief.html" },
  { text: "Map", link: "/common/cesium.html" },
];

let mcMenuItems = [
  { text: "Airspaces", link: "/msncrew/airspacelist.html" },
  { text: "Fighter Units", link: "/msncrew/unitlist.html" },
  { text: "LOAs", link: "/msncrew/loalist.html" },
  { text: "AR Tracks", link: "/common/artracks.html" },
  { text: "E-3 Orbits", link: "/common/orbits.html" },
  { text: "Debrief", link: "/common/debrief.html" },
  { text: "Map", link: "/common/cesium.html" },
];

/**
 * This React Component provides the left hand navigation menu for the website.
 * 
 * To add a navigation item, add a <NavMenuItem> in the appropriate spot in this list.
 * 
 * See <NavMenuItem> for options.
 */
export default class SideBar extends React.PureComponent {
  render() {
    return (
      <div className="navbar">
        <NavMenuItem text="Flight Deck" menuitems={fdMenuItems} />
        <NavMenuItem text="Mission Crew" menuitems={mcMenuItems} />
        <NavMenuItem text="Lessons Learned" link = "/common/lessons.html" />
        <NavMenuItem text="FAA SUAs" link="/common/faamap.html"/>
        <NavMenuItem text="Links & Resources" link = "/resources.html" />
        <NavMenuItem text="Contact" link = "/contact.html" />
      </div>
    );
  }
}
