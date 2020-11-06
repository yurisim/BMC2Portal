import { AltStack, Braaseye, Bullseye, drawAnswer } from '../interfaces'

import { randomNumber, randomHeading, getBR, getAltStack, getTrackDir } from '../../utils/mathutilities'
import { drawAltitudes, drawArrow, drawBraaseye, drawMeasurement } from './drawutils'
import { DrawFunction, Group } from '../interfaces'
import { PicCanvasProps, PicCanvasState } from '../picturecanvas';
import { formatGroup, getGroupOpenClose } from './formatutils';

export function drawBullseye (
    canvas:HTMLCanvasElement, 
    context:CanvasRenderingContext2D): Bullseye {

    context.lineWidth = 1;
    context.fillStyle = "black";
    context.strokeStyle = "black";

    var centerPointX = randomNumber(canvas.width * 0.33, canvas.width * 0.66);
    var centerPointY = randomNumber(canvas.height * 0.33, canvas.height * 0.66);
    
    context.beginPath();
    context.arc(centerPointX, centerPointY, 2, 0, 2 * Math.PI, true);
    context.stroke();
    context.fill();
    
    context.moveTo(centerPointX, centerPointY + 6);
    context.lineTo(centerPointX, centerPointY - 6);
    context.stroke();
    
    context.moveTo(centerPointX + 6, centerPointY);
    context.lineTo(centerPointX - 6, centerPointY);
    context.stroke();
    
    return {x: centerPointX, y:centerPointY}
}

export const drawAzimuth:DrawFunction = (
    canvas: HTMLCanvasElement,
    ctx:CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?: Bullseye):drawAnswer => {
        
    if (!state.bluePos) { return { pic: "", groups: []} }
    
    var lowYMult = (props.orientation==="NS") ? 0.35 : 0.2
    var hiYMult = (props.orientation==="NS") ? 0.9 : 0.6
    var startY:number = (start && start.y) || randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
    var startX:number = (start && start.x) || randomNumber(canvas.width * 0.20, !props.orientation ? canvas.width * 0.6: canvas.width * 0.6);
    
    var incr:number = canvas.width / (canvas.width / 10);
    var distance:number = randomNumber(3.5 * incr, 10 * incr);

    var heading:number = randomHeading(props.format);
    var ng:Group = drawArrow( canvas, props.orientation, randomNumber(1, 4), startX, startY, heading + randomNumber(-10,10));
    
    if (props.isHardMode) heading = randomHeading(props.format);
    
    var sg:Group

    var m1x:number = ng.x 
    var m1y:number = ng.y
    var m2: Bullseye
    if (props.orientation==="EW") {
        sg = drawArrow( canvas, props.orientation, randomNumber(1, 4), startX, startY + distance, heading + randomNumber(-10,10));
        m2 = { x: ng.x, y: sg.y}
    } else {
        sg = drawArrow( canvas, props.orientation, randomNumber(1, 4), startX + distance, startY, heading + randomNumber(-10,10));
        m2 = { x: sg.x, y: ng.y}
    }

    distance = getBR( m1x, m1y, m2).range * 4

    drawMeasurement(canvas, ctx, m1x, m1y + 2, m2.x, m2.y + 2, distance, props.showMeasurements);

    var offsetX:number = 0;
    var offsetY:number = 0;
    var offsetX2:number = 0;
    var offsetY2:number = 0;
    if (props.orientation === "NS"){
        offsetX = -60;
        offsetY = 40;
        offsetX2 = 10;
        offsetY2 = 10;
    } 
    
    drawAltitudes(canvas, ctx, ng.x + 20 + offsetX, ng.y - 11 +offsetY, ng.z);
    drawAltitudes(canvas, ctx, sg.x + 20 + offsetX2, sg.y - 11 + offsetY2, sg.z);

    var ngBraaseye: Braaseye = drawBraaseye(canvas, ctx, state.bluePos, ng, state.bullseye, props.showMeasurements, props.braaFirst, offsetX, offsetY);
    var sgBraaseye: Braaseye = drawBraaseye(canvas, ctx, state.bluePos, sg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX2, offsetY2);

    var ngAlts: AltStack = getAltStack(ng.z, props.format);
    var sgAlts: AltStack = getAltStack(sg.z, props.format);

    var trackDir: string = getTrackDir(heading);

    var width: number = Math.floor(distance / 4);

    var includeBull: boolean = false;
    if (width >= 10 && props.format !== "ipe") {
        includeBull = true;
    }
    
    var sameTrackDir = (getTrackDir(ng.heading) === getTrackDir(sg.heading));
    var answer = "TWO GROUPS AZIMUTH " + width + " ";

    answer += getGroupOpenClose(ng, sg) + " ";

    var getEchX = getBR(sg.x, ng.y, {x: ng.x, y: ng.y}).range
    var getEchY = getBR(ng.x, sg.y, {x:ng.x, y:ng.y}).range
    if ((props.orientation==="EW" && getEchX > 5) || (props.orientation==="NS" && getEchY > 5)){
        if (ngBraaseye.braa.range < sgBraaseye.braa.range) {
            answer += " ECHELON " + getTrackDir(parseInt(getBR(sg.x, sg.y, {x:ng.x, y:ng.y}).bearing))+ ", "
        } else {
            answer += " ECHELON " + getTrackDir(parseInt(getBR(ng.x, ng.y, {x:sg.x, y:sg.y}).bearing))+ ", "
        }
    }

    if (props.format !== "ipe" && sameTrackDir){
        answer += " TRACK " + trackDir + ". ";
    }

    var anchorN = false;
    if (ngBraaseye.braa.range < sgBraaseye.braa.range) {
        anchorN = true;
    } else if (ngBraaseye.braa.range === sgBraaseye.braa.range) {
        var altN:number = ng.z.sort((a:number,b:number) => { return b-a;})[0];
        var altS:number = sg.z.sort((a:number,b:number) => {return b-a;})[0];
        
        if (altN > altS) {
        anchorN = true;
        } else if (altN === altS){
        if (ng.numContacts >= sg.numContacts ){
            anchorN = true;
        }
        }
    }
  
    if (!anchorN){
        if (props.orientation === "NS"){
        answer += formatGroup("EAST", sgBraaseye, sgAlts, sg.numContacts, true, sameTrackDir ? undefined : getTrackDir(sg.heading));
        answer += " " + formatGroup("WEST", ngBraaseye, ngAlts, ng.numContacts, includeBull, sameTrackDir ? undefined: getTrackDir(ng.heading));
        } else {
        answer += formatGroup("SOUTH", sgBraaseye, sgAlts, sg.numContacts, true, sameTrackDir ? undefined: getTrackDir(sg.heading));
        answer += " " + formatGroup("NORTH", ngBraaseye, ngAlts, ng.numContacts, includeBull, sameTrackDir ? undefined : getTrackDir(ng.heading));
        }
    } else {
        if (props.orientation === "NS"){
        answer += formatGroup("WEST", ngBraaseye, ngAlts, ng.numContacts, true, sameTrackDir ? undefined: getTrackDir(ng.heading));
        answer += " " + formatGroup("EAST", sgBraaseye, sgAlts, sg.numContacts, includeBull, sameTrackDir ? undefined : getTrackDir(sg.heading));
        } else {
        answer += formatGroup("NORTH", ngBraaseye, ngAlts, ng.numContacts, true, sameTrackDir ? undefined : getTrackDir(ng.heading));
        answer += " " + formatGroup("SOUTH", sgBraaseye, sgAlts, sg.numContacts, includeBull, sameTrackDir ? undefined: getTrackDir(sg.heading));
        }
    }

    if (props.orientation === "NS"){
        ng.label = "WEST GROUP";
        sg.label = "EAST GROUP";
    } else{
        ng.label = "NORTH GROUP";
        sg.label = "SOUTH GROUP";
    }

    return {
        pic: answer,
        groups: [ng, sg]
    };
}

