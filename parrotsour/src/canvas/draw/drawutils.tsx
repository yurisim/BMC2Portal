/**
 * This file contains common low-level drawing utilities used
 * to build groups and pictures.
 */

import { toRadians, randomNumber, getBR } from '../../utils/mathutilities'

import { BRAA, Braaseye, Bullseye, Group } from '../../utils/interfaces'
import { formatAlt } from './formatutils';

/**
 * 'Clamp' the location to the confines of the Canvas
 * @param canvas The canvas to constrict it to
 * @param pos the current position
 */
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

/**
 * Draw a line on the canvas, given the properties
 * @param ctx Context to draw on
 * @param startX start x of the line
 * @param startY start y of the line
 * @param endX end x of the line
 * @param endY end y of the line
 * @param color (optional) color of the line, defaults to black
 */
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

/**
 * Draw text to the canvas at the given position
 * @param canvas The canvas to draw on
 * @param ctx The context to draw on
 * @param text Text to draw
 * @param x X Position to draw at
 * @param y Y Position to draw at
 * @param size (optional) Size of the text to draw, defaults 12
 * @param color (optional) Color of the text, defaults to black
 */
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

/**
 * Draw group altitudes on the canvas
 * @param canvas The canvas to draw on
 * @param ctx The context to draw on
 * @param startX x position to draw at
 * @param startY y position to draw at
 * @param alts the altitudes to draw
 */
export function drawAltitudes(
    canvas: HTMLCanvasElement,
    ctx:CanvasRenderingContext2D,
    startX: number,
    startY: number,
    alts: number[]): void {
    const formattedAlts: string[] = alts.map((a:number) => {return formatAlt(a)})
    drawText(canvas, ctx, formattedAlts.join(","), startX, startY, 11, "#ff8c00");
}
  
/**
 * Draw a bearing and range to the canvas
 * @param canvas Canvas to draw on
 * @param ctx Context to draw on
 * @param startX X position to draw at
 * @param startY Y position to draw at
 * @param bull the braa to draw
 * @param color color of the BRAA text
 * @param showMeasurements boolean to toggle if BRAA is shown
 */
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

/**
 * Draw BRAASEYE between red and blue
 * @param canvas Canvas to draw on
 * @param ctx Context to draw on
 * @param bluePos Position of blue air
 * @param redPos Position of red air
 * @param bullseye The picture's bullseye
 * @param showMeasurements true iff braaseye should be drawn on canvas
 * @param braaFirst true iff BRAA is displayed first, false to draw bullseye first
 * @param offsetX X position to draw at
 * @param offsetY Y position to draw at
 */
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

/**
 * Draw a measurement (distance with a length number)
 * @param canvas Canvas to draw on
 * @param ctx Context to draw on
 * @param startX X position to start for line
 * @param startY Y position to start for line
 * @param endX X position to end for line
 * @param endY Y position to end for line
 * @param distance Distance of the measurement
 * @param showMeasurements true iff measurement should be drawn/shown
 */
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
      drawText(canvas, ctx, Math.floor(distance).toString(), (startX + endX) / 2, (startY + endY) / 2 - 3);
    }
}

/**
 * Convert a aeronautical heading to Cartesian degrees
 * @param heading Heading to convert to degrees
 */
export function headingToDeg(heading: number):
 {degrees:number, offset:number, headAngle:number}
{
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

/**
 * Draw arrows for a group
 * @param canvas Canvas to draw on
 * @param orientation Orientation of the canvas
 * @param numContacts Number of contacts in the group
 * @param startx Start X position for the group
 * @param starty Start Y position for the group
 * @param heading Heading of the group
 * @param color (optional) Color of the arrow lines, default red
 * @param type (optional) Type of aircraft, default "ftr" (fighter)
 */
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

    const iStartX = startx
    const iStartY = starty
    for (let x = 0; x < numContacts; x++){

      const vectors = headingToDeg(heading)

      const rads:number = toRadians(vectors.degrees)
      const offsetRads: number = toRadians(vectors.offset)
      const headRads: number = toRadians(vectors.headAngle)

      startx = startx + 5*(Math.cos(offsetRads))
      starty = starty + 5*(-Math.sin(offsetRads))

      const dist:number = canvas.width / (canvas.width / 20);
  
      endy = starty + dist * -Math.sin(rads);
      endx = startx + dist * Math.cos(rads);

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
        startX: iStartX,
        startY: iStartY,
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

/**
 * Draw a capping group's arrows
 * @param canvas Canvas to draw on
 * @param orientation Orientation of the canvas
 * @param contacts Number of contacts in the CAP
 * @param startX X starting position
 * @param startY Y starting position
 * @param color (optional) color for the CAP, defaults to red
 */
export function drawGroupCap(
  canvas: HTMLCanvasElement,
  orientation: string,
  contacts: number,
  startX:number,
  startY:number, 
  color = "red"): Group{

  const c = canvas.getContext("2d");
  if (!c) { return {x:0, y:0, startX:0, startY:0, heading:0, desiredHeading:0, z:[], numContacts:1, type:"ftr"}}

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