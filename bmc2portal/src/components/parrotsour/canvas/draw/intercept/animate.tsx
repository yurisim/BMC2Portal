import { getBR, randomNumber, toRadians } from "../../../utils/mathutilities";
import { BRAA, Group } from "../../interfaces";
import { PicCanvasProps, PicCanvasState } from "../../picturecanvas";
import { drawAltitudes, drawArrow, drawBraaseye } from "../drawutils";

export function animateGroups(
    canvas: HTMLCanvasElement,
    props: PicCanvasProps, 
    state: PicCanvasState,
    groups: Group[],
    animateCanvas: ImageData) {
    console.log("doing animation....")
    for (var x = 0; x < groups.length; x++) {
      if (randomNumber(0, 10) <= 2) {
        groups[x].maneuvers = true;
      }
    }
    console.log("set mvrs")
    continueAnimation = true;
    doAnimation(canvas, props, state, groups, animateCanvas);
}
  
  
function sleep(milliseconds: number) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
}
  
var continueAnimation: boolean = true;
var pauseShowMeasure: boolean = true;
  
// function setContinueAnimate(val: boolean) {
//     continueAnimation = val;
// }

// function getContinueAnimate() {
//     return continueAnimation;
// }
  
// function pauseFight(showMeasure: boolean) {
//     pauseShowMeasure = showMeasure;
//     setContinueAnimate(false);
// }
  
function doAnimation(
    canvas: HTMLCanvasElement,
    props: PicCanvasProps,
    state: PicCanvasState,
    groups:Group[],
    animateCanvas: ImageData) {

    var context = canvas.getContext("2d");

    if (!context || !state.bluePos) return 
    
    context.putImageData(animateCanvas, 0, 0);
  
    var doManeuvers:boolean = false;
    for (var x = 0; x < groups.length; x++) {
  
      if (groups[x].startY > (canvas.height*0.95) || groups[x].startY <= canvas.height* 0.05){
        console.log("too far north, setting new heading")
        groups[x].desiredHeading = parseInt(getBR(state.bluePos.x, state.bluePos.y, { x: groups[x].startX, y: groups[x].startY }).bearing);
      }
      drawArrow(canvas,props.orientation, groups[x].numContacts, groups[x].startX, groups[x].startY, groups[x].heading );
  
      var xyDeg: number = groups[x].heading - 90;
      if (xyDeg < 0) xyDeg += 360;
  
      var rads: number = toRadians(xyDeg);
  
      var offsetX: number = 7 * Math.cos(rads);
      var offsetY: number = 7 * Math.sin(rads);
  
      if (groups[x].startX >= canvas.width * 0.8) {
        offsetX = 0;
      }
      groups[x].startX = groups[x].startX + offsetX;
      groups[x].startY = groups[x].startY + offsetY;
  
      var deltaA = groups[x].desiredHeading - groups[x].heading;
  
      var offset = 0;
      var newHeading = groups[x].desiredHeading;
      if (Math.abs(deltaA) > 90) {
        offset = deltaA / 15;
        if (groups[x].heading > 300) {
          offset = -offset;
        }
        if (groups[x].heading + offset > 360) {
          newHeading = groups[x].heading + offset - 360;
        } else {
          newHeading = groups[x].heading + offset;
        }
      } else if (Math.abs(deltaA) > 7) {
        offset = deltaA / 7;
        newHeading = groups[x].heading + offset;
      } else {
        if (
          groups[x].maneuvers &&
          groups[x].heading !== 90 &&
          groups[x].heading !== 360 &&
          groups[x].heading === groups[x].desiredHeading
        ) {
        //   var aspectH = getAspect(state.bluePos, groups[x]);
        //   var mxUpdate =
        //     groups[x].label +
        //     " MANEUVER, " +
        //     aspectH +
        //     " " +
        //     getTrackDir(groups[x].heading);
  
        //   var mxCommDiv = document.getElementById("maneuverComm");
  
        //   if (!mxCommDiv.innerHTML.includes(mxUpdate)) {
        //     mxCommDiv.innerHTML = mxCommDiv.innerHTML + "<br/>" + mxUpdate;
        //   }
        }
      }
  
      groups[x].heading = newHeading;
  
      if (groups[x].maneuvers) {
        var br = getBR(state.bluePos.x, state.bluePos.y, { x: groups[x].startX, y: groups[x].startY});
  
        if ((groups[x].desiredHeading === 90 || groups[x].desiredHeading === 360) && br.range < 70) {
          groups[x].desiredHeading = randomNumber(45, 270);
        //   document.getElementById("maneuverComm").innerHTML =
        //     document.getElementById("maneuverComm").innerHTML +
        //     groups[x].label +
        //     " MANEUVER <br/>";
        }
        if (groups[x].desiredHeading !==90 && groups[x].desiredHeading !== 360 && br.range > 70) {
          groups[x].desiredHeading = parseInt(br.bearing);
        }
        if ((Math.abs(groups[x].desiredHeading - parseInt(br.bearing)) >=45 && br.range < 40) || (Math.abs(groups[x].desiredHeading - parseInt(br.bearing)) > 45 && br.range > 70) ){
          groups[x].maneuvers=  false;
          groups[x].desiredHeading = props.orientation === "NS" ? 360 : 90;
          groups[x].heading = props.orientation === "NS" ? 360 : 90; 
        }
        doManeuvers = true;
      }
    }
  
    if (!doManeuvers && (groups[groups.length - 1].startX > canvas.width * 0.8 || groups[groups.length - 1].startY < canvas.height * 0.2) ) {
      continueAnimation = false;
    }
  
    if (continueAnimation) {
      sleep(500 * ((100-props.sliderSpeed)/100));
  
      var animate = function() {
        doAnimation(canvas, props, state, groups, animateCanvas);
      };
      window.requestAnimationFrame(animate);
  
      for (var y =0 ; y < groups.length; y++){
        drawAltitudes(canvas, context, groups[y].startX + 20, groups[y].startY - 11, groups[y].z);
      }
    } else {
    //   var mxCommDiv = document.getElementById("maneuverComm");
  
      var closest: BRAA = { bearing: "90", range: 1000 };
    //   var closestGrp: Group = groups[0];
  
      for (y = 0; y < groups.length; y++) {
        if (pauseShowMeasure) {
          drawBraaseye(
            canvas,
            context,
            state.bluePos,
            { x: groups[y].startX, y: groups[y].startY },
            state.bullseye,
            true,
            props.braaFirst
          );
        }
  
        drawAltitudes(canvas, context, groups[y].startX + 20, groups[y].startY - 11, groups[y].z);
  
        br = getBR(groups[y].startX, groups[y].startY, {
          x: state.bluePos.x,
          y: state.bluePos.y
        });
        if (br.range < closest.range) {
          closest = br;
        //   closestGrp = groups[y];
        }
      }
  
      if (closest.range < 40) {
        // var altStack: AltStack = getAltStack(closestGrp.z, props.format);
        // mxCommDiv.innerHTML =
        //   mxCommDiv.innerHTML +
        //   "<br/> THREAT BRAA " +
        //   closest.bearing +
        //   "/" +
        //   closest.range +
        //   " " +
        //   altStack.stack +
        //   " HOT, HOSTILE " +
        //   altStack.fillIns;
      }
    }
  }
  
  