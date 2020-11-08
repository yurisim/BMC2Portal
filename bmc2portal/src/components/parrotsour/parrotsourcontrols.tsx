import React, { ChangeEvent, ReactElement } from 'react'

import {Dialog, DialogContent, DialogContentText} from '@material-ui/core'

interface PSCProps {
    handleSliderChange: {(val: number):void},
    startAnimate: {():void}
    pauseAnimate: {():void},
    braaChanged: {():void},
    modifyCanvas: {():void}
}

interface PSCState {
    speedSliderValue: number,
    showHelpText: boolean
}

export default class ParrotSourControls extends React.Component<PSCProps, PSCState> {

    constructor(props:PSCProps){
        super(props)
        this.state = {
            speedSliderValue: 50,
            showHelpText: false,
        }
    }

    handleSliderChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const val = parseInt(evt.currentTarget.value)
        this.setState({speedSliderValue: val})
        this.props.handleSliderChange(val)
    }

    fightsOn = ():void => {
        this.props.startAnimate()
    }

    pauseFight = ():void =>{
        this.props.pauseAnimate()
        console.log("Fight is Paused")
    }

    toggleHelp = ():void => {
        this.setState({showHelpText: !this.state.showHelpText})
    }
    handleHelpClose = ():void =>{
        this.setState({showHelpText: false})
    }

    render(): ReactElement{
        return(
            <div>
                <div style={{display:"inline"}}>
                    <button id="fightsOn" style={{marginBottom:"20px",width:"100px", marginRight:"10px"}} onClick={this.fightsOn} >
                        Fights On
                    </button>
                    <button id="pause" style={{marginBottom:"20px", width:"100px"}} onClick={this.pauseFight}>
                        Pause
                    </button>
                    <div style={{display:"inline", marginLeft:"50px"}} className="slidecontainer">
                        <label htmlFor="speedSlider"> Animation Speed: </label>
                        <input 
                            type="range"
                            min="1"
                            max="100"
                            value={this.state.speedSliderValue}
                            className="slider-color"
                            id="speedSlider"
                            onChange={this.handleSliderChange} />
                    </div>
                </div>

                <div style={{display:"inline-flex", marginBottom:"10px"}}> 
                    <div>
                        <label style={{float:"left", paddingRight:"10px"}}> 
                            Orientation: 
                        </label>
                        <label className="switch">
                            <input type="checkbox" id="orientation" onChange={this.props.modifyCanvas} />
                            <span className="slider round"><span className="on">N/S</span><span className="off">E/W</span></span>
                        </label>
                    </div>
                    <div>
                        <label style={{float:"left", paddingLeft:"75px", paddingRight:"10px"}}> 
                            Display first: 
                        </label>
                        <label className="switch">
                            <input type="checkbox" id="cursordisp" defaultChecked onChange={this.props.braaChanged} />
                            <span className="slider round"><span className="on"> BRAA </span><span className="off"> BULL </span></span>
                        </label>
                        <button 
                            style={{padding:"0px", margin:"5px", float:"right"}}
                            className="helpicon"
                            id="btnDisplayAlert"
                            type="button"
                            onClick={this.toggleHelp}>
                                ?
                        </button>                
                        <Dialog
                            open={this.state.showHelpText}
                            onClose={this.handleHelpClose} >
                            <DialogContent>
                                <DialogContentText>
                                    This will change the order of the bullseye and braa measurements on screen.
                                </DialogContentText>
                                <DialogContentText>
                                    BULL = ALT, BULL, BRAA
                                </DialogContentText>
                                <DialogContentText>
                                    BRAA = ALT, BRAA, BULL
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>    
            </div>        
        )
    }
}
