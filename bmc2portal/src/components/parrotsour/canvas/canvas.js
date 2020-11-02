import React, {useRef, useState, useEffect} from 'react'

import { getBR } from '../utils/mathutilities.js'

const Canvas = props => {
    const { draw, height, width, braaFirst, ...rest } =  props

    const canvasRef = useRef(null)
    const ctx = useRef(null)
    const img = useRef(null)
    
    const [mouseStart, setStart] = useState({x:0,y:0})
    const [mousePressed, setMousePressed] = useState(false)
    
    useEffect(()=>{
        const canvas = canvasRef.current
        ctx.current = canvas.getContext("2d")

        canvas.height = height;
        canvas.width = width;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        let frameCount = 0
        // let animationFrameId
        
        const render = () =>{
            frameCount++
            draw(ctx.current, frameCount, canvas)
            //animationFrameId = window.requestAnimationFrame(render)
        }

        render()

        img.current = getImageData()

        return () =>{
            //window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw, height, width])

    let getImageData = () =>{
        return ctx.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    let getMousePos = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    let drawLine = function(startX, startY, endX, endY, color){
        color = color || "black";
        
        ctx.current.lineWidth = 1;
        ctx.current.strokeStyle = color;
        ctx.current.beginPath();
        ctx.current.moveTo(startX, startY);
        ctx.current.lineTo(endX, endY);
        ctx.current.stroke();
        ctx.current.stroke();
    }

    function clamp(pos) {
        return {
            x: Math.min(Math.max(pos.x, 0), canvasRef.current.width),
            y: Math.min(Math.max(pos.y, 0), canvasRef.current.height)}
    }

    function drawText(text, x, y, size, color) {
        size = size || 12;
        color = color || "black";
      
        ctx.current.lineWidth = 1;
        ctx.current.fillStyle = color;
        ctx.current.font = size + "px Arial";
        var pos = clamp({x,y})
        
        ctx.current.fillText(text, pos.x, pos.y);
    }

    function drawBR(startX, startY, bull, color, showMeasurements) {
        if (showMeasurements) {
          drawText(bull.bearing + "/" + bull.range, startX, startY, 11, color);
        }
    }

    function drawMouse(start, end, isDown, bullseye) {
        if (isDown) {
          drawLine(start.x, start.y, end.x, end.y);
        }

        var startPoint = { x: start.x, y: start.y };
        var BRAA = getBR(end.x, end.y, startPoint);
        if (end.y<20) end.y=20
        var bull = getBR(end.x, end.y, bullseye)

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

    let canvasMouseDown = function(e) {
        setMousePressed(true)
        var mousePos = getMousePos(canvasRef.current, e);
        setStart(mousePos)
    };

    let canvasMouseMove = (e) =>{
        var mousePos = getMousePos(canvasRef.current, e)
        ctx.current.putImageData(img.current, 0, 0);
        drawMouse(mouseStart, mousePos, mousePressed,{x:0,y:0})
    }

    let canvasMouseUp = (e) =>{
        setMousePressed(false)
        ctx.current.putImageData(img.current, 0, 0)
    }

    let canvasTouchStart = (e) => {
        var touch = e.changedTouches[0]
        canvasMouseDown({clientX: touch.clientX, clientY:touch.clientY})
    }

    let canvasTouchMove = (e) => {
        var touch = e.changedTouches[0]
        canvasMouseMove({clientX: touch.clientX, clientY:touch.clientY})
    }

    let canvasTouchEnd = (e) => {
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
    return <canvas {...moveProps} style={style} ref={canvasRef} {...rest} />
}

export default Canvas