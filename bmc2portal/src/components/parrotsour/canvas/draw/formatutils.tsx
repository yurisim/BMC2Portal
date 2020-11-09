/**
 * This file contains utilities for group and answer formatting
 */

import { Braaseye, AltStack, Group, BRAA } from '../../../utils/interfaces'

import { getBR, getTrackDir } from '../../utils/mathutilities'

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
 * Return a group formatted for BRAA response
 * @param label group label
 * @param braa bearing/range from blue
 * @param altitudes altitude of group
 * @param numContacts num contacts in the group
 * @param heading heading of group
 * @param aspect Aspect between blue and red
 */
export function formatBRAA(
  label:string,
  braa:BRAA,
  altStack:AltStack,
  numContacts:number,
  heading:number,
  aspect: string): string{
    let response:string = label + " BRAA " + braa.bearing + "/" + braa.range + " "
    response +=  altStack.stack + ", " + aspect+ " " + (aspect !== "HOT" ? getTrackDir(heading): "") +" HOSTILE ";
    if (numContacts > 1) {
      response += (numContacts >= 3 ? "HEAVY " : "") + numContacts + " CONTACTS ";
    }
    response += altStack.fillIns;
    return response
}

/**
 * Format a strobe response
 * @param strBR BR from blue to red
 * @param altStack Alt stack of red group
 * @param heading Heading of red group
 * @param aspect Aspect between blue and red
 * @param label Red group label
 */
export function formatStrobe(
  strBR: BRAA,
  altStack:AltStack,
  heading:number,
  aspect:string,
  label:string): string {
  return "EAGLE01 STROBE RANGE " + strBR.range + ", " + altStack.stack
   + (aspect !=="HOT" ? aspect + " "+ getTrackDir(heading) : aspect) + ", HOSTILE, " + label;
}

/**
 * Format a music response to a given group
 * @param grp Group for music call
 * @param bull Bullseye of the picture
 * @param altStack Altitude stack information for red group
 * @param format Format of the picture
 */
export function formatMusic(grp:Group, bull:BRAA, altStack:AltStack, format:string):string{
  return grp.label + " BULLSEYE " + bull.bearing +"/" + bull.range + ", " + altStack.stack
    + (format==="ALSA" ? (grp.isCapping ? " CAP " : ", TRACK " + getTrackDir(grp.heading)) :"")
    + ", HOSTILE, "
    + ( altStack.fillIns ? altStack.fillIns: grp.numContacts+ " CONTACT(S)") + (grp.numContacts > 1 ? " LINE ABREAST THREE " : "") + altStack.fillIns
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