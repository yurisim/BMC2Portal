import { getAltStack, getAspect, getBR, getTrackDir, randomNumber } from "../../../utils/mathutilities";
import { AltStack, BRAA, Bullseye, drawAnswer, DrawFunction, Group } from "../../interfaces";
import { PicCanvasProps, PicCanvasState } from "../../picturecanvas";
import { drawText } from "../drawutils";

export const drawEA:DrawFunction = (
        canvas: HTMLCanvasElement,
        ctx:CanvasRenderingContext2D,
        props: PicCanvasProps,
        state: PicCanvasState,
        start?: Bullseye):drawAnswer => {
    
    if (!state.bluePos) { return { pic: "", groups: []} }

    // if x and y can't be undefined.... then TODO - verify this
    if (start === undefined){
      start = {
         x: randomNumber(canvas.width * 0.6, canvas.width * 0.65),
         y: randomNumber(canvas.width * 0.2, canvas.height * 0.8)
      }
    } else if (start.x === undefined){
      start.x = randomNumber(canvas.width * 0.6, canvas.width * 0.65)
    }

    let finalAnswer:drawAnswer = {pic:"", groups:[]}
    //state.reDraw(canvas, ctx, true, start).then((answer:drawAnswer) =>{
    let answer = state.reDraw(canvas, ctx,true,start)
        if (!state.bluePos) { return { pic: "", groups: []} }
        let response = "RESPONSE";
     
        const grp:Group = answer.groups[randomNumber(0, answer.groups.length)];
        let altStack:AltStack= getAltStack(grp.z, props.format);
        let closestGrp:Group = answer.groups[0];

        let closestRng = 9999;
        let closestBraa:BRAA = {bearing:"000", range:0};
        let query:string  
        let aspectH:string
        let strBR: BRAA
        let aspect: string
        let bull: BRAA

        switch (randomNumber(0,3)) {
          case 0:
            drawText(canvas, ctx, '"EAGLE01, BOGEY DOPE NEAREST GRP"', canvas.width/2, 20);
            for (let x = 0; x < answer.groups.length; x++){
              const braa = getBR(answer.groups[x].x, answer.groups[x].y, state.bluePos)
              if(braa.range < closestRng){
                closestBraa = braa
                closestRng = braa.range
                closestGrp = answer.groups[x];
              }
            }
            altStack = getAltStack(closestGrp.z, props.format);
            aspectH = getAspect(state.bluePos,closestGrp);
            response = closestGrp.label + " BRAA " + closestBraa.bearing + "/" + closestBraa.range + 
               " " + altStack.stack + ", " + aspectH+ " " + (aspectH !== "HOT" ? getTrackDir(closestGrp.heading): "") +" HOSTILE ";
             if (closestGrp.numContacts > 1) {
              response += (closestGrp.numContacts >= 3 ? "HEAVY " : "") + closestGrp.numContacts + " CONTACTS ";
            }
            response += altStack.fillIns;
            break;
          case 1: 
            strBR = getBR(grp.x, grp.y, state.bluePos)
            query = strBR.bearing // TODO -- potential to add +/- offset
            if (randomNumber(1,100) <= 50 && grp.label !== undefined){
                query = grp.label
            }
            drawText(canvas, ctx, '"EAGLE01 STROBE ' + query + '"', canvas.width/2, 20)
            response = "EAGLE01 STROBE RANGE " + strBR.range + ", " + altStack.stack;
            aspect = getAspect(state.bluePos, grp);
            response += (aspect !=="HOT" ? aspect + " "+ getTrackDir(grp.heading) : aspect) + ", HOSTILE, " + grp.label;
            break;
          default: 
            drawText(canvas, ctx, '"EAGLE01 MUSIC ' + grp.label+ '"', canvas.width/2, 20)
            bull = getBR(grp.x, grp.y, state.bullseye)
            response = grp.label + " BULLSEYE " + bull.bearing +"/" + bull.range + ", " + altStack.stack;
            response += (props.format==="ALSA" ? (grp.isCapping ? " CAP " : ", TRACK " + getTrackDir(grp.heading)) :"");
            response += ", HOSTILE, ";
            response += ( altStack.fillIns ? altStack.fillIns: grp.numContacts+ " CONTACT(S)") + (grp.numContacts > 1 ? " LINE ABREAST THREE " : "") + altStack.fillIns;
            break;
        }
        finalAnswer= {
          pic: response,
          groups: answer.groups
        };
    // })
    return finalAnswer
 }