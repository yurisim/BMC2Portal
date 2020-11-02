import React from 'react'

import Canvas from './canvas.js'

import {randomNumber} from '../utils/mathutilities.js'

type PicCanvasProps = {
    height: number,
    width: number,
    picType: string,
    orientation: string,
    braaFirst: boolean,
    format:string,
    showMeasurements:boolean,
    isHardMode: boolean,
}

type Bullseye = {
    x: number,
    y: number,
} | null

type PicCanvasState = {
    bullseye: Bullseye
    bluePos: Bullseye
}

type drawAnswer = {
    pic: string,
    groups: any[]
}

interface DrawFunction {
    (bullseye: Bullseye,
    bluePos: Bullseye, 
    start: Bullseye): drawAnswer
}

export default class PictureCanvas extends React.Component<PicCanvasProps, PicCanvasState> {

    constructor(props: any){
        super(props)
        this.state = {
            bullseye: {x:0, y:0},
            bluePos: null
        }
    }

    functions: { [key:string]: Function } = {
        "azimuth": this.drawEmpty,
        "ladder": this.drawEmpty,
        "wall": this.drawEmpty,
        "random": this.drawEmpty,
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

    drawArrow = (numContacts: number, x: number, y: number, heading: number, color:string) => {
        console.log("draw arrows")
    }

    drawEmpty(){}

    drawAzimuth: DrawFunction = (bullseye: Bullseye, bluePos: Bullseye, start: Bullseye) => {
        
        console.log("showMeasure:", this.props.showMeasurements)
        console.log("hardMode:", this.props.isHardMode)
        console.log("orient:", this.props.orientation)
        return {
            pic: "",
            groups: [0]
        }
    }
    
    drawPicture = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        
        var isLeadEdge = (this.props.picType === "leading edge" || this.props.picType === "package")

        var type = (this.props.picType ==="random" ? this.getRandomPicType(isLeadEdge) : this.props.picType)
       
        if (this.state.bluePos === undefined){
          var xPos = canvas.width-20
          var yPos = randomNumber(canvas.height * 0.33, canvas.height *0.66)
          var heading = 270
          if (this.props.orientation === "NS"){
            xPos = randomNumber(canvas.width * 0.33, canvas.width * 0.66);
            yPos = 20;
            heading = 180;
          }
          var bluePos = this.drawArrow(4, xPos,yPos, heading,"blue");
        } 

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
        var drawFunc = this.functions[type];
        if (drawFunc === undefined) drawFunc = this.drawAzimuth;
      
        var answer = drawFunc(canvas, context);
      
        return {
          picture: answer,
          imageData: imageData,
          bluePos: bluePos
        };
      }

    drawNewPic = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        var selectedType = this.props.picType 
      
        console.log("new pic:", selectedType)

        var answer = this.drawPicture(
            canvas,
            context
        )
      
        // var answerDiv = document.getElementById("answerDiv");
        // if (answerDiv) {
        //   answerDiv.innerHTML = answer.picture.pic;
        //   answerDiv.style.display = "none"; 
        // }
      
        //groups = answer.picture.groups;
        //animateCanvas = answer.imageData;
        //bluePos = answer.bluePos;
    }

    draw = (context: CanvasRenderingContext2D, frameCount: number, canvas: HTMLCanvasElement) => {
        var bullseye = this.drawBullseye(canvas, context)
        this.setState({bullseye})
        this.drawNewPic(canvas, context)
    }

    render(){
        return <Canvas 
            draw={this.draw} 
            height={this.props.height} 
            width={this.props.width} 
            braaFirst={this.props.braaFirst}
            bullseye={this.state.bullseye}
            picType={this.props.picType} />
    }
}