import React, { ReactElement } from 'react'

import Canvas from './canvas'

import {randomNumber } from '../utils/mathutilities'
import { drawArrow } from './draw/drawutils'
import { Bullseye, DrawAnswer, DrawFunction, Group } from '../../utils/interfaces'
import { drawAzimuth, drawBullseye, drawChampagne, drawLadder, drawLeadEdge, drawPackage, drawRange, drawVic, drawWall } from './draw/intercept/picturedraw'
import { drawThreat } from './draw/intercept/threatdraw'
import { drawCap } from './draw/intercept/capdraw'
import { drawEA } from './draw/intercept/eadraw'
import { drawPOD } from './draw/intercept/poddraw'
import { animateGroups, pauseFight } from './draw/intercept/animate'

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

export interface ReDrawFunction {
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, forced?: boolean, start?: Bullseye):DrawAnswer
}

export type PicCanvasState = {
    bullseye: Bullseye
    bluePos: Group|undefined,
    reDraw: ReDrawFunction,
    answer:DrawAnswer,
    canvas?:HTMLCanvasElement,
    animateCanvas?: ImageData,
}

/**
 * This component is the main control for drawing pictures for intercepts
 */
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

    /**
     * This lifecycle function serves as a check to make sure the only props
     * value that changed is the animation value (i.e. button pressed) so the 
     * animation is not re-triggered when any other prop value changes 
     * @param prevProps - previous set of PicCanvasProps
     */
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
                if (this.state.canvas && this.state.animateCanvas){
                  animateGroups(this.state.canvas, this.props, this.state, this.state.answer.groups, this.state.animateCanvas);
                }
            } else {
                console.log("pausing canvas")
                pauseFight(this.props.showMeasurements)
            }
        }
    }

    /**
     * Pick a random picture type for drawing
     * @param leadingEdge - true iff leading edge or packages. Set to true to avoid
     * recursive redraw
     */
    getRandomPicType = (leadingEdge: boolean):string => {
        const numType = randomNumber(0,(leadingEdge)? 7 : 9)
        const types = ["azimuth", "range", "vic", "wall","ladder", "champagne", "cap","leading edge","package"];
        return types[numType];
    }
    
    /**
     * Perform a picture draw on the canvas using the correct DrawFunction
     * @param canvas Canvas to draw on
     * @param context The context of the canvas
     * @param forced true iff picture type should be forced as random, !lead edge and !packages
     * @param start (optional) start position for the picture
     */
    drawPicture = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, forced?: boolean, start?: Bullseye):DrawAnswer => {
        
        const isLeadEdge = (this.props.picType === "leading edge" || this.props.picType === "package" || this.props.picType==="ea")

        let type = "azimuth"
        if (forced) {
            type = this.getRandomPicType(true)
        } else {
            type = ((this.props.picType ==="random") ? this.getRandomPicType(isLeadEdge) : this.props.picType)
        }
      
        let drawFunc:DrawFunction = this.functions[type];
        if (drawFunc === undefined) drawFunc = drawAzimuth;
      
        const answer = drawFunc(canvas, context, this.props, this.state, start);

        return answer
    }

    // A list of all avaiable functions
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

    /**
     * Draw function to be called from the Canvas component - handles pre-picture logic 
     * (i.e. blue arrows, bullseye, and image 'snap' for mouse draw)
     * @param context the Context to draw in
     * @param frameCount (unused) animation counter
     * @param canvas the Canvas element to draw in
     */
    draw = async (context: CanvasRenderingContext2D|null|undefined, frameCount: number, canvas: HTMLCanvasElement):Promise<void> => {
        if (context === null || context ===undefined) return
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

        const answer: DrawAnswer = await this.drawPicture(canvas, context)

        this.props.setAnswer(answer.pic)
        
        this.setState({canvas, answer, animateCanvas: blueOnly})
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