import React, {useRef, useState, useEffect, Ref } from 'react'

import { getBR } from '../utils/mathutilities.js'
import { BRAA, Bullseye } from './interfaces'
import { drawText, drawLine } from './draw'

interface CanvasProps {
    draw: Function,
    height: number,
    width: number,
    braaFirst: boolean,
    bullseye: Bullseye,
    picType: string,
}

// TODO - remove :any as descriptors
function Canvas(props: CanvasProps) {
    const { draw, height, width, braaFirst, bullseye, picType, ...rest } =  props

    const canvasRef = useRef(new HTMLCanvasElement())
    let ctx: any = null
    let img: any = null

    const [mouseStart, setStart] = useState({x:0,y:0})
    const [mousePressed, setMousePressed] = useState(false)
    
    useEffect(()=>{
        const canvas: HTMLCanvasElement = canvasRef.current

        if (canvas !== null){
            ctx = canvas.getContext("2d")

            canvas.height = height;
            canvas.width = width;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            let frameCount = 0
            // let animationFrameId
            
            const render = () =>{
                frameCount++
                draw(ctx, frameCount, canvas)
                //animationFrameId = window.requestAnimationFrame(render)
            }

            render()

            img = getImageData()

            return () =>{
                //window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [draw, height, width, braaFirst, picType])

    let getImageData = () =>{
        if (ctx)
            return ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    let getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function drawBR(startX: number, startY: number, bull: BRAA, color: string, showMeasurements: boolean) {
        if (showMeasurements) {
          drawText(canvasRef.current, ctx, bull.bearing + "/" + bull.range, startX, startY, 11, color);
        }
    }

    function drawMouse(start: Bullseye, end: Bullseye, isDown: boolean) {
        if (isDown) {
          drawLine(ctx, start.x, start.y, end.x, end.y);
        }

        var startPoint = { x: start.x, y: start.y };
        var BRAA: BRAA = getBR(end.x, end.y, startPoint);
        if (end.y<20) end.y=20
        var bull: BRAA = getBR(end.x, end.y, bullseye)

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

    let canvasMouseDown = function(e: any) {
        setMousePressed(true)
        var mousePos = getMousePos(canvasRef.current, e);
        setStart(mousePos)
    };

    let canvasMouseMove = (e: any) =>{
        var mousePos = getMousePos(canvasRef.current, e)
        ctx.putImageData(img, 0, 0);
        drawMouse(mouseStart, mousePos, mousePressed)
    }

    let canvasMouseUp = (e: any) =>{
        setMousePressed(false)
        ctx.putImageData(img, 0, 0)
    }

    let canvasTouchStart = (e: any) => {
        var touch = e.changedTouches[0]
        canvasMouseDown({clientX: touch.clientX, clientY:touch.clientY})
    }

    let canvasTouchMove = (e: any) => {
        var touch = e.changedTouches[0]
        canvasMouseMove({clientX: touch.clientX, clientY:touch.clientY})
    }

    let canvasTouchEnd = (e: any) => {
        canvasMouseUp(null)
    }

    let style={
        touchAction:"none",
        backgroundColor:"white",
        width:{width}+"px",
        height: "400px",
        border:"1px solid #000000"
    }

    let moveProps = {
        onMouseDown:canvasMouseDown,
        onMouseMove:canvasMouseMove,
        onMouseUp:canvasMouseUp,
        onTouchStart:canvasTouchStart,
        onTouchMove:canvasTouchMove,
        onTouchEnd:canvasTouchEnd,
    }
    return <canvas {...moveProps} style={style} ref={canvasRef => (canvasRef = canvasRef as HTMLCanvasElement)} {...rest} />
}

export default Canvas