export const drawRange:DrawFunction = (
    canvas: HTMLCanvasElement, 
    context:CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?:Bullseye) => {
        
    if (!state.bluePos) { return { pic: "", groups: []} }

    var lowXMult = 0.2
    var hiXMult = (props.orientation === "NS") ? 0.8 : 0.6
    var lowYMult = (props.orientation === "NS") ? 0.4 : 0.2
    var hiYMult = 0.8
    var startY:number = (start && start.y) || randomNumber(canvas.height *lowYMult, canvas.height * hiYMult);
    var startX:number = (start && start.x) || randomNumber(canvas.width *lowXMult, canvas.width * hiXMult);
      
    var incr:number = canvas.width / (canvas.width / 10);
    var distance:number = randomNumber(3.5 * incr, 10 * incr);
  
    var heading:number = randomHeading(props.format);
    var tg:Group = drawArrow(
        canvas,
        props.orientation,
        randomNumber(1, 4), 
        startX, 
        startY, 
        heading + randomNumber(-10, 10));
  
    if (props.isHardMode) heading = randomHeading(props.format);
  
    var lg: Group
    var m1x:number = tg.x 
    var m1y:number = tg.y
    var m2: Bullseye
    if (props.orientation === "NS") {
      lg =  drawArrow( canvas, props.orientation, randomNumber(1, 4), startX, startY + distance, heading + randomNumber(-10,10));
      m2 = { x: m1x, y: lg.y}
    } else {
      lg = drawArrow( canvas, props.orientation, randomNumber(1, 4), startX + distance, startY, heading + randomNumber(-10,10));
      m2 = { x: lg.x, y: m1y}
    }
  
    distance = getBR( m1x, m1y, m2).range * 4
    drawMeasurement(canvas, context, m1x, m1y, m2.x, m2.y, distance, props.showMeasurements);
  
    var tgAlts: AltStack = getAltStack(tg.z, props.format);
    var lgAlts: AltStack = getAltStack(lg.z, props.format);
  
    var offsetX = 0;
    var offsetY = 0;
    var offsetX2 = 0;
    var offsetY2 = 0;
    if (props.orientation === "EW"){
      offsetX = -10;
      offsetY = 40;
      offsetX2 = -60;
      offsetY2 = 40;
    }
  
    drawAltitudes(canvas, context, lg.x + 20 + offsetX, lg.y - 11 + offsetY, lg.z);
    drawAltitudes(canvas, context, tg.x + 20 + offsetX2, tg.y - 11 + offsetY2, tg.z);
    var lgBraaseye: Braaseye = drawBraaseye(canvas, context, state.bluePos, lg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX, offsetY );
    var tgBraaseye: Braaseye = drawBraaseye(canvas, context, state.bluePos, tg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX2, offsetY2);
  
    var answer: string = "TWO GROUPS RANGE " +  Math.floor(distance / 4) + ", ";
  
    if ((props.orientation==="EW" && getBR(tg.x, tg.y, {x: tg.x, y: lg.y}).range > 5) || (props.orientation==="NS" && getBR(lg.x, tg.y, {x:tg.x, y:tg.y}).range > 5)){
      if (props.orientation==="EW"){
        answer += " ECHELON " + getTrackDir(parseInt(getBR(tg.x, tg.y, {x:lg.x, y:lg.y}).bearing))+ ", "
      } else {
        answer += " ECHELON " + getTrackDir(parseInt(getBR(lg.x, lg.y, {x:tg.x, y:tg.y}).bearing))+ ", "
      }
    }
  
    var sameTrackDir =(getTrackDir(tg.heading) === getTrackDir(lg.heading)); 
    if (props.format !== "ipe" && sameTrackDir) {
      answer += " TRACK " + getTrackDir(heading) + ". ";
    }
  
    console.log("TODO -- DETERMINE IF OPENING/CLOSING");
  
    if (tgBraaseye.braa.range < lgBraaseye.braa.range) {
      answer += formatGroup("LEAD", tgBraaseye, tgAlts, tg.numContacts, true, (sameTrackDir ? undefined : getTrackDir(tg.heading))) + " ";
      answer += formatGroup("TRAIL", lgBraaseye, lgAlts, lg.numContacts, false, (sameTrackDir ? undefined : getTrackDir(lg.heading)));
    } else {
      answer += formatGroup("LEAD", lgBraaseye, lgAlts, lg.numContacts, true, (sameTrackDir ? undefined: getTrackDir(lg.heading))) + " ";
      answer += formatGroup("TRAIL", tgBraaseye, tgAlts, tg.numContacts, false, (sameTrackDir ? undefined: getTrackDir(tg.heading)));
    }
  
    tg.label = "TRAIL GROUP";
    lg.label = "LEAD GROUP";
  
    return {
      pic: answer,
      groups: [tg, lg]
    };
}

