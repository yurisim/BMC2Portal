import React, { ReactElement } from "react";
import NavMenuItem from "./navmenuitem.js";

import "../../css/sidebar.css";
import { Hyperlink } from "../utils/interfaces.js";

let fdMenuItems:Hyperlink[] = [
  { text: "First Link", link: "/" },
  { text: "Second Link", link: "/" },
  { text: "AR Tracks", link: "/common/artracks.html"},
  { text: "E-3 Orbits", link: "/common/orbits.html"},
  { text: "Debrief", link: "/common/debrief.html" },
];

let mcMenuItems:Hyperlink[] = [
  { text: "ParrotSour", link: "/msncrew/parrotsour.html" },
  { text: "Airspaces", link: "/msncrew/airspacelist.html" },
  { text: "Fighter Units", link: "/msncrew/unitlist.html" },
  { text: "LOAs", link: "/msncrew/loalist.html" },
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
export default class SideBar extends React.PureComponent {
  render(): ReactElement {
    return (
      <div className="navbar">
        <NavMenuItem text="Flight Deck" menuItems={fdMenuItems} />
        <NavMenuItem text="Mission Crew" menuItems={mcMenuItems} />
        <NavMenuItem text="Lessons Learned" link = "/common/lessons.html" />
        <NavMenuItem text="FAA Map" link="/common/faamap.html"/>
        <NavMenuItem text="Links & Resources" link = "/resources.html" />
        <NavMenuItem text="Contact" link = "/contact.html" />
      </div>
    );
  }
}
