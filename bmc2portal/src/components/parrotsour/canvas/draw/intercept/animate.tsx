import { getBR, randomNumber, toRadians } from "../../../utils/mathutilities";
import { BRAA, Group } from "../../../../utils/interfaces";
import { PicCanvasProps, PicCanvasState } from "../../picturecanvas";
import { drawAltitudes, drawArrow, drawBraaseye, headingToDeg } from "../drawutils";

let continueAnimation = false;
let pauseShowMeasure = true
  
function sleep(milliseconds: number):void {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
}

export function getContinueAnimate(): boolean{
  return continueAnimation
}
  
function setContinueAnimate(val: boolean) {
    continueAnimation = val;
}
  
export function pauseFight(showMeasure: boolean): void {
    pauseShowMeasure = showMeasure;
    setContinueAnimate(false);
}
  
function isNearBounds(canvas:HTMLCanvasElement, group:Group){
  const buffer = 40
  return group.startX < buffer || group.startX > canvas.width-buffer || group.startY < buffer || group.startY > canvas.height-buffer
}

// eslint-disable-next-line complexity
function doAnimation(
    canvas: HTMLCanvasElement,
    props: PicCanvasProps,
    state: PicCanvasState,
    groups:Group[],
    animateCanvas: ImageData,
    resetCallback: (showMeasure:boolean)=>void):void {

    const context = canvas.getContext("2d");

    if (!context || !state.bluePos) return 
    
    context.putImageData(animateCanvas, 0, 0);
  
    // let doManeuvers = false;

    let br: BRAA
    for (let x = 0; x < groups.length; x++) {
      
      drawArrow(canvas,props.orientation, groups[x].numContacts, groups[x].startX, groups[x].startY, groups[x].heading );
  
      const xyDeg = headingToDeg(groups[x].heading).degrees
      const rads: number = toRadians(xyDeg);
      let offsetX: number = 7 * Math.cos(rads);
      let offsetY: number = -7 * Math.sin(rads);
  
      if (isNearBounds(canvas, groups[x])){
        offsetX = 0
        offsetY = 0
      }

      groups[x].startX = groups[x].startX + offsetX;
      groups[x].startY = groups[x].startY + offsetY;

      if (!groups[x].maneuvers)
        groups[x].desiredHeading = parseInt(getBR(state.bluePos.x, state.bluePos.y, {x:groups[x].startX, y: groups[x].startY}).bearing)
      
      let deltaA: number

      const LH = (groups[x].heading - groups[x].desiredHeading + 360) % 360
      const RH = (groups[x].desiredHeading - groups[x].heading + 360) % 360
      
      if (LH < RH) {
        deltaA = -LH
      } else {
        deltaA = RH
      }

      let divisor = 7
      const absDelt = Math.abs(deltaA)
      if (absDelt > 90 ){
        divisor = 15
      } else if (absDelt < 7 ) {
        divisor = 1
      }
      const newHeading = groups[x].heading + deltaA / divisor
      groups[x].heading = newHeading
      // let offset = 0;
      // let newHeading = groups[x].desiredHeading;
      // if (Math.abs(deltaA) > 90) {
      //   offset = deltaA / 15;
      //   if (groups[x].heading > 300) {
      //     offset = -offset;
      //   }
      //   if (groups[x].heading + offset > 360) {
      //     newHeading = groups[x].heading + offset - 360;
      //   } else {
      //     newHeading = groups[x].heading + offset;
      //   }
      // } else if (Math.abs(deltaA) > 7) {
      //   offset = deltaA / 7;
      //   newHeading = groups[x].heading + offset;
      // } else {
      //   if (
      //     groups[x].maneuvers &&
      //     groups[x].heading !== 90 &&
      //     groups[x].heading !== 360 &&
      //     groups[x].heading === groups[x].desiredHeading
      //   ) {
      //   //   var aspectH = getAspect(state.bluePos, groups[x]);
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
      //   }
      // }
  
      // groups[x].heading = newHeading;
  
      if (groups[x].maneuvers) {
        br = getBR(state.bluePos.x, state.bluePos.y, { x: groups[x].startX, y: groups[x].startY});
  
        if (br.range < 70) {
          console.log("maneuver")
          groups[x].desiredHeading = randomNumber(45,330)
          // do nothing
        }

        //   groups[x].desiredHeading = randomNumber(45, 270);
        // //   document.getElementById("maneuverComm").innerHTML =
        // //     document.getElementById("maneuverComm").innerHTML +
        // //     groups[x].label +
        // //     " MANEUVER <br/>";
        // }
        // if (groups[x].desiredHeading !==90 && groups[x].desiredHeading !== 360 && br.range > 70) {
        //   groups[x].desiredHeading = parseInt(br.bearing);
        // }
        // if ((Math.abs(groups[x].desiredHeading - parseInt(br.bearing)) >=45 && br.range < 40) || (Math.abs(groups[x].desiredHeading - parseInt(br.bearing)) > 45 && br.range > 70) ){
        //   groups[x].maneuvers=  false;
        //   groups[x].desiredHeading = props.orientation === "NS" ? 360 : 90;
        //   groups[x].heading = props.orientation === "NS" ? 360 : 90; 
        // }
        // doManeuvers = true;
      }
    }

    groups.map((grp) => {
      if (getBR(state.bluePos.x, state.bluePos.y, {x:grp.startX, y:grp.startY}).range < 30 ){
        console.log('range met')
        continueAnimation = false
        resetCallback(true)
      }
    })
    // if (!doManeuvers && (groups[groups.length - 1].startX > canvas.width * 0.8 || groups[groups.length - 1].startY < canvas.height * 0.2) ) {
    //   continueAnimation = false;
    // }
  
    if (continueAnimation) {
      //setCurImageData(context.getImageData(0,0,canvas.width,canvas.height))
      const slider:HTMLInputElement = document.getElementById("speedSlider") as HTMLInputElement
      if (slider && slider.value){
        sleep(500 * ((100-parseInt(slider.value))/100));
      } else {
        sleep(500 * ((100-props.sliderSpeed)/100));
      }
  
      const animate = function() {
        doAnimation(canvas, props, state, groups, animateCanvas, resetCallback);
      };
      window.requestAnimationFrame(animate);
  
      for (let y =0 ; y < groups.length; y++){
        drawAltitudes(canvas, context, groups[y].startX + 20, groups[y].startY - 11, groups[y].z);
      }
    } else {
    //   var mxCommDiv = document.getElementById("maneuverComm");
  
      let closest: BRAA = { bearing: "90", range: 1000 };
    //   var closestGrp: Group = groups[0];
  
      for (let y = 0; y < groups.length; y++) {
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

export function animateGroups(
  canvas: HTMLCanvasElement,
  props: PicCanvasProps, 
  state: PicCanvasState,
  groups: Group[],
  animateCanvas: ImageData,
  resetCallback: (showMeasure:boolean)=>void):void {
  console.log("doing animation....")
  for (let x = 0; x < groups.length; x++) {
    if (randomNumber(0, 10) <= 2) {
      console.log(groups[x].label + " should maneuver")
      groups[x].maneuvers = true;
    }
    const BRAA = getBR(state.bluePos.x, state.bluePos.y, {x:groups[x].x, y:groups[x].y})
    groups[x].desiredHeading = parseInt(BRAA.bearing)
    console.log(BRAA.bearing)
  }
  continueAnimation = true;
  doAnimation(canvas, props, state, groups, animateCanvas, resetCallback);
}
  
  