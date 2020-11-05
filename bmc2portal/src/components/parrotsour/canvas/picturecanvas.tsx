import React from 'react'

import Canvas from './canvas'

import {randomNumber, randomHeading, getBR, getAltStack, getTrackDir} from '../utils/mathutilities'
import { drawAltitudes, drawArrow, drawBraaseye, drawMeasurement, formatGroup, getGroupOpenClose } from './draw'
import { Group, Bullseye, Braaseye, AltStack } from './interfaces'

type PicCanvasProps = {
    height: number,
    width: number,
    picType: string,
    orientation: string,
    braaFirst: boolean,
    format:string,
    showMeasurements:boolean,
    isHardMode: boolean,
    setAnswer: Function,
    newPic: boolean,
}

type PicCanvasState = {
    bullseye: Bullseye
    bluePos: Bullseye|undefined,
}

type drawAnswer = {
    pic: string,
    groups: any[]
}

interface DrawFunction {
    (canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    //bullseye: Bullseye,
    //bluePos: Bullseye, 
    start?: Bullseye
    ): drawAnswer
}

export default class PictureCanvas extends React.Component<PicCanvasProps, PicCanvasState> {

    constructor(props: any){
        super(props)
        this.state = {
            bullseye: {x:0, y:0},
            bluePos: undefined
        }
    }

    getRandomPicType = (leadingEdge: boolean) => {
        var numType = randomNumber(0,(leadingEdge)? 7 : 9)
        var types = ["azimuth", "range", "vic", "wall","ladder", "champagne", "cap","leading edge","package"];
        return types[numType];
    }

    drawBullseye = (canvas:HTMLCanvasElement, context:CanvasRenderingContext2D) => {
        context.lineWidth = 1;

        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.beginPath();
      
        var boundLeftX = canvas.width * 0.33;
        var boundRightX = canvas.width * 0.66;
      
        var boundLeftY = canvas.height * 0.33;
        var boundRightY = canvas.height * 0.66;
      
        var centerPointX = randomNumber(boundLeftX, boundRightX);
        var centerPointY = randomNumber(boundLeftY, boundRightY);
      
        context.beginPath();
        context.arc(centerPointX, centerPointY, 2, 0, 2 * Math.PI, true);
        context.stroke();
        context.fill();
      
        context.moveTo(centerPointX, centerPointY + 4);
        context.lineTo(centerPointX, centerPointY - 4);
        context.stroke();
        context.stroke();
      
        context.moveTo(centerPointX + 4, centerPointY);
        context.lineTo(centerPointX - 4, centerPointY);
        context.stroke();
        context.stroke();
      
        return {x: centerPointX, y:centerPointY}
    }

