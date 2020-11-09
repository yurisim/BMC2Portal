import { getAltStack, getTrackDir, randomHeading, randomNumber } from "../../../utils/mathutilities";
import { AltStack, Braaseye, Bullseye, DrawAnswer, DrawFunction, Group } from "../../interfaces";
import { PicCanvasProps, PicCanvasState } from "../../picturecanvas";
import { drawAltitudes, drawArrow, drawBraaseye, drawGroupCap, drawMeasurement } from "../drawutils";
import { formatGroup } from "../formatutils";


export const drawCap:DrawFunction = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?: Bullseye|undefined ): DrawAnswer => {
    
    if (!state.bluePos) { return { pic: "", groups: []} }

    const offsetDeg1: number = randomNumber(-10, 10);
    const offsetDeg2: number = randomNumber(-10, 10);
    
    let startY:number|undefined = start && start.y;
    let startX:number|undefined = start && start.x;

    if (startY === undefined){
        startY = randomNumber(canvas.height / 20, canvas.height * 0.7);
    }
    if (startX === undefined) {
        startX = randomNumber(canvas.width / 20, canvas.width * 0.5);
    }
    
    const incr:number = canvas.width / (canvas.width / 10);

    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;

    if (props.orientation==="NS"){
        distanceX = randomNumber(2.5 * incr, 10 * incr);
        distance = distanceX;
    } else {
        distanceY = randomNumber(2.5 * incr, 10 * incr);
        distance = distanceY;
    }
    
    const heading1: number = randomHeading(props.format, state.bluePos.heading);
    const heading2: number = randomHeading(props.format, state.bluePos.heading);
    
    const nNumContacts:number = randomNumber(1, 4);
    const sNumContacts:number = randomNumber(1, 4);

    const whichCap: number = randomNumber(0,100);

    let ngCap = false;
    let sgCap = false;

    if (whichCap < 33){
        ngCap = true;
    } else if (whichCap < 66) {
        sgCap = true;
    } else {
        ngCap = true;
        sgCap = true;
    }
    
    let ntrackDir: string = getTrackDir(heading1);
    let strackDir: string = getTrackDir(heading2);

    let ng: Group, sg: Group
    if (ngCap){
        ntrackDir = "CAP";
        ng = drawGroupCap (canvas, props.orientation, nNumContacts, startX, startY);
    } else {
        ng = drawArrow(canvas, props.orientation, nNumContacts, startX, startY, heading1 + offsetDeg1);
    }
    if (sgCap){
        strackDir = "CAP";
        sg = drawGroupCap (canvas, props.orientation, sNumContacts, startX + distanceX, startY + distanceY);
    } else {
        sg = drawArrow(canvas, props.orientation, sNumContacts, startX + distanceX, startY + distanceY, heading2 + offsetDeg2);
    }
    
    if (props.orientation==="NS"){
        drawMeasurement(canvas, context, ng.x +2, ng.y, sg.x+2, ng.y, distance, props.showMeasurements);
    } else {
        drawMeasurement(canvas, context, ng.x, ng.y + 2, ng.x, sg.y + 2, distance, props.showMeasurements);
    }
    
    const width:number = Math.floor(distance / 4);
    
    let offsetX = 0;
    if (props.orientation==="NS"){
        offsetX = -70;
    }
    
    drawAltitudes(canvas, context, ng.x + offsetX + 20, ng.y - 11, ng.z);
    drawAltitudes(canvas, context, sg.x + 20, sg.y - 11, sg.z);
    
    
    const ngBraaseye: Braaseye = drawBraaseye(canvas, context, state.bluePos, ng, state.bullseye, props.showMeasurements, props.braaFirst, offsetX);
    const sgBraaseye: Braaseye = drawBraaseye(canvas, context, state.bluePos, sg, state.bullseye, props.showMeasurements, props.braaFirst);
    
    const ngAlts: AltStack = getAltStack(ng.z, props.format);
    const sgAlts: AltStack = getAltStack(sg.z, props.format);

    let answer = "";
    
    let includeBull = false;
    if (width >= 10 && props.format !== "ipe") {
        includeBull = true;
    }
    answer =
        "TWO GROUPS AZIMUTH " +
        width +
        ", ";

    let nLbl = "NORTH";
    let sLbl = "SOUTH";
    if (props.orientation==="NS"){
        nLbl = "WEST";
        sLbl = "EAST";
    }
    // TODO -- assess anchoring P's 
    if (ngBraaseye.braa.range < sgBraaseye.braa.range) {
        answer += formatGroup(nLbl, ngBraaseye, ngAlts, nNumContacts, true, ntrackDir);
        answer +=
        " " + formatGroup(sLbl, sgBraaseye, sgAlts, sNumContacts, includeBull, strackDir);
    } else {
        answer += formatGroup(sLbl, sgBraaseye, sgAlts, sNumContacts, true, strackDir);
        answer +=
        " " + formatGroup(nLbl, ngBraaseye, ngAlts, nNumContacts, includeBull, ntrackDir);
    }
    
    const groups = [];
    
    ng.label = nLbl + " GROUP";
    sg.label = sLbl +" GROUP";
    groups.push(ng);
    groups.push(sg);
    
    return {
        pic: answer,
        groups: groups
    };
}
