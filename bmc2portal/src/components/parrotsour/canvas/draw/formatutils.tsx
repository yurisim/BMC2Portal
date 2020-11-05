import { Braaseye, AltStack, Group } from '../interfaces'

import { getBR } from '../../utils/mathutilities'

export function formatAlt(alt: number): string{
    var altF = (alt*10).toString().substring(0,3);
    return altF.length < 3 ? "0" + altF : altF;
}

// export function formatGroup( grp: Group, anchor: boolean): string{
//   var answer = (grp.label)?grp.label+"":""
//   if (anchor || false) {
//     answer += " BULLSEYE " + grp.braaseye.bull.bearing + "/" + grp.braaseye.bull.range + ", ";
//   }

//   answer += grp.altitudes.stack
//   answer += (grp.trackDir !== undefined) ? (grp.trackDir === "CAP" ? " " : " TRACK ") + grp.trackDir  : "";
//   answer += " HOSTILE ";

//   if (grp.numContacts > 1) {
//     answer += (grp.numContacts >= 3 ? "HEAVY " : "") + grp.numContacts + " CONTACTS";
//   }

//   answer += " " + grp.altitudes.fillIns;
//   return answer;
// }

export function formatGroup(
    label: string,
    braaseye: Braaseye,
    altitudes: AltStack,
    numContacts: number,
    anchor:boolean,
    // rangeBack: number|null,
    trackDir: string|undefined): string {
    var answer = label + " GROUP ";
  
    // if (rangeBack !== null) {
    //   answer += rangeBack.label + " " + rangeBack.range + " ";
    // }
  
    if (anchor || false) {
      answer += " BULLSEYE " + braaseye.bull.bearing + "/" + braaseye.bull.range + ", ";
    }
  
    answer += altitudes.stack
    answer += (trackDir !== undefined) ? (trackDir === "CAP" ? " " : " TRACK ") + trackDir  : "";
    answer += " HOSTILE ";
  
    if (numContacts > 1) {
      answer += (numContacts >= 3 ? "HEAVY " : "") + numContacts + " CONTACTS";
    }
  
    answer += " " + altitudes.fillIns;
    return answer;
}

export function getGroupOpenClose( fg: Group, sg: Group ): string{  
    var b1 = getBR(fg.x, fg.y, {x:sg.x, y:sg.y}).range
    var b2 = getBR(fg.startX, fg.startY, {x:sg.x, y:sg.y}).range
  
    var b3 = getBR(sg.x, sg.y, {x:fg.x, y: fg.y}).range
    var b4 = getBR(sg.startX, sg.startY, {x:fg.x, y:fg.y}).range
  
    if (b1 <= b2 && b3 <= b4){
      return "CLOSING";
    } 
    if (b2 <= b1 && b4 <= b3){
      return "OPENING";
    }
    return "";
}