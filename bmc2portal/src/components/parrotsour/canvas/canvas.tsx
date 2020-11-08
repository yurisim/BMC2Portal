import React, {useRef, useState, useEffect, ReactElement, TouchEvent } from 'react'

import { getBR } from '../utils/mathutilities'
import { BRAA, Bullseye } from './interfaces'
import { drawText, drawLine } from './draw/drawutils'

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
    newPic: boolean
}

// TODO - remove :any as descriptors
function Canvas(props: CanvasProps):ReactElement {
    const { draw, height, width, braaFirst, bullseye, picType, showMeasurements, isHardMode, newPic, ...rest } =  props

    const canvasRef: React.RefObject<HTMLCanvasElement>|null = useRef<HTMLCanvasElement>(null)
    const ctx: React.MutableRefObject<CanvasRenderingContext2D|null|undefined>= useRef(null)
    const img: React.MutableRefObject<ImageData|null|undefined> = useRef(null)

    const [mouseStart, setStart] = useState({x:0,y:0})
    const [mousePressed, setMousePressed] = useState(false)
   
    const getImageData = () =>{
        if (ctx.current && canvasRef && canvasRef.current)
            return ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    useEffect(()=>{
        const canvas: HTMLCanvasElement|null = canvasRef.current

        if (canvas !== null){
            ctx.current = canvas.getContext("2d")

            canvas.height = height;
            canvas.width = width;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            let frameCount = 0
            // let animationFrameId
            
            const render = async () =>{
                frameCount++
                await draw(ctx.current, frameCount, canvas)
                //animationFrameId = window.requestAnimationFrame(render)
            }

            render().then(()=>{
                img.current = getImageData()
            })

            return () =>{
                //window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [draw, height, width, braaFirst, picType, showMeasurements, newPic, isHardMode])

    const getMousePos = (canvas: HTMLCanvasElement|null, evt: {clientX:number,clientY:number}): Bullseye=> {
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

    function drawBR(startX: number, startY: number, bull: BRAA, color: string, showMeasurements: boolean) {
        if (showMeasurements && canvasRef && canvasRef.current && ctx.current) {
          drawText(canvasRef.current, ctx.current, bull.bearing + "/" + bull.range, startX, startY, 11, color);
        }
    }

    function drawMouse(start: Bullseye, end: Bullseye, isDown: boolean) {
        if (isDown && ctx.current) {
          drawLine(ctx.current, start.x, start.y, end.x, end.y);
        }

        const startPoint = { x: start.x, y: start.y };
        const BRAA: BRAA = getBR(end.x, end.y, startPoint);
        if (end.y<20) end.y=20
        const bull: BRAA = getBR(end.x, end.y, bullseye)

        if (props.braaFirst) {
            if (isDown){
                drawBR(end.x-50, end.y-11, BRAA, "blue", true)
            }
            drawBR(end.x-50, end.y, bull, "black", true)
        } else {
            if (isDown){
                drawBR(end.x-50, end.y, BRAA, "blue", true)
            }
            drawBR(end.x-50, end.y-11, bull, "black", true)
        }
      }

    const onMouseEnter = function() {
        img.current = getImageData()
    }

    const canvasMouseDown = function(e: CanvasMouseEvent) {
        setMousePressed(true)
        const mousePos = getMousePos(canvasRef.current, e);
        setStart(mousePos)
    };

    const onMouseLeave = ()=>{
        if (ctx.current && img.current) 
            ctx.current.putImageData(img.current, 0, 0);
    }

    const canvasMouseMove = (e: CanvasMouseEvent) =>{
        const mousePos = getMousePos(canvasRef.current, e)
        if (ctx.current && img.current) 
            ctx.current.putImageData(img.current, 0, 0);
        drawMouse(mouseStart, mousePos, mousePressed)
    }

    const canvasMouseUp = () =>{
        setMousePressed(false)
        if (ctx.current && img.current)
            ctx.current.putImageData(img.current, 0, 0)
    }

    const canvasTouchStart = (e: TouchEvent) => {
        const touch = e.changedTouches[0]
        canvasMouseDown({clientX: touch.clientX, clientY:touch.clientY})
    }

    const canvasTouchMove = (e: TouchEvent) => {
        const touch = e.changedTouches[0]
        canvasMouseMove({clientX: touch.clientX, clientY:touch.clientY})
    }

    const canvasTouchEnd = () => {
        canvasMouseUp()
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
        onTouchEnd:canvasTouchEnd,
        onMouseOver:onMouseEnter,
        onMouseLeave
    }

    return <canvas {...moveProps} style={style} ref={canvasRef} {...rest} />
}

export default Canvas