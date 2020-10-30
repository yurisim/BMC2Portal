import {Dialog, DialogContent, MenuItem, Select} from '@material-ui/core'
import React from 'react'

import '../../css/collapsible.css'
import '../../css/select.css'
import '../../css/slider.css'

import InterceptQT from './quicktips/interceptQT'
import ParrotSourHeader from './parrotsourheader'

export default class ParrotSourIntercept extends React.Component {

    constructor(){
        super()
        this.state = {
            showAlsaQT:false,
            speedSliderValue: 50,
        }
    }

    toggleAlsaQT = () =>{
        this.setState({showAlsaQT: !this.state.showAlsaQT})
    }
    handleAlsaQTClose = () =>{
        this.setState({showAlsaQT:false})
    }

    handleSliderChange = (evt) => {
        this.setState({speedSliderValue: evt.currentTarget.value})
    }

    formatSelChange = (fmt) =>{
        return () => {
            this.setState({format: fmt})
        }
    }

    showNewPic = () =>{
        console.log("Draw new picture")
    }

    render(){
        return (
            <div>
                <ParrotSourHeader
                    comp={<InterceptQT/>}
                />

                <Dialog
                    open={this.state.showAlsaQT}
                    onClose={this.handleAlsaQTClose} >
                    <DialogContent>
                        ALSA help text
                    </DialogContent>
                </Dialog>

                <hr />

                <div className="pscontainer">
                    <h2><u>Select Standard</u></h2>
                    <ul>
                        <li>
                            <input
                                type="radio"
                                id="ipe"
                                name="format"
                                value="ipe"
                                onChange={this.formatSelChange("ipe")}
                            />
                            <label htmlFor="ipe">3-3 IPE</label>
                            <div className="check"></div>
                        </li>

                        <li>
                            <input
                                type="radio"
                                id="alsa"
                                name="format"
                                value="alsa"
                                defaultChecked
                                onChange={this.formatSelChange("alsa")}
                            />
                            <label htmlFor="alsa">ALSA ACC </label> 
                            <div className="check"></div>
                            <button style={{padding:"0px"}} className="helpicon" id="btnAlert" type="button" onClick={this.toggleAlsaQT}>?</button>
                        </li>
                    </ul>
                </div>

                <div style={{display:"flex"}}>
                    <div className="custom-sel-div">
                        <Select 
                            disableUnderline 
                            style={{width:"100%",height:"100%"}} 
                            labelId="picSelLabel" 
                            id="pictureType" 
                            value="random"
                            onChange={this.showNewPic}>
                            <MenuItem value="random">Select Picture</MenuItem>
                            <MenuItem value="random">RANDOM</MenuItem>
                            <MenuItem value="azimuth">AZIMUTH</MenuItem>
                            <MenuItem value="range">RANGE</MenuItem>
                            <MenuItem value="wall">WALL</MenuItem>
                            <MenuItem value="ladder">LADDER</MenuItem>
                            <MenuItem value="champagne">CHAMPAGNE</MenuItem>
                            <MenuItem value="vic">VIC</MenuItem>
                            <MenuItem value="cap">CAP</MenuItem>
                            <MenuItem value="leading edge">LEADING EDGE</MenuItem>
                            <MenuItem value="package">PACKAGES</MenuItem>
                            <MenuItem value="threat">THREAT</MenuItem>
                            <MenuItem value="ea">EA / BOGEY DOPE</MenuItem>
                            <MenuItem value="pod">PICTURE OF THE DAY</MenuItem>
                        </Select>
                    </div>
                    <button style={{height:"min-content", width:"25%",marginBottom:"20px"}} onClick={this.showNewPic}>New Pic</button>
                    
                    <div className="check-container" style={{paddingTop:"0px",paddingBottom:"0px"}}>
                        <ul style={{display:"inline-flex"}}>
                            <li>
                            <input type="checkbox" id="measureMyself" onChange={this.showNewPic} />
                            <label style={{width:"max-content", paddingRight:"10px"}} htmlFor="measureMyself">I want to measure</label>
                            <div className="box"></div>
                            </li>
                            <li>
                            <input type="checkbox" id="hardMode" onChange={this.showNewPic}/>
                            <label style={{paddingRight:"10px"}} htmlFor="hardMode"> Hard Mode</label>
                            <div className='box'></div>
                            </li>
                        </ul>
                    </div>
                
                </div>

                <div style={{display:"inline"}}>
                    <button id="fightsOn" style={{marginBottom:"20px",width:"100px", marginRight:"10px"}} onClick={this.fightsOn} >
                        Fights On
                    </button>
                    <button id="pause" style={{marginBottom:"20px", width:"100px"}} onClick={this.pauseFightShowMeasurements}>
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
                    <br />
                </div>
            </div>
        )
    }   
}