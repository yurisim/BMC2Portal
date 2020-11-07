import React from 'react'

import Canvas from './canvas'

import {randomNumber } from '../utils/mathutilities'
import { drawArrow } from './draw/drawutils'
import { Bullseye, drawAnswer, DrawFunction } from './interfaces'
import { drawAzimuth, drawBullseye, drawChampagne, drawLadder, drawLeadEdge, drawPackage, drawRange, drawVic, drawWall } from './draw/intercept/picturedraw'
import { drawThreat } from './draw/intercept/threatdraw'
import { drawCap } from './draw/intercept/capdraw'
import { drawEA } from './draw/intercept/eadraw'
import { drawPOD } from './draw/intercept/poddraw'

export type PicCanvasProps = {
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

export type PicCanvasState = {
    bullseye: Bullseye
    bluePos: Bullseye|undefined,
    reDraw: Function,
}

export default class PictureCanvas extends React.Component<PicCanvasProps, PicCanvasState> {

    constructor(props: any){
        super(props)
        this.state = {
            bullseye: {x:0, y:0},
            bluePos: undefined,
            reDraw: this.drawPicture,
        }
    }

    getRandomPicType = (leadingEdge: boolean) => {
        var numType = randomNumber(0,(leadingEdge)? 7 : 9)
        var types = ["azimuth", "range", "vic", "wall","ladder", "champagne", "cap","leading edge","package"];
        return types[numType];
    }
    
    drawPicture = async (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, forced?: boolean, start?: Bullseye) => {
        
        var isLeadEdge = (this.props.picType === "leading edge" || this.props.picType === "package" || this.props.picType==="ea")

        var type = "azimuth"
        if (forced) {
            type = this.getRandomPicType(true)
        } else {
            type = ((this.props.picType ==="random") ? this.getRandomPicType(isLeadEdge) : this.props.picType)
        }
      
        var drawFunc:DrawFunction = this.functions[type];
        if (drawFunc === undefined) drawFunc = drawAzimuth;
      
        var answer = await drawFunc(canvas, context, this.props, this.state, start);

        return answer
    }

    functions: { [key:string]: DrawFunction } = {
        "azimuth": drawAzimuth,
        "range": drawRange,
        "ladder" : drawLadder,
        "wall" : drawWall,
        "vic": drawVic,
        "champagne":drawChampagne,
        "cap": drawCap,
        "threat": drawThreat,
        "ea": drawEA,
        "pod": drawPOD,
        "leading edge": drawLeadEdge,
        "package": drawPackage,
    }

    draw = async (context: CanvasRenderingContext2D, frameCount: number, canvas: HTMLCanvasElement) => {
        var bullseye = drawBullseye(canvas, context)

        var xPos = canvas.width-20
        var yPos = randomNumber(canvas.height * 0.33, canvas.height *0.66)
        var heading = 270
        if (this.props.orientation === "NS"){
            xPos = randomNumber(canvas.width * 0.33, canvas.width * 0.66);
            yPos = 20;
            heading = 180;
        }
        
        var bluePos = drawArrow(canvas, this.props.orientation, 4, xPos, yPos, heading, "blue");
        await this.setState({bluePos, bullseye})
        
        var answer: drawAnswer = await this.drawPicture(canvas, context)

        this.props.setAnswer(answer.pic)
        
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