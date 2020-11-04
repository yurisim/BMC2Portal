import { toRadians, randomNumber, getBR } from '../utils/mathutilities'

import { AltStack, BRAA, Braaseye, Bullseye, Group } from './interfaces'

function formatAlt(alt: number){
    var altF = (alt*10).toString().substring(0,3);
    return altF.length < 3 ? "0" + altF : altF;
}

export function formatGroup(
    label: string,
    braaseye: Braaseye,
    altitudes: AltStack,
    numContacts: number,
    anchor:boolean,
    // rangeBack: number|null,
    trackDir: string|undefined) {
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

export function getGroupOpenClose( fg: Group, sg: Group ){  
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

export function drawAltitudes(
    canvas: HTMLCanvasElement,
    ctx:CanvasRenderingContext2D,
    startX: number,
    startY: number,
    alts: number[]) {
    var formattedAlts: string[] = alts.map((a:number) => {return formatAlt(a)})
    drawText(canvas, ctx, formattedAlts.join(","), startX, startY, 11, "#ff8c00");
}
  
export function drawBR(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D, 
    startX: number,
    startY: number,
    bull: BRAA,
    color: string,
    showMeasurements: boolean) {
    if (showMeasurements) {
      drawText(canvas, ctx, bull.bearing + "/" + bull.range, startX, startY, 11, color);
    }
}

export function drawBraaseye(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    bluePos: Bullseye,
    redPos: Bullseye,
    bullseye: Bullseye,
    showMeasurements: boolean,
    braaFirst: boolean,
    offsetX: number = 0, offsetY = 0) {
    
    var bulls: BRAA = getBR(redPos.x, redPos.y, bullseye);
    var braa: BRAA = getBR(redPos.x, redPos.y, bluePos);

    if (braaFirst){
      drawBR(canvas, ctx, redPos.x + 20 + offsetX, redPos.y + offsetY, braa, "blue", showMeasurements);
      drawBR(canvas, ctx, redPos.x + 20 + offsetX, redPos.y + 11 + offsetY, bulls, "black", showMeasurements);
    } else {
      drawBR(canvas, ctx, redPos.x + 20 + offsetX, redPos.y + offsetY, bulls, "black", showMeasurements);
      drawBR(canvas, ctx, redPos.x + 20 + offsetX, redPos.y + 11 + offsetY, braa, "blue", showMeasurements);
    }
  
    return {
      bull: bulls,
      braa: braa
    };
}

export function drawMeasurement(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D, 
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    distance: number,
    showMeasurements:boolean) {
    if (showMeasurements) {
      drawLine(ctx, startX, startY, endX, endY);
      drawText(canvas, ctx, Math.floor(distance / 4).toString(), (startX + endX) / 2, (startY + endY) / 2 - 3);
    }
}

export function drawLine (
    ctx:CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number, 
    color="black") {
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.stroke();
}

function clamp(canvas: HTMLCanvasElement, pos: Bullseye) {
    if (pos === null){
        return {
            x:0, y:0
        }
    }
    return {
        x: Math.min(Math.max(pos.x, 0), canvas.width),
        y: Math.min(Math.max(pos.y, 0), canvas.height)}
}

export function drawText(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    size = 12,
    color = "black") {
    ctx.lineWidth = 1;
    ctx.fillStyle = color;
    ctx.font = size + "px Arial";
    var pos = clamp(canvas, {x,y})
    
    ctx.fillText(text, pos.x, pos.y);
}

export function drawArrow(
    canvas: HTMLCanvasElement,
    numContacts:number,
    startx:number,
    starty:number,
    direction: number,
    orientation: string,
    color = "red",
    type="ftr" ) {

    var c = canvas.getContext("2d");

    var group: Group = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        heading: direction,
        desiredHeading: orientation==="EW" ? 360 : 90,
        z: [0],
        numContacts: 1,
        type:type
    }

    if (c !== null){
  
        if (numContacts > 1) {
        for (var x = 1; x < numContacts; x++) {
            var offset:number = 0;
            var offsety:number = 0;
    
            var xMultip:number = canvas.width / (canvas.width / 3);
            var yMultip:number = canvas.width / (canvas.height / 2);
    
            if ((direction >= 0 && direction < 90) || direction === 360) {
            offset = xMultip * x;
            offsety = yMultip * x;
            }
            if (direction >= 90 && direction < 121) {
            offset = xMultip * x;
            offsety = -xMultip * x;
            }
    
            if (direction >= 121 && direction < 240) {
            offset = xMultip * x;
            offsety = -x;
            }
    
            if (direction >= 240 && direction < 330) {
            offset = 0;
            offsety = -xMultip * x;
            }
    
            if (direction >= 330 && direction < 360) {
            offset = -x;
            offsety = xMultip * x;
            }
    
            if (direction === 90 || direction === 270) {
            offset = 0;
            }
    
            if (direction === 0 || direction === 180 || direction === 360) {
            offsety = 0;
            }
    
            drawArrow(canvas, 1, startx - offset, starty - offsety, direction, orientation, color, type);
        }
        }
    
        c.lineWidth = 1;
        c.fillStyle = color;
    
        c.beginPath();
        c.moveTo(startx, starty);
    
        var dist:number = canvas.width / (canvas.width / 20);
    
        var deg: number = 360 - (direction - 90);
        if (direction < 90) {
        deg = 90 - direction;
        } 
        var rads:number = toRadians(deg);
    
        var endy: number = starty + dist * -Math.sin(rads);
        var endx: number = startx +  dist * Math.cos(rads);
    
        c.moveTo(startx, starty);
        c.lineTo(endx, endy);
    
        var yOff: number = canvas.width / (canvas.width / 6);
        var xOff: number = canvas.width / (canvas.width / 4)
        if (direction <= 121 || direction >= 330) {
        xOff = -canvas.width / (canvas.width / 4);
        } 
        if (direction > 300) {
        xOff = canvas.width / (canvas.width / 8);
        yOff = -canvas.width / (canvas.width / 4);
        }
    
        c.lineTo(endx + xOff, endy - yOff);
    
        c.strokeStyle = color;
        c.stroke();
        c.stroke();
        
        var low = 15;
        var hi = 45;
        if (type==="rpa"){
            low = 0o5;
            hi = 18;
        }
        var alts: number[] = [...Array(numContacts)].map(_=>randomNumber(low,hi));
    
        group = {
            startX: startx,
            startY: starty,
            x: Math.floor(endx),
            y: Math.floor(endy),
            heading: direction,
            desiredHeading: orientation==="EW" ? 360 : 90,
            z: alts,
            numContacts: numContacts,
            type:type
        };
    }
    return group;
  }