export const drawWall: DrawFunction = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?: Bullseye|undefined ) => {

    if (!state.bluePos) { return { pic: "", groups: []} }

    var lowXMult = 0.2
    var hiXMult = 0.5
    var lowYMult = (props.orientation === "NS") ? 0.4 : 0.2
    var hiYMult = (props.orientation === "NS") ? 0.8 : 0.5
    var startY = (start && start.y) ||  randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
    var startX =(start && start.x) || randomNumber(canvas.width * lowXMult, canvas.width * hiXMult);
  
    var heading = randomHeading(props.format);
  
    var numGroups = randomNumber(3, 6);
  
    var totalOffset = 0;
  
    var braaseyes:Braaseye[] = [];
    var altStacks:AltStack[] = [];
    var groups:Group[] = [];
    for (var x = 0; x < numGroups; x++) {
      var offset = randomNumber(-10, 10);
      var offsetY = (x === 0) ? 0 : randomNumber(40, 60);
      totalOffset += offsetY;
  
      if (props.isHardMode) heading = randomHeading(props.format);
      if (props.orientation==="NS"){ 
        groups.push( drawArrow(canvas, props.orientation, randomNumber(1, 5), startX + totalOffset, startY, heading + offset) );
      } else {
        groups.push( drawArrow(canvas, props.orientation, randomNumber(1, 5), startX, startY + totalOffset, heading + offset) );
      }
  
      var offsetX = 30;
      offsetY = 0;
      if (props.orientation === "NS"){
        offsetX = (-15*(numGroups-x));
        offsetY = 40 + 11*(numGroups-(numGroups-x));
      }
  
      drawAltitudes( canvas, context, groups[x].x + 20 + offsetX, groups[x].y - 11 + offsetY, groups[x].z);
      braaseyes.push(drawBraaseye(canvas, context, state.bluePos, groups[x], state.bullseye, props.showMeasurements, props.braaFirst, offsetX, offsetY));
      altStacks.push(getAltStack(groups[x].z, props.format));
    }
  
    var width = 0;
    if (props.orientation === "NS"){
      width = groups[groups.length-1].x - groups[0].x;
      drawMeasurement(canvas, context, groups[0].x, groups[0].y-25, groups[groups.length-1].x, groups[0].y - 25, width, props.showMeasurements)
    } else {
      width = groups[groups.length-1].y - groups[0].y;
      drawMeasurement(canvas, context, groups[0].x+25, groups[0].y, groups[0].x+25, groups[groups.length-1].y, width, props.showMeasurements)
    }
    
    var nLbl = "WEST"
    var sLbl = "EAST"
    if (props.orientation==="EW"){
      nLbl = "NORTH";
      sLbl = "SOUTH";
    } 
    switch (numGroups) {
      case 3:
        groups[0].label = nLbl + " GROUP";
        groups[1].label = "MIDDLE GROUP";
        groups[2].label = sLbl + " GROUP";
        break;
      case 4:
        groups[0].label = nLbl + " GROUP";
        groups[1].label = nLbl + " MIDDLE GROUP";
        groups[2].label = sLbl +" MIDDLE GROUP";
        groups[3].label = sLbl + " GROUP";
        break;
      case 5:
        groups[0].label = nLbl + " GROUP";
        groups[1].label = nLbl +" MIDDLE GROUP";
        groups[2].label = "MIDDLE GROUP";
        groups[3].label = sLbl + " MIDDLE GROUP";
        groups[4].label = sLbl + " GROUP";
        break;
    }
  
    width = Math.floor(width /4);
    var answer = numGroups + " GROUP WALL " + width + " WIDE, ";
  
    var sameTrackDir = true;
    var trackDirCheck = getTrackDir(groups[0].heading);
    for (var i = 1; i < numGroups; i ++){
      if (props.isHardMode && getTrackDir(groups[i].heading) !== trackDirCheck){
        i = numGroups + 1;
        sameTrackDir = false;
      }
    }
    if (props.format !== "ipe" && sameTrackDir){
      answer += " TRACK " + getTrackDir(heading) +" ";
    }
  
    var anchorNorth = false
    if (braaseyes[0].braa.range < braaseyes[braaseyes.length-1].braa.range) {
      anchorNorth = true;
    } else if (braaseyes[0].braa.range === braaseyes[braaseyes.length-1].braa.range){ 
        var altN:number = groups[0].z.sort((a:number,b:number) => { return b-a;})[0];
        var altS:number = groups[groups.length-1].z.sort((a:number,b:number) => {return b-a;})[0];
        
        if (altN > altS) {
          anchorNorth = true;
        } else if (altN === altS){
        if (groups[0].numContacts >= groups[groups.length-1].numContacts ){
          anchorNorth = true;
        }
      }
    }
    console.log("DETERMINE IF WEIGHTED WALL");
    
    var includeBull = false;
    if (width > 10 && props.format !== "ipe") {
      includeBull = true;
    }
  
    for (var g = 0; g < numGroups; g++){
        var idx: number = anchorNorth ? g : (numGroups-1) - g
        answer += formatGroup((groups[idx].label+"").replace(/GROUP/, ""), braaseyes[idx], altStacks[idx], groups[idx].numContacts, (g===0) || (g === numGroups-1 && includeBull) || false, sameTrackDir ? undefined: getTrackDir(groups[idx].heading))+ " ";
    }

    return {
      pic: answer,
      groups: groups
    };
}  

