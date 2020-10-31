import React from 'react'

import Canvas from './canvas.js'

export default class PictureCanvas extends React.Component {

    draw(){

    }

    render(){
        return <Canvas draw={this.draw} />
    }
}