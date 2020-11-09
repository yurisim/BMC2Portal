/**
 * This file contains utilities for group and answer formatting
 */

import { Braaseye, AltStack, Group } from '../../../utils/interfaces'

import { getBR } from '../../utils/mathutilities'

type RangeBack = {
  label: string,
  range: number
}

/**
 * Convert an altitude to a 3-digit flight level
 * @param alt int altitude to change to padded string
 */
export function formatAlt(alt: number): string{
    const altF = (alt*10).toString().substring(0,3);
    return altF.length < 3 ? "0" + altF : altF;
}

/**
 * Return the string formatted answer for this group based on properties of the group
 * @param label The Group Label
 * @param braaseye BRAA from blue and bullseye
 * @param altitudes Altitudes for each contact in the group
 * @param numContacts Number of contacts in the group
 * @param anchor true iff group is anchoring priority
 * @param trackDir track direction of the group
 * @param rangeBack separation, if included
 */
export function formatGroup(
    label: string,
    braaseye: Braaseye,
    altitudes: AltStack,
    numContacts: number,
    anchor:boolean,
    trackDir: string|undefined,
    rangeBack?: RangeBack): string {
    
    // format label
    let answer = label + " GROUP ";

    // format separation
    if (rangeBack !== null && rangeBack !== undefined) {
      answer += rangeBack.label + " " + rangeBack.range + " ";
    }
  
    // format bullseye if anchor priority
    if (anchor || false) {
      answer += " BULLSEYE " + braaseye.bull.bearing + "/" + braaseye.bull.range + ", ";
    }
  
    // format altitude stack
    answer += altitudes.stack

    // format track direction (if given)
    answer += (trackDir !== undefined) ? (trackDir === "CAP" ? " " : " TRACK ") + trackDir  : "";
    
    // apply ID
    answer += " HOSTILE ";
  
    // apply fill-in for # contacts
    if (numContacts > 1) {
      answer += (numContacts >= 3 ? "HEAVY " : "") + numContacts + " CONTACTS";
    }
  
    // apply fill-ins (HI/FAST/etc)
    answer += " " + altitudes.fillIns;
    return answer;
}

/**
 * Check if picture is opening or closing
 * @param fg First group of picture
 * @param sg Second group of picture
 */
export function getGroupOpenClose( fg: Group, sg: Group ): string{  
    const b1 = getBR(fg.x, fg.y, {x:sg.x, y:sg.y}).range
    const b2 = getBR(fg.startX, fg.startY, {x:sg.x, y:sg.y}).range
  
    const b3 = getBR(sg.x, sg.y, {x:fg.x, y: fg.y}).range
    const b4 = getBR(sg.startX, sg.startY, {x:fg.x, y:fg.y}).range
  
    if (b1 <= b2 && b3 <= b4){
      return "CLOSING";
    } 
    if (b2 <= b1 && b4 <= b3){
      return "OPENING";
    }
    return "";
}