export const drawLadder: DrawFunction =  (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  props: PicCanvasProps,
  state: PicCanvasState,
  start?: Bullseye|undefined ) => {
  
  if (!state.bluePos) { return { pic: "", groups: []} }

  var groups:Group[] = [];
  var braaseyes: Braaseye[] = [];
  var altstacks: AltStack[] = [];

  var yLowMult = (props.orientation === "NS") ? 0.55 : 0.3
  var yHiMult = (props.orientation === "NS") ? 0.9 : 0.8
  var xLowMult = 0.2
  var xHiMult = (props.orientation === "NS") ? 0.8 : 0.4
  var startY = (start && start.y) || randomNumber(canvas.height*yLowMult, canvas.height * yHiMult);
  var startX = (start && start.x) || randomNumber(canvas.width *xLowMult, canvas.width * xHiMult);

  var heading = randomHeading(props.format);
  var numGroups = randomNumber(3, 6);

  var totalOffset = 0;

  for (var x = 0; x < numGroups; x++) {
    var offset = randomNumber(-5, 5);
    totalOffset +=(x===0 ? 0 : randomNumber(30,80)); 

    heading = (!props.isHardMode) ? heading : randomHeading(props.format);

    if (props.orientation==="NS"){ 
      groups.push( drawArrow(canvas, props.orientation, randomNumber(1, 5), startX, startY - totalOffset, heading + offset) );
    } else {
      groups.push( drawArrow(canvas, props.orientation, randomNumber(1, 5), startX + totalOffset, startY, heading + offset) );
    }

    var offsetX = 0;
    var offsetY = 0;
    if (props.orientation==="EW"){
      offsetX = -40 + -5*(numGroups-x);
      offsetY = -20 + -11 * (numGroups-x);
    }
    drawAltitudes(canvas,context, groups[x].x+20 + offsetX, groups[x].y-11+offsetY, groups[x].z );
    braaseyes[x] = drawBraaseye(canvas, context, state.bluePos, { x: groups[x].x, y: groups[x].y}, state.bullseye, props.showMeasurements, props.braaFirst, offsetX, offsetY);
    altstacks[x] = getAltStack(groups[x].z, props.format);
  }

  if (props.orientation === "NS"){
    drawMeasurement(canvas, context, groups[0].x-30, groups[0].y, groups[0].x-30, groups[0].y - totalOffset, Math.floor(totalOffset), props.showMeasurements );
  } else {
    drawMeasurement(canvas, context, groups[0].x, groups[0].y+40, groups[0].x + totalOffset, groups[0].y+40, Math.floor(totalOffset), props.showMeasurements );
  }

  switch (numGroups) {
    case 3:
      groups[0].label = "TRAIL GROUP";
      groups[1].label = "MIDDLE GROUP";
      groups[2].label = "LEAD GROUP";
      break;
    case 4:
      groups[0].label = "TRAIL GROUP";
      groups[1].label = "3RD GROUP";
      groups[2].label = "2ND GROUP";
      groups[3].label = "LEAD GROUP";
      break;
    case 5:
      groups[0].label = "TRAIL GROUP";
      groups[1].label = "4TH GROUP";
      groups[2].label = "3RD GROUP";
      groups[3].label = "2ND GROUP";
      groups[4].label = "LEAD GROUP";
      break;
  } 
  
  var answer = numGroups + " GROUP LADDER " + Math.floor(totalOffset / 4) + " DEEP, ";

  var trackDirCheck = getTrackDir(groups[0].heading);
  var sameTrackDir = groups.every( o => getTrackDir(o.heading) === trackDirCheck)
  if (props.format !== "ipe" && sameTrackDir){
    answer += " TRACK " + getTrackDir(heading) +" ";
  }

  console.log("CHECK FOR ECHELON LADDER?");

  var rangeBack = {
    label: "SEPARATION",
    range: getBR(groups[groups.length - 1].x, groups[groups.length - 1].y, {
      x: groups[groups.length - 2].x,
      y: groups[groups.length - 2].y
    }).range
  };

  for (var g = groups.length-1; g >=0; g--){
    var label = groups[g].label!==undefined ? groups[g].label+"" : ""
    answer += formatGroup(label.replace(/GROUP/, ""), braaseyes[g], altstacks[g], groups[g].numContacts, g===groups.length-1, sameTrackDir ? undefined: getTrackDir(groups[g].heading), (g===groups.length-2) ? rangeBack : undefined,)+ " ";
  }

  return {
    pic: answer,
    groups: groups
  };
}

