import {Dialog, MenuItem, Select} from '@material-ui/core'
import React from 'react'

import '../../css/collapsible.css'
import '../../css/select.css'
import '../../css/slider.css'
import '../../css/parrotsour.css'
import '../../css/toggle.css'

import InterceptQT from './quicktips/interceptQT.js'
import AlsaHelp from './quicktips/alsahelp.js'
import ParrotSourHeader from './parrotsourheader.js'
import ParrotSourControls from './parrotsourcontrols.js'
import PictureCanvas from './canvas/picturecanvas'

import VersionInfo from './versioninfo.js'

interface PSIProps{

}

interface CanvasConfig {
    height: number,
    width: number,
    orient: string
}

interface PSIState {
    showAlsaQT: boolean,
    showAnswer: boolean,
    showMeasurements: boolean,
    isHardMode: boolean,
    format: string,
    speedSliderValue: number,
    canvasConfig: CanvasConfig,
    braaFirst: boolean,
    picType: string,
    answer: string,
    newPic: boolean
}
export default class ParrotSourIntercept extends React.Component<PSIProps, PSIState> {

    constructor(props:any){
        super(props)
        this.state = {
            showAlsaQT: false,
            showAnswer: false,
            showMeasurements: true,
            isHardMode: false,
            format:"alsa",
            speedSliderValue: 50,
            canvasConfig: {
                height: 400,
                width:800,
                orient:"NS"
            },
            braaFirst: true,
            picType:"random",
            answer: "",
            newPic: false,
        }
    }

    toggleAlsaQT = () =>{
        this.setState({showAlsaQT: !this.state.showAlsaQT})
    }
    handleAlsaQTClose = () =>{
        this.setState({showAlsaQT: false})
    }

    handleSliderChange = (value: number) => {
        this.setState({speedSliderValue: value})
    }

    formatSelChange = (fmt: string) =>{
        return () => {
            this.setState({format: fmt})
        }
    }

    showNewPic = () =>{
        this.setState({newPic:!this.state.newPic})
    }

    revealPic = () => {
        this.setState({showAnswer: !this.state.showAnswer})
    }

    braaChanged = () =>{
        this.setState({braaFirst: !this.state.braaFirst})
    }

    toggleMeasurements = () => {
        this.setState({showMeasurements: !this.state.showMeasurements})
    }

    toggleHardMode = () => {
        this.setState({isHardMode: !this.state.isHardMode})
    }

    setAnswer = (answer: string) => {
        this.setState({answer: answer})
    }

    modifyCanvas = () => {
        var newConfig = {
            height:400,
            width:800,
            orient:"NS"
        }
        if (this.state.canvasConfig.orient==="NS"){
            newConfig = {
                height:800,
                width:400,
                orient:"EW"
            }
        }
        this.setState({canvasConfig:newConfig})
    }

    changePicType = (e: any) => {
        this.setState({picType:e.target.value})
    }

    render(){
        return (
            <div>
                <ParrotSourHeader comp={<InterceptQT/>} />

                <Dialog
                    open={this.state.showAlsaQT}
                    onClose={this.handleAlsaQTClose} >
                    <AlsaHelp />
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
                            value={this.state.picType}
                            onChange={this.changePicType}>
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
                            <input type="checkbox" id="measureMyself" onChange={this.toggleMeasurements} />
                            <label style={{width:"max-content", paddingRight:"10px"}} htmlFor="measureMyself">I want to measure</label>
                            <div className="box"></div>
                            </li>
                            <li>
                            <input type="checkbox" id="hardMode" onChange={this.toggleHardMode}/>
                            <label style={{paddingRight:"10px"}} htmlFor="hardMode"> Hard Mode</label>
                            <div className='box'></div>
                            </li>
                        </ul>
                    </div>
                
                </div>

                <ParrotSourControls 
                    handleSliderChange={this.handleSliderChange}
                    modifyCanvas={this.modifyCanvas}
                    showNewPic={this.showNewPic}
                    braaChanged={this.braaChanged}
                />
                
                <br/>
                
                <button type="button" className={this.state.showAnswer ? "collapsible active":"collapsible"} onClick={this.revealPic}>Reveal Pic</button>
                {this.state.showAnswer && 
                    <div className="content" id="answerDiv" style={{color:"black", padding:"20px"}}>
                        {this.state.answer ? this.state.answer : <div/>}
                    </div>
                }  
                <br/><br/><br/>

                <PictureCanvas 
                    height={this.state.canvasConfig.height}
                    width={this.state.canvasConfig.width}
                    braaFirst={this.state.braaFirst}
                    picType={this.state.picType}
                    format={this.state.format}
                    showMeasurements={this.state.showMeasurements}
                    isHardMode={this.state.isHardMode}
                    orientation={this.state.canvasConfig.orient}
                    setAnswer={this.setAnswer}
                    newPic={this.state.newPic}
                />

                <VersionInfo/>
            </div>
        )
    }   
}