import { Braaseye, AltStack, Group } from '../interfaces'

import { getBR } from '../../utils/mathutilities'

type RangeBack = {
  label: string,
  range: number
}

export function formatAlt(alt: number): string{
    const altF = (alt*10).toString().substring(0,3);
    return altF.length < 3 ? "0" + altF : altF;
}

export function formatGroup(
    label: string,
    braaseye: Braaseye,
    altitudes: AltStack,
    numContacts: number,
    anchor:boolean,
    trackDir: string|undefined,
    rangeBack?: RangeBack): string {
    let answer = label + " GROUP ";
  
    if (rangeBack !== null && rangeBack !== undefined) {
      answer += rangeBack.label + " " + rangeBack.range + " ";
    }
  
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