export const drawChampagne:DrawFunction =  (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  props: PicCanvasProps,
  state: PicCanvasState,
  start?: Bullseye|undefined ) => {
  
  if (!state.bluePos) { return { pic: "", groups: []} }

  var lowYMult = (props.orientation ==="NS") ? 0.5 : 0.2
  var hiYMult = (props.orientation === "NS") ? 0.9 : 0.8
  var lowXMult = (props.orientation === "NS") ? 0.2 : 0.2
  var hiXMult = (props.orientation === "NS") ? 0.8 : 0.5
  var startY = (start && start.y) || randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
  var startX = (start && start.x) || randomNumber(canvas.width * lowXMult, canvas.width * hiXMult);

  var incr:number = canvas.width / (canvas.width / 10);
  var champWidth:number = randomNumber(3.5 * incr, 10 * incr);
  var champDepth:number = randomNumber(3.5 * incr, 10 * incr);

  var heading:number = randomHeading(props.format);
  var tg:Group = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX, startY, heading + randomNumber(-10, 10));

  if (props.isHardMode) heading = randomHeading(props.format);
  
  var nlg:Group
  if (props.orientation === "NS"){
    nlg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX - champWidth/2, startY - champDepth,  heading + randomNumber(-10, 10));
  } else {
    nlg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX + champDepth, startY - champWidth / 2,  heading + randomNumber(-10, 10));
  }
  
  if (props.isHardMode) heading = randomHeading(props.format);
  var slg:Group
  if (props.orientation === "NS"){
    slg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX + champWidth/2, startY - champDepth, heading + randomNumber(-10, 10));
  } else {
    slg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX + champDepth, startY + champWidth / 2, heading + randomNumber(-10, 10));
  }

  var width:number = Math.floor(champWidth / 4);
  var depth:number = Math.floor(champDepth / 4);

  if (props.orientation === "NS"){
    drawMeasurement(canvas, context, nlg.x, nlg.y, slg.x, slg.y, champWidth, props.showMeasurements);
    drawMeasurement(canvas, context, tg.x, tg.y, tg.x, nlg.y, champDepth, props.showMeasurements);
  }
  else {
    drawMeasurement(canvas, context, tg.x, tg.y, nlg.x, tg.y, champDepth, props.showMeasurements);
    drawMeasurement(canvas, context, nlg.x, slg.y, nlg.x, nlg.y, champWidth, props.showMeasurements);
  }
  
  var offsetX = 0;
  var offsetX2 = 0;
  if (props.orientation==="NS"){
    offsetX2 = -70;
  } else {
    offsetX = -70;
  }
  drawAltitudes(canvas, context, tg.x +20 + offsetX, tg.y - 11, tg.z);
  drawAltitudes(canvas, context, slg.x + 20, slg.y - 11, slg.z);
  drawAltitudes(canvas, context, nlg.x + 20 + offsetX2, nlg.y - 11, nlg.z);
  
  var tgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, tg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX);
  var nlgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, nlg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX2);
  var slgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, slg, state.bullseye, props.showMeasurements, props.braaFirst);

  var tgAlts:AltStack = getAltStack(tg.z, props.format);
  var nlgAlts:AltStack = getAltStack(nlg.z, props.format);
  var slgAlts:AltStack = getAltStack(slg.z, props.format);

  var answer = "THREE GROUP CHAMPAGNE " +width +" WIDE, " +depth +" DEEP, ";
 
  var sLbl = "SOUTH";
  var nLbl = "NORTH";
  if (props.orientation==="NS"){
    sLbl = "EAST";
    nLbl = "WEST";
  }
  // determine if weighted
  if (getBR(nlg.x, nlg.y, {x:nlg.x, y:tg.y}).range < width/3){
    answer += " WEIGHTED " + nLbl + ", ";
  } else if (getBR(slg.x, slg.y, {x:slg.x, y:tg.y}).range < width/3){
    answer += " WEIGHTED " + sLbl + ", ";
  }
  
  var nlTrack = props.format === "alsa" ? getTrackDir(nlg.heading): undefined;
  var slTrack = props.format === "alsa" ? getTrackDir(slg.heading): undefined;
  var tTrack = props.format === "alsa" ? getTrackDir(tg.heading): undefined;

  var sameTrackDir = (nlTrack === slTrack && slTrack === tTrack);
  if (props.format !== "ipe" && sameTrackDir){
    answer += " TRACK " + nlTrack + ". ";
  } 

  var includeBull:boolean = false;
  if (width >= 10 && props.format !== "ipe") {
    includeBull = true;
  }

  // TODO -- anchoring priorities for LE of champagne
  if (nlgBraaseye.braa.range < slgBraaseye.braa.range) {
    answer += formatGroup(nLbl +" LEAD", nlgBraaseye, nlgAlts, nlg.numContacts, true, sameTrackDir ? undefined: nlTrack) + " ";
    answer +=  formatGroup(sLbl +" LEAD",  slgBraaseye,  slgAlts,  slg.numContacts,  includeBull, sameTrackDir ? undefined: slTrack ) + " ";
  } else {
    answer += formatGroup(sLbl +" LEAD", slgBraaseye, slgAlts, slg.numContacts, true, sameTrackDir ? undefined: slTrack) + " ";
    answer += formatGroup(nLbl + " LEAD", nlgBraaseye,  nlgAlts,  nlg.numContacts,  includeBull, sameTrackDir ? undefined : nlTrack ) + " ";
  }
  answer += formatGroup("TRAIL", tgBraaseye, tgAlts, tg.numContacts, false, sameTrackDir? undefined: tTrack);

  tg.label = "TRAIL GROUP";
  nlg.label = nLbl + " LEAD GROUP";
  slg.label = sLbl +" LEAD GROUP";

  return {
    pic: answer,
    groups: [tg, nlg, slg]
  };
}

