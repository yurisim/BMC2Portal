import { toRadians, randomNumber, getBR } from '../../utils/mathutilities'

import { BRAA, Braaseye, Bullseye, Group } from '../interfaces'
import { formatAlt } from './formatutils';

function clamp(canvas: HTMLCanvasElement, pos: Bullseye): Bullseye {
  if (pos === null){
      return {
          x:0, y:0
      }
  }
  return {
      x: Math.min(Math.max(pos.x, 0), canvas.width),
      y: Math.min(Math.max(pos.y, 0), canvas.height)}
}

export function drawLine (
  ctx:CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number, 
  color="black"): void {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.stroke();
}

export function drawText(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 12,
  color = "black"): void {
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.font = size + "px Arial";
  const pos = clamp(canvas, {x,y})
  
  ctx.fillText(text, pos.x, pos.y);
}

export function drawAltitudes(
    canvas: HTMLCanvasElement,
    ctx:CanvasRenderingContext2D,
    startX: number,
    startY: number,
    alts: number[]): void {
    const formattedAlts: string[] = alts.map((a:number) => {return formatAlt(a)})
    drawText(canvas, ctx, formattedAlts.join(","), startX, startY, 11, "#ff8c00");
}
  
export function drawBR(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D, 
    startX: number,
    startY: number,
    bull: BRAA,
    color: string,
    showMeasurements: boolean): void {
    if (showMeasurements) {
      drawText(canvas, ctx, bull.bearing + "/" + bull.range, startX, startY, 11, color);
    }
}

export function drawBraaseye(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    bluePos: Group,
    redPos: Bullseye,
    bullseye: Bullseye,
    showMeasurements: boolean,
    braaFirst: boolean,
    offsetX = 0, offsetY = 0): Braaseye{
    
    const bulls: BRAA = getBR(redPos.x, redPos.y, bullseye);
    const braa: BRAA = getBR(redPos.x, redPos.y, {x:bluePos.x, y:bluePos.y});

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
    showMeasurements:boolean): void {
    if (showMeasurements) {
      drawLine(ctx, startX, startY, endX, endY);
      drawText(canvas, ctx, Math.floor(distance / 4).toString(), (startX + endX) / 2, (startY + endY) / 2 - 3);
    }
}

function headingToDeg(heading: number){
  let deg: number = 360 - (heading - 90);
  if (heading < 90) {
    deg = 90 - heading;
  }

  let offsetVector = deg-90
  if (offsetVector < 0){
    offsetVector = 360 + offsetVector
  }

  let arrowHead = deg - 150
  if (arrowHead < 0)
    arrowHead = 360 + arrowHead

  return {
    degrees: deg,
    offset: offsetVector,
    headAngle: arrowHead
  }

}

export function drawArrow(
    canvas: HTMLCanvasElement,
    orientation: string,
    numContacts:number,
    startx:number,
    starty:number,
    heading: number,
    color = "red",
    type="ftr" ): Group {

    const c = canvas.getContext("2d");

    let group: Group = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        heading: heading,
        desiredHeading: orientation==="EW" ? 360 : 90,
        z: [0],
        numContacts: 1,
        type:type
    }

    if (c === null) return group

    c.lineWidth = 1;
    c.fillStyle = color;

    let endx = 0
    let endy = 0

    for (let x = 0; x < numContacts; x++){

      const vectors = headingToDeg(heading)

      const rads:number = toRadians(vectors.degrees)
      const offsetRads: number = toRadians(vectors.offset)
      const headRads: number = toRadians(vectors.headAngle)

      startx = startx + 5*(Math.cos(offsetRads))
      starty = starty + 5*(-Math.sin(offsetRads))

      const dist:number = canvas.width / (canvas.width / 20);
  
      endy = starty + dist * -Math.sin(rads);
      endx = startx +  dist * Math.cos(rads);

      c.beginPath()  
      c.moveTo(startx, starty);
      c.lineTo(endx, endy);

      const heady:number = endy + 7 * -Math.sin(headRads)
      const headx:number = endx + 7 * Math.cos(headRads)
  
      c.lineTo(headx, heady);
  
      c.strokeStyle = color;
      c.stroke();
      c.stroke();
    }
  
    let low = 15;
    let hi = 45;
    if (type==="rpa"){
        low = 0o5;
        hi = 18;
    }
    
    // eslint-disable-next-line
    const alts: number[] = [...Array(numContacts)].map(_=>randomNumber(low,hi));

    group = {
        startX: startx,
        startY: starty,
        x: Math.floor(endx),
        y: Math.floor(endy),
        heading,
        desiredHeading: orientation==="EW" ? 360 : 90,
        z: alts,
        numContacts: numContacts,
        type:type
    };

    return group;
}

export function drawGroupCap(
  canvas: HTMLCanvasElement,
  orientation: string,
  contacts: number,
  startX:number,
  startY:number, 
  color?:string): Group{

  const c = canvas.getContext("2d");
  if (!c) { return {x:0, y:0, startX:0, startY:0, heading:0, desiredHeading:0, z:[], numContacts:1, type:"ftr"}}

  color = color || "red";

  // eslint-disable-next-line
  let alts:number[] = [...Array(contacts)].map(_=>randomNumber(15,45));

  c.lineWidth = 1;
  c.fillStyle = color;
  c.strokeStyle=color;

  c.beginPath();

  let radius = 10;
  if (contacts === 1 ){
    c.arc(startX, startY, 10, 1.0*Math.PI, 0.8*Math.PI);
    c.stroke();
    drawLine(c, startX-8, startY+6, startX-6, startY+12, "red");
  } else{
    const ratio = 2/contacts - 0.1; 
    let startPI = 0;
    let endPI = ratio
    radius = 12;
    for (let x = 1 ; x<= contacts; x++){
      c.arc(startX,startY, radius, startPI*Math.PI, endPI*Math.PI);
      c.stroke();

      const opp:number = radius * Math.sin(endPI*Math.PI);
      const adj:number = radius * Math.cos(endPI*Math.PI);
    
      const endy = startY + opp;
      const endx = startX + adj;
    
      c.beginPath();
      c.moveTo(startX+(adj*0.6), startY+(opp*0.9));
      c.lineTo(endx, endy);
      c.stroke();
      c.beginPath();

      startPI = (endPI+0.1);
      endPI = startPI+ratio;
    }
  }

  const angle = (orientation==="EW") ? 270 : 0;
  const sY: number = startY + radius * Math.sin(toRadians(angle));
  const sX: number = startX + radius * Math.cos(toRadians(angle));
  const group = {
    capping: true,
    startX: sX,
    startY: sY,
    x: Math.floor(sX),
    y: Math.floor(sY),
    heading: randomNumber(0,360),
    desiredHeading: 90,
    z: alts,
    numContacts: contacts,
    type:"ftr"
  };

  return group;
}
