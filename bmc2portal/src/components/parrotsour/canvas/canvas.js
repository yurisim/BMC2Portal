import React, {useRef, useEffect} from 'react'

const Canvas = props => {
    const { draw, ...rest } =  props
    const canvasRef = useRef(null)

    useEffect(()=>{
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        let frameCount = 0
        let animationFrameId
        
        const render = () =>{
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }

        render()

        return () =>{
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    let style={
        touchAction:"none",
        backgroundColor:"white",
        width:"800px",
        height: "400px",
        border:"1px solid #000000"
    }

    return <canvas style={style} ref={canvasRef} {...rest} />
}

export default Canvas