export const drawVic:DrawFunction =  (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  props: PicCanvasProps,
  state: PicCanvasState,
  start?: Bullseye|undefined ) => {

  if (!state.bluePos) { return { pic: "", groups: []} }

  var lowYMult = (props.orientation ==="NS") ? 0.4 : 0.2
  var hiYMult = (props.orientation === "NS") ? 0.9 : 0.8
  var lowXMult = (props.orientation === "NS") ? 0.2 : 0.3
  var hiXMult = (props.orientation === "NS") ? 0.8 : 0.6
  var startY = (start && start.y) || randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
  var startX = (start && start.x) || randomNumber(canvas.width * lowXMult, canvas.width * hiXMult);

  var incr: number = canvas.width / (canvas.width / 10);
  var vicWidth: number = randomNumber(3.5 * incr, 10 * incr);
  var vicDepth: number = randomNumber(3.5 * incr, 10 * incr);

  var heading:number = randomHeading(props.format);
  var lg:Group = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX, startY, heading + randomNumber(-10, 10));

  if (props.isHardMode) heading = randomHeading(props.format);
  var stg:Group
  if (props.orientation==="NS"){
    stg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX + vicWidth/2, startY + vicDepth, heading + randomNumber(-10, 10));
  } else {
    stg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX - vicDepth, startY + vicWidth / 2, heading + randomNumber(-10, 10));
  }

  if (props.isHardMode) heading = randomHeading(props.format);
  var ntg:Group
  if (props.orientation==="NS"){
    ntg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX - vicWidth/2, startY +vicDepth, heading + randomNumber(-10, 10));
  } else {
    ntg = drawArrow(canvas, props.orientation, randomNumber(1, 4), startX - vicDepth, startY - vicWidth / 2, heading + randomNumber(-10, 10));
  }

  if (props.orientation==="NS"){
    drawMeasurement(canvas, context, lg.x, lg.y, lg.x, stg.y, vicDepth, props.showMeasurements);
    drawMeasurement(canvas, context, stg.x, stg.y, ntg.x, ntg.y, vicWidth, props.showMeasurements);
  } else{
    drawMeasurement(canvas, context, lg.x, lg.y, stg.x, lg.y, vicDepth, props.showMeasurements);
    drawMeasurement(canvas, context, stg.x, stg.y, ntg.x, ntg.y, vicWidth, props.showMeasurements);
  }

  var width:number = Math.floor(vicWidth / 4);
  var depth:number = Math.floor(vicDepth / 4);

  var offsetX = 0;
  if (props.orientation==="NS"){
    offsetX = -70;
  }

  drawAltitudes(canvas, context, lg.x + 20, lg.y - 11, lg.z);
  drawAltitudes(canvas, context, stg.x + 20, stg.y - 11, stg.z);
  drawAltitudes(canvas, context, ntg.x + offsetX + 20, ntg.y - 11, ntg.z);

  var lgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, lg, state.bullseye, props.showMeasurements, props.braaFirst);
  var stgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, stg, state.bullseye, props.showMeasurements, props.braaFirst);
  var ntgBraaseye:Braaseye = drawBraaseye(canvas, context, state.bluePos, ntg, state.bullseye, props.showMeasurements, props.braaFirst, offsetX);

  var lgAlts:AltStack = getAltStack(lg.z, props.format);
  var stgAlts:AltStack = getAltStack(stg.z, props.format);
  var ntgAlts:AltStack = getAltStack(ntg.z, props.format);

  var answer = "THREE GROUP VIC " + depth + " DEEP, " + width + " WIDE, ";

  var nLbl = "NORTH";
  var sLbl = "SOUTH";
  if (props.orientation==="NS"){
    nLbl = "WEST";
    sLbl = "EAST";
  }
  if (getBR(lg.x, lg.y, {x:lg.x, y:ntg.y}).range < width/3){
    answer += " WEIGHTED " + nLbl +", ";
  }
  if (getBR(lg.x, lg.y, {x:lg.x, y:stg.y}).range < width/3){
    answer += " WEIGHTED " + sLbl +", ";
  }

  console.log("DETERMINE IF OPENING/CLOSING -- EWI/SPEED TG");

  var ntTrack = props.format === "alsa" ? getTrackDir(ntg.heading) : undefined;
  var stTrack= props.format === "alsa" ? getTrackDir(stg.heading) : undefined;
  var lTrack = props.format === "alsa" ? getTrackDir(lg.heading) : undefined;
  var sameTrackDir =(ntTrack === stTrack && stTrack === lTrack);
    
  if (props.format !== "ipe" && sameTrackDir) {
    answer += " TRACK " +  getTrackDir(ntg.heading) + ". ";
  }

  answer += formatGroup("LEAD", lgBraaseye, lgAlts, lg.numContacts, true, sameTrackDir ? undefined: lTrack) + " ";

  var anchorN:boolean = false;
  if (ntgBraaseye.braa.range < stgBraaseye.braa.range){
    anchorN = true;
  } else if (ntgBraaseye.braa.range === stgBraaseye.braa.range) {
    var ntgA:number = ntg.z.sort((a,b)=> {return b-a})[0]
    var stgA:number = stg.z.sort((a,b)=> {return b-a})[0]
    if (ntgA > stgA){
      anchorN = true;
    } else if (ntgA === stgA) {
      if (ntg.numContacts > stg.numContacts) {
        anchorN = true;
      }
    }
  }

  if (anchorN) {
    answer += formatGroup( nLbl+" TRAIL", ntgBraaseye, ntgAlts, ntg.numContacts, false, sameTrackDir ? undefined: ntTrack) + " ";
    answer += formatGroup( sLbl +" TRAIL", stgBraaseye, stgAlts, stg.numContacts, false, sameTrackDir ? undefined: stTrack);
  } else {
    answer += formatGroup( sLbl +" TRAIL", stgBraaseye, stgAlts, stg.numContacts, false, sameTrackDir ? undefined: stTrack) + " ";
    answer += formatGroup( nLbl + " TRAIL", ntgBraaseye, ntgAlts, ntg.numContacts, false, sameTrackDir ? undefined: ntTrack);
  }

  lg.label = "LEAD GROUP";
  stg.label = sLbl +" TRAIL GROUP";
  ntg.label = nLbl + " TRAIL GROUP";

  return {
    pic: answer,
    groups: [lg, stg, ntg]
  };
}

