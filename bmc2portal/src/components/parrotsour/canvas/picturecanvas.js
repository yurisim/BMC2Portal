import React from 'react'

import Canvas from './canvas.js'

export default class PictureCanvas extends React.Component {

    draw(context, frameCount, canvas){
        console.log("draw")
        context.beginPath()
        context.arc(100, 75, 50, 0, 2 * Math.PI);
        context.stroke()
    }

    render(){
        return <Canvas 
            draw={this.draw} 
            height={this.props.height} 
            width={this.props.width} 
            braaFirst={this.props.braaFirst} />
    }
}