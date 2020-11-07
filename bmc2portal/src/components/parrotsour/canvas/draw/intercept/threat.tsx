import { getAltStack, getAspect, getBR, getTrackDir, randomHeading, randomNumber } from "../../../utils/mathutilities";
import { AltStack, BRAA, Bullseye, DrawFunction, Group } from "../../interfaces";
import { PicCanvasProps, PicCanvasState } from "../../picturecanvas";
import { drawAltitudes, drawArrow, drawBraaseye } from "../drawutils";


export const drawThreat:DrawFunction = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?: Bullseye|undefined ) => {
    
    if (!state.bluePos) { return { pic: "", groups: []} }

    var offsetDeg1:number = randomNumber(-10, 10);

    if (start === undefined){
        start = {
            x: randomNumber(state.bluePos.x-100, state.bluePos.x-40),
            y: randomNumber(state.bluePos.y-100, state.bluePos.y+40)
        }
    }
    if (start && start.y === undefined){
        start.y = randomNumber(state.bluePos.y-100, state.bluePos.y+40);
    }
    if (start && start.x === undefined) {
        start.x = randomNumber(state.bluePos.x-100, state.bluePos.x-40);
    }

    var heading:number = randomHeading(props.format);

    var sg:Group = drawArrow(canvas, props.orientation, randomNumber(1, 4), start.x, start.y, heading + offsetDeg1);

    drawAltitudes(canvas, context, sg.x + 10, sg.y - 11, sg.z);

    var sgAlts: AltStack = getAltStack(sg.z, props.format);

    drawBraaseye(
        canvas, 
        context,
        state.bluePos,
        { x: sg.x, y: sg.y },
        state.bullseye,
        props.showMeasurements,
        props.braaFirst
    );

    var br:BRAA = getBR(sg.x, sg.y, {
          x: state.bluePos.x,
          y: state.bluePos.y
        });
    var closest:BRAA = br;
    var closestGrp:Group = sg;

    var aspectH = getAspect(state.bluePos, sg);
    var trackDir = getTrackDir(sg.heading);

    var answer:string = "THREAT BRAA " + closest.bearing + "/" + closest.range + " " + sgAlts.stack + " " + aspectH + " " + (aspectH !== "HOT" ? trackDir : "") + " HOSTILE "

    if (closestGrp.numContacts > 1) {
        answer += (closestGrp.numContacts >= 3 ? "HEAVY " : "") + closestGrp.numContacts + " CONTACTS ";
    }

    answer += sgAlts.fillIns;
  
    var groups = [];
    sg.label = "SINGLE GROUP";
    groups.push(sg);

    return {
        pic: answer,
        groups: groups
    };  
}