export const drawLeadEdge:DrawFunction = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  props: PicCanvasProps,
  state: PicCanvasState,
  start?: Bullseye|undefined ) => {

  if (!state.bluePos) { return { pic: "", groups: []} }

  var lowYMult = (props.orientation ==="NS") ? 0.5 : 0.42
  var hiYMult = (props.orientation === "NS") ? 0.6 : 0.5
  var lowXMult = (props.orientation === "NS") ? 0.2 : 0.5
  var hiXMult = (props.orientation === "NS") ? 0.8 : 0.6
  var startX1: number = randomNumber(canvas.width * lowXMult, canvas.width * hiXMult);
  var startY1: number = randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
  var start1 = { x: props.orientation==="NS" ? undefined : startX1, y: props.orientation==="NS" ? startY1 : undefined};
  return state.reDraw(canvas, context, true, start1).then((answer1: any) => {
   
    var lowYMult = (props.orientation ==="NS") ? 0.7 : 0.25
    var hiYMult = (props.orientation === "NS") ? 0.9 : 0.29
    var lowXMult = (props.orientation === "NS") ? 0.2 : 0.15
    var hiXMult = (props.orientation === "NS") ? 0.8 : 0.25
    var startX2 = randomNumber(canvas.width * lowXMult, canvas.width * hiXMult);
    var startY2 = randomNumber(canvas.height * lowYMult, canvas.height * hiYMult);
    var start2 = { x: props.orientation ==="NS" ? undefined : startX2, y: props.orientation==="NS" ? startY2 : undefined};
    return state.reDraw(canvas, context, true, start2).then((answer2:any) => { 

      if (!state.bluePos) { return { pic: "", groups: []} }
      var groups1 = answer1.picture.groups;
      var groups2 = answer2.picture.groups;

      if (props.orientation==="NS"){
        var tmp = groups1;
        groups1 = groups2;
        groups2 = tmp;
        answer1= answer2;
      }
      var closestFollow = Math.max.apply(Math, groups2.map(function(o:Group) { return props.orientation==="NS" ? o.y : o.x;})); 
      var closestLead = Math.min.apply(Math, groups1.map(function(o:Group) { return props.orientation==="NS" ? o.y : o.x;}));

      var rngBack;
      
      if (props.orientation==="EW") {
        rngBack = getBR(groups1[0].startX, closestFollow, { x: groups1[0].startX, y: closestLead });
      } else {
        rngBack = getBR(closestFollow, groups1[0].startY, {
          x: closestLead,
          y: groups1[0].startY
        });
      }

      if (closestLead - closestFollow <= 20 || rngBack.range >= 40){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBullseye(canvas, context);
        drawArrow(canvas, props.orientation, 4, state.bluePos.x, state.bluePos.y, (props.orientation==="NS" ? 180 : 270), "blue");
        return drawLeadEdge(canvas, context, props, state, start);
      }

      return  {
        pic:
          (groups1.length +groups2.length) +
          " GROUPS, LEADING EDGE " +
          answer1.picture.pic +
          " FOLLOW ON " + (props.format ==="ipe" ? " GROUPS " : "") +
          (rngBack.range > 40 ? " 40 " : rngBack.range) +
          (props.format==="ipe" ? " MILES" : ""),
        groups: groups1.concat(groups2)
      };
    })
  })
}