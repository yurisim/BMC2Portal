import React, {useRef, useState, useEffect, ReactElement, TouchEvent } from 'react'

import { getBR } from '../utils/mathutilities'
import { BRAA, Bullseye } from '../utils/interfaces'
import { drawLine, drawBR } from './draw/drawutils'
import { getContinueAnimate } from './draw/intercept/animate'

export interface CanvasDrawFunction {
    (context: CanvasRenderingContext2D|null|undefined, frameCount: number, canvas: HTMLCanvasElement):Promise<void>
}

interface CanvasMouseEvent {
    clientX:number,
    clientY:number,
}

interface CanvasProps {
    draw: CanvasDrawFunction,
    height: number,
    width: number,
    braaFirst: boolean,
    bullseye: Bullseye,
    picType: string,
    showMeasurements: boolean,
    isHardMode: boolean,
    newPic: boolean,
    animate: boolean,
    resetCallback: () => void,
    animateCallback: () => void
}

/**
 * This Component is the root wrapper for a Canvas HTML5 element
 * @param props CanvasProps for use by the component
 */
function Canvas(props: CanvasProps):ReactElement {
    // These Refs are used to store References to the current elements
    const canvasRef: React.RefObject<HTMLCanvasElement>|null = useRef<HTMLCanvasElement>(null)
    const ctx: React.MutableRefObject<CanvasRenderingContext2D|null|undefined>= useRef(null)
    const img: React.MutableRefObject<ImageData|null|undefined> = useRef(null)

    // These state variables are used to track mouse position
    const [mouseStart, setStart] = useState({x:0,y:0})
    const [mousePressed, setMousePressed] = useState(false)
    const [wasAnimate, setWasAnimate] = useState(false)
   
    // Get the ImageData from the canvas context
    const getImageData = () =>{
        if (ctx.current && canvasRef && canvasRef.current)
            return ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    // These values are used by useEffect to trigger a 'draw'
    const { draw, height, width, braaFirst, bullseye, picType, showMeasurements, isHardMode, newPic, ...rest } =  props

    // useEffect is a React hook called when any of the trigger props changes
    useEffect(()=>{
        const canvas: HTMLCanvasElement|null = canvasRef.current

        if (canvas !== null){
            // Set up the canvas and establish references
            ctx.current = canvas.getContext("2d")
            canvas.height = height;
            canvas.width = width;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            let frameCount = 0
            // let animationFrameId
        
            // Trigger the parent render ('draw' from props)
            const render = async () =>{
                frameCount++
                await draw(ctx.current, frameCount, canvas)
                //animationFrameId = window.requestAnimationFrame(render)
            }

            // Post render, store the current ImageData as a snapshot
            render().then(()=>{
                img.current = getImageData()
            })

            return () =>{
                //window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [draw, height, width, braaFirst, picType, showMeasurements, newPic, isHardMode])

    /**
     * Get the mouse position given the event relative to canvas
     * @param canvas the drawing canvas element
     * @param evt mouse event containing mouse {x,y} relative to canvas
     */
    const getMousePos = (canvas: HTMLCanvasElement|null, evt: CanvasMouseEvent): Bullseye=> {
        if (canvas){
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        } else {
            return {
                x: 0,
                y: 0,
            }
        }
    }

    /**
     * Draws bullseye and/or BRAAseye line 
     * @param start start mouse position
     * @param end end mouse position
     * @param isDown true to draw BRAAseye, false to draw just bullseye hover
     */
    function drawMouse(start: Bullseye, end: Bullseye, isDown: boolean) {
        if (isDown && ctx.current) {
          drawLine(ctx.current, start.x, start.y, end.x, end.y);
        }

        const startPoint = { x: start.x, y: start.y };
        const BRAA: BRAA = getBR(end.x, end.y, startPoint);
        if (end.y<20) end.y=20
        const bull: BRAA = getBR(end.x, end.y, bullseye)

        if (canvasRef && canvasRef.current && ctx.current){
            if (props.braaFirst) {
                if (isDown){
                    drawBR(canvasRef.current, ctx.current, end.x-50, end.y-11, BRAA, "blue", true)
                }
                drawBR(canvasRef.current, ctx.current, end.x-50, end.y, bull, "black", true)
            } else {
                if (isDown){
                    drawBR(canvasRef.current, ctx.current, end.x-50, end.y, BRAA, "blue", true)
                }
                drawBR(canvasRef.current, ctx.current, end.x-50, end.y-11, bull, "black", true)
            }
        }
    }

    /**
     * Called when mouse enters canvas. Stores image data before mouse draws
     */
    const onMouseEnter = function() {
        img.current = getImageData()
    }

    /**
     * Called when mouse is pressed. Sets starting mouse position for 
     * Braaseye start point.
     * @param e CanvasMouseEvent with mouse position
     */
    const canvasMouseDown = function(e: CanvasMouseEvent) {
        setWasAnimate(props.animate)
        setMousePressed(true)
        const { resetCallback } = props
        if (resetCallback) { 
            resetCallback()
        }

        if (getContinueAnimate()){
            img.current = getImageData()
        }
        const mousePos = getMousePos(canvasRef.current, e);
        setStart(mousePos)
    };

    /**
     * Called when the mouse leaves the canvas.
     * Restore the imagedata (w/o line draws).
     */
    const onMouseLeave = ()=>{
        if (ctx.current && img.current) 
            ctx.current.putImageData(img.current, 0, 0);
    }

    /**
     * Called when the mouse moves on the canvas.
     * Draws the appropriate information on the canvas.
     * @param e CanvasMouseEvent containing mouse position
     */
    const canvasMouseMove = (e: CanvasMouseEvent) =>{
        const mousePos = getMousePos(canvasRef.current, e)
        if (ctx.current && img.current) 
            ctx.current.putImageData(img.current, 0, 0);
        drawMouse(mouseStart, mousePos, mousePressed)
    }

    /**
     * Called when the mouse is released.
     * Restores previous ImageData.
     */
    const canvasMouseUp = () =>{
        setMousePressed(false)
        if (ctx.current && img.current)
            ctx.current.putImageData(img.current, 0, 0)
        const { animateCallback } = props
        if (wasAnimate){
            animateCallback()
        }
    }

    /**
     * Called when a touch event (down press) registred on canvas. 
     * Converts touch event to CanvasMouseEvent for processing.
     * @param e TouchEvent containing touch location
     */
    const canvasTouchStart = (e: TouchEvent) => {
        const touch = e.changedTouches[0]
        canvasMouseDown({clientX: touch.clientX, clientY:touch.clientY})
    }

    /**
     * Called when a TouchEvent (move) is registered on canvas
     * Converts TouchEvent to MouseEvent for processing
     * @param e TouchEvent containing touch location
     */
    const canvasTouchMove = (e: TouchEvent) => {
        const touch = e.changedTouches[0]
        canvasMouseMove({clientX: touch.clientX, clientY:touch.clientY})
    }

    const style={
        touchAction:"none",
        backgroundColor:"white",
        width:{width}+"px",
        height: "400px",
        border:"1px solid #000000"
    }

    const moveProps = {
        onMouseDown:canvasMouseDown,
        onMouseMove:canvasMouseMove,
        onMouseUp:canvasMouseUp,
        onTouchStart:canvasTouchStart,
        onTouchMove:canvasTouchMove,
        onTouchEnd:canvasMouseUp,
        onMouseOver:onMouseEnter,
        onMouseLeave:onMouseLeave
    }

    return (
    <div style={{display:"block",textAlign:"center"}}>
        <canvas id="pscanvas" {...moveProps} style={style} ref={canvasRef} {...rest} />
    </div>
    )
}

export default Canvas