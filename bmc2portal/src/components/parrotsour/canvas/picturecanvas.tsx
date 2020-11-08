import React, { ReactElement } from 'react'

import Canvas from './canvas'

import {randomNumber } from '../utils/mathutilities'
import { drawArrow } from './draw/drawutils'
import { Bullseye, drawAnswer, DrawFunction } from './interfaces'
import { drawAzimuth, drawBullseye, drawChampagne, drawLadder, drawLeadEdge, drawPackage, drawRange, drawVic, drawWall } from './draw/intercept/picturedraw'
import { drawThreat } from './draw/intercept/threatdraw'
import { drawCap } from './draw/intercept/capdraw'
import { drawEA } from './draw/intercept/eadraw'
import { drawPOD } from './draw/intercept/poddraw'
import { animateGroups } from './draw/intercept/animate'

export type PicCanvasProps = {
    height: number,
    width: number,
    picType: string,
    orientation: string,
    braaFirst: boolean,
    format:string,
    showMeasurements:boolean,
    isHardMode: boolean,
    setAnswer: {(answer:string):void},
    newPic: boolean,
    animate:boolean,
    sliderSpeed: number
}

export type PicCanvasState = {
    bullseye: Bullseye
    bluePos: Bullseye|undefined,
    reDraw: any,
    answer:drawAnswer,
    canvas?:HTMLCanvasElement,
    animateCanvas?: ImageData,
}

export default class PictureCanvas extends React.Component<PicCanvasProps, PicCanvasState> {

    constructor(props: PicCanvasProps){
        super(props)
        this.state = {
            bullseye: {x:0, y:0},
            bluePos: undefined,
            reDraw: this.drawPicture,
            answer: {pic:"", groups:[]}
        }
    }

    componentDidUpdate = (prevProps: PicCanvasProps):void => {
        // eslint-disable-next-line
        var {animate, ...rest} = prevProps
        const oldAnimate = animate
        // eslint-disable-next-line
        var {animate, ...newrest} = this.props
        const newAnimate = animate
        // eslint-disable-next-line
        function areEqualShallow(a:any, b:any):boolean {
            for(const key in a) {
                if(!(key in b) || a[key] !== b[key]) {
                    return false;
                }
            }
            for(const key2 in b) {
                if(!(key2 in a) || a[key2] !== b[key2]) {
                    return false;
                }
            }
            return true;
        }
    
        if (areEqualShallow(rest, newrest) && oldAnimate !== newAnimate){    
            if (this.props.animate){
                console.log("initiating animation...")
                console.log(this.state.canvas)
                console.log(this.state.animateCanvas)
                if (this.state.canvas && this.state.animateCanvas){
                //   var context: any = this.state.canvas.getContext("2d")
                  animateGroups(this.state.canvas, this.props, this.state, this.state.answer.groups, this.state.animateCanvas);
                //   if (context !== undefined){
                //     this.setState({animateCanvas: context.getImageData(0, 0, this.state.canvas.width, this.state.canvas.height)})
                //   }
                }
            } else {
                console.log("pausing canvas")
            }
        }
    }

    getRandomPicType = (leadingEdge: boolean):string => {
        const numType = randomNumber(0,(leadingEdge)? 7 : 9)
        const types = ["azimuth", "range", "vic", "wall","ladder", "champagne", "cap","leading edge","package"];
        return types[numType];
    }
    
    drawPicture = async (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, forced?: boolean, start?: Bullseye):Promise<drawAnswer> => {
        
        const isLeadEdge = (this.props.picType === "leading edge" || this.props.picType === "package" || this.props.picType==="ea")

        let type = "azimuth"
        if (forced) {
            type = this.getRandomPicType(true)
        } else {
            type = ((this.props.picType ==="random") ? this.getRandomPicType(isLeadEdge) : this.props.picType)
        }
      
        let drawFunc:DrawFunction = this.functions[type];
        if (drawFunc === undefined) drawFunc = drawAzimuth;
      
        const answer = await drawFunc(canvas, context, this.props, this.state, start);

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

    draw = async (context: CanvasRenderingContext2D, frameCount: number, canvas: HTMLCanvasElement):Promise<void> => {
        const bullseye = drawBullseye(canvas, context)

        let xPos = canvas.width-20
        let yPos = randomNumber(canvas.height * 0.33, canvas.height *0.66)
        let heading = 270
        if (this.props.orientation === "NS"){
            xPos = randomNumber(canvas.width * 0.33, canvas.width * 0.66);
            yPos = 20;
            heading = 180;
        }
        
        const bluePos = drawArrow(canvas, this.props.orientation, 4, xPos, yPos, heading, "blue");
        await this.setState({bluePos, bullseye})
        
        const blueOnly = context.getImageData(0, 0, canvas.width, canvas.height)

        const answer: drawAnswer = await this.drawPicture(canvas, context)

        this.props.setAnswer(answer.pic)
        
        this.setState({canvas, answer, animateCanvas: blueOnly})
        //groups = answer.picture.groups;
        //animateCanvas = answer.imageData;
    }

    render(): ReactElement{
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