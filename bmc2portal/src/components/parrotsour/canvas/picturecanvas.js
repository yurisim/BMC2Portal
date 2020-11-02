import React from 'react'

import Canvas from './canvas.js'

import {randomNumber} from '../utils/mathutilities.js'

export default class PictureCanvas extends React.Component {

    constructor(){
        super()
        this.state = {
            bullseye:undefined
        }
    }

    drawBullseye = (canvas, context) => {
        context.lineWidth = 1;

        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.beginPath();
      
        var boundLeftX = canvas.width * 0.33;
        var boundRightX = canvas.width * 0.66;
      
        var boundLeftY = canvas.height * 0.33;
        var boundRightY = canvas.height * 0.66;
      
        var centerPointX = randomNumber(boundLeftX, boundRightX);
        var centerPointY = randomNumber(boundLeftY, boundRightY);
      
        context.beginPath();
        context.arc(centerPointX, centerPointY, 2, 0, 2 * Math.PI, true);
        context.stroke();
        context.fill();
      
        context.moveTo(centerPointX, centerPointY + 4);
        context.lineTo(centerPointX, centerPointY - 4);
        context.stroke();
        context.stroke();
      
        context.moveTo(centerPointX + 4, centerPointY);
        context.lineTo(centerPointX - 4, centerPointY);
        context.stroke();
        context.stroke();
      
        return {x: centerPointX, y:centerPointY}
    }


    drawNewPic = () => {
        var answer = "";
        var selectedType = this.props.picType //(document.getElementById('pictureType') && document.getElementById("pictureType").value) || "";
      
        console.log("new pic:", selectedType)
        // answer = drawPicture(
        //   cfg.format,
        //   selectedType,
        //   cfg.bullseye,
        //   cfg.showMeasurements,
        //   undefined,
        //   cfg.hardMode,
        //   (selectedType ==="leading edge" || selectedType ==="package"),
        //   undefined, 
        //   cfg.isEW
        // );
      
        // var answerDiv = document.getElementById("answerDiv");
        // if (answerDiv) {
        //   answerDiv.innerHTML = answer.picture.pic;
        //   answerDiv.style.display = "none"; 
        // }
      
        //groups = answer.picture.groups;
        //animateCanvas = answer.imageData;
        //bluePos = answer.bluePos;
    }

    draw = (context, frameCount, canvas) => {
        var bullseye = this.drawBullseye(canvas, context)

        this.drawNewPic(bullseye)
        this.setState({bullseye})
    }

    render(){
        return <Canvas 
            draw={this.draw} 
            height={this.props.height} 
            width={this.props.width} 
            braaFirst={this.props.braaFirst}
            bullseye={this.state.bullseye}
            picType={this.props.picType} />
    }
}