    drawAzimuth: DrawFunction = (
        canvas: HTMLCanvasElement,
        ctx:CanvasRenderingContext2D,
        //bullseye: Bullseye,
        //bluePos: Bullseye,
        start?: Bullseye) => {
        console.log("showMeasure:", this.props.showMeasurements)
        console.log("hardMode:", this.props.isHardMode)
        console.log("orient:", this.props.orientation)
        
        var startY:number = (start && start.y) || randomNumber(canvas.height * 0.20, canvas.height * 0.7);
        var startX:number = (start && start.x) || randomNumber(canvas.width * 0.20, !this.props.orientation ? canvas.width * 0.6: canvas.width * 0.6);
        
        var incr:number = canvas.width / (canvas.width / 10);
        var distance:number = randomNumber(3.5 * incr, 10 * incr);

        var heading:number = randomHeading(this.props.format);
        var ng:Group = drawArrow( canvas, randomNumber(1, 4), startX, startY, heading + randomNumber(-10,10), this.props.orientation);
        
        if (this.props.isHardMode) heading = randomHeading(this.props.format);
        
        var sg:Group
        if (this.props.orientation==="NS") {
            sg = drawArrow( canvas, randomNumber(1, 4), startX, startY + distance, heading + randomNumber(-10,10), this.props.orientation);
        } else {
            sg = drawArrow( canvas, randomNumber(1, 4), startX + distance, startY, heading + randomNumber(-10,10), this.props.orientation);
        }

        distance = getBR( ng.x, ng.y, {x:sg.x, y:sg.y}).range * 4

        drawMeasurement(canvas, ctx, ng.x, ng.y + 2, sg.x, sg.y + 2, distance, this.props.showMeasurements);

        var offsetX:number = 0;
        var offsetY:number = 0;
        var offsetX2:number = 0;
        var offsetY2:number = 0;
        if (this.props.orientation === "EW"){
            offsetX = -60;
            offsetY = 40;
            offsetX2 = 10;
            offsetY2 = 10;
        } 
        
        drawAltitudes(canvas, ctx, ng.x + 20 + offsetX, ng.y - 11 +offsetY, ng.z);
        drawAltitudes(canvas, ctx, sg.x + 20 + offsetX2, sg.y - 11 + offsetY2, sg.z);
        
        if (!this.state.bluePos) { return { pic: "", groups: []} }

        var ngBraaseye: Braaseye = drawBraaseye(canvas, ctx, this.state.bluePos, ng, this.state.bullseye, this.props.showMeasurements, this.props.braaFirst, offsetX, offsetY);
        var sgBraaseye: Braaseye = drawBraaseye(canvas, ctx, this.state.bluePos, sg, this.state.bullseye, this.props.showMeasurements, this.props.braaFirst, offsetX2, offsetY2);

        var ngAlts: AltStack = getAltStack(ng.z, this.props.format);
        var sgAlts: AltStack = getAltStack(sg.z, this.props.format);

        var trackDir: string = getTrackDir(heading);

        var width: number = Math.floor(distance / 4);

        var includeBull: boolean = false;
        if (width >= 10 && this.props.format !== "ipe") {
            includeBull = true;
        }
        
        var sameTrackDir = (getTrackDir(ng.heading) === getTrackDir(sg.heading));
        var answer = "TWO GROUPS AZIMUTH " + width + " ";

        answer += getGroupOpenClose(ng, sg) + " ";

        var getEchX = getBR(sg.x, ng.y, {x: ng.x, y: ng.y}).range
        var getEchY = getBR(ng.x, sg.y, {x:ng.x, y:ng.y}).range
        if ((this.props.orientation==="NS" && getEchX > 5) || (this.props.orientation==="EW" && getEchY > 5)){
            if (ngBraaseye.braa.range < sgBraaseye.braa.range) {
                
            answer += " ECHELON " + getTrackDir(parseInt(getBR(sg.x, sg.y, {x:ng.x, y:ng.y}).bearing))+ ", "
            } else {
            answer += " ECHELON " + getTrackDir(parseInt(getBR(ng.x, ng.y, {x:sg.x, y:sg.y}).bearing))+ ", "
            }
        }

        if (this.props.format !== "ipe" && sameTrackDir){
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
        
        if (anchorN){
            if (this.props.orientation === "EW"){
            answer += formatGroup("WEST", ngBraaseye, ngAlts, ng.numContacts, true, sameTrackDir ? undefined : getTrackDir(ng.heading));
            answer += " " + formatGroup("EAST", sgBraaseye, sgAlts, sg.numContacts, includeBull, sameTrackDir ? undefined: getTrackDir(sg.heading));
            } else {
            answer += formatGroup("SOUTH", sgBraaseye, sgAlts, sg.numContacts, true, sameTrackDir ? undefined: getTrackDir(sg.heading));
            answer += " " + formatGroup("NORTH", ngBraaseye, ngAlts, ng.numContacts, includeBull, sameTrackDir ? undefined : getTrackDir(ng.heading));
            }
        } else {
            if (this.props.orientation){
            answer += formatGroup("EAST", sgBraaseye, sgAlts, sg.numContacts, true, sameTrackDir ? undefined: getTrackDir(sg.heading));
            answer += " " + formatGroup("WEST", ngBraaseye, ngAlts, ng.numContacts, includeBull, sameTrackDir ? undefined : getTrackDir(ng.heading));
            } else {
            answer += formatGroup("NORTH", ngBraaseye, ngAlts, ng.numContacts, true, sameTrackDir ? undefined : getTrackDir(ng.heading));
            answer += " " + formatGroup("SOUTH", sgBraaseye, sgAlts, sg.numContacts, includeBull, sameTrackDir ? undefined: getTrackDir(sg.heading));
            }
        }

        if (this.props.orientation === "EW"){
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
    
    drawPicture = async (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        
        var isLeadEdge = (this.props.picType === "leading edge" || this.props.picType === "package")

        var type = (this.props.picType ==="random" ? this.getRandomPicType(isLeadEdge) : this.props.picType)
      
        var drawFunc:DrawFunction = this.functions[type];
        if (drawFunc === undefined) drawFunc = this.drawAzimuth;
      
        var answer = await drawFunc(canvas, context);

        return {
          picture: answer,
        };
    }

    functions: { [key:string]: DrawFunction } = {
        "azimuth": this.drawAzimuth,
        "ladder": this.drawAzimuth,
        "wall": this.drawAzimuth,
        "random": this.drawAzimuth,
        // "ladder" : drawLadder,
        // "wall" : drawWall,
        // "azimuth": drawAzimuth,
        // "range": drawRange,
        // "vic": drawVic,
        // "champagne":drawChampagne,
        // "cap": drawCapLocal,
        // "threat": drawThreatLocal,
        // "ea": drawEA,
        // "pod": drawPOD,
        // "leading edge": drawLeadEdge,
        // "package": drawPackage,
    }

    draw = async (context: CanvasRenderingContext2D, frameCount: number, canvas: HTMLCanvasElement) => {
        var bullseye = this.drawBullseye(canvas, context)

        var xPos = canvas.width-20
        var yPos = randomNumber(canvas.height * 0.33, canvas.height *0.66)
        var heading = 270
        if (this.props.orientation === "EW"){
            xPos = randomNumber(canvas.width * 0.33, canvas.width * 0.66);
            yPos = 20;
            heading = 180;
        }
            
        var bluePos = drawArrow(canvas, 4, xPos, yPos, heading, this.props.orientation, "blue");
        await this.setState({bluePos, bullseye})
        
        var answer = await this.drawPicture(canvas, context)

        this.props.setAnswer(answer.picture.pic)
      
        //groups = answer.picture.groups;
        //animateCanvas = answer.imageData;
    }

    render(){
        return <Canvas 
            draw={this.draw} 
            height={this.props.height} 
            width={this.props.width} 
            braaFirst={this.props.braaFirst}
            bullseye={this.state.bullseye}
            picType={this.props.picType}
            showMeasurements={this.props.showMeasurements}
            isHardMode={this.props.isHardMode}
            newPic={this.props.newPic}
        />
    }
}