import {Dialog, MenuItem, Select} from '@material-ui/core'
import React, { ChangeEvent, lazy, ReactElement, Suspense } from 'react'

import '../../css/collapsible.css'
import '../../css/select.css'
import '../../css/slider.css'
import '../../css/parrotsour.css'
import '../../css/toggle.css'

const ParrotSourHeader = lazy(()=>import('./parrotsourheader'))
const InterceptQT = lazy(()=>import("./quicktips/interceptQT"))
const AlsaHelp = lazy(()=>import("./quicktips/alsahelp"))
const ParrotSourControls = lazy(()=>import("./parrotsourcontrols"))

const PictureCanvas = lazy(()=>import('./canvas/picturecanvas'))

const VersionInfo = lazy(()=>import('./versioninfo'))

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
    animate:boolean,
    newPic: boolean
}

/**
 * A Component to display intercept pictures on an HTML5 canvas
 */
export default class ParrotSourIntercept extends React.Component<Record<string,unknown>, PSIState> {

    constructor(props:Record<string,unknown>){
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
                orient:"EW"
            },
            braaFirst: true,
            picType:"random",
            answer: "",
            newPic: false,
            animate: false,
        }
    }

    /**
     * Toggle the quick tips dialog for ALSA help
     */
    toggleAlsaQT = ():void =>{
        this.setState({showAlsaQT: !this.state.showAlsaQT})
    }

    /**
     * Called when the ALSA quick tips dialog is closed
     */
    handleAlsaQTClose = ():void =>{
        this.setState({showAlsaQT: false})
    }

    /**
     * Called when the PSControls slider value is changed
     * @param value - new speed of the slider
     */
    handleSliderChange = (value: number):void => {
        this.setState({speedSliderValue: value})
    }

    /**
     * Called when the format selection changes
     * @param fmt - new format to use to generate answers
     */
    formatSelChange = (fmt: string) => {
        return ():void => {
            this.setState({format: fmt})
            this.showNewPic()
        }
    }

    /**
     * Called to display a new Picture
     */
    showNewPic = ():void =>{
        this.setState({newPic:!this.state.newPic})
    }

    /**
     * Toggle the answer collapsible
     */
    revealPic = ():void => {
        this.setState({showAnswer: !this.state.showAnswer})
    }

    /**
     * Called when the BRAAFirst option is changed
     */
    braaChanged = ():void =>{
        this.setState({braaFirst: !this.state.braaFirst})
    }

    /**
     * Called when the "Show Measurements" check box changes values
     */
    toggleMeasurements = ():void => {
        this.setState({showMeasurements: !this.state.showMeasurements})
    }

    /**
     * Called when the hard mode check box changes values
     */
    toggleHardMode = ():void => {
        this.setState({isHardMode: !this.state.isHardMode})
    }

    /**
     * Called when an answer is avaiable; to be displayed in the answer collapsible
     * @param answer - the answer to the displayed picture
     */
    setAnswer = (answer: string):void => {
        this.setState({answer: answer})
    }

    /**
     * Called to start the animation
     */
    startAnimate = ():void =>{
        this.setState({animate:true})
    }

    /**
     * Called to pause the animation
     */
    pauseAnimate = ():void => {
        this.setState({animate:false})
    }

    /**
     * Called when the orienation is changed, to modify the canvas dimensions
     */
    modifyCanvas = ():void => {
        let newConfig = {
            height:700,
            width:600,
            orient:"NS"
        }
        if (this.state.canvasConfig.orient==="NS"){
            newConfig = {
                height:400,
                width:800,
                orient:"EW"
            }
        }
        this.setState({canvasConfig:newConfig})
    }

    /**
     * Called when the picture type selector changes values
     * @param e - ChangeEvent for the Select element
     */
    changePicType = (e: ChangeEvent<{name?:string|undefined, value:unknown}>):void => {
        if (typeof e.target.value === "string")
            this.setState({picType:e.target.value})
    }

    render():ReactElement {
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>} >
                    <ParrotSourHeader comp={<InterceptQT/>} />
                </Suspense>  

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

                <Suspense fallback={<div>Loading...</div>} >    
                    <ParrotSourControls 
                        handleSliderChange={this.handleSliderChange}
                        modifyCanvas={this.modifyCanvas}
                        braaChanged={this.braaChanged}
                        startAnimate={this.startAnimate}
                        pauseAnimate={this.pauseAnimate}
                    />
                </Suspense>  

                <br/>
                
                <button type="button" className={this.state.showAnswer ? "collapsible active":"collapsible"} onClick={this.revealPic}>Reveal Pic</button>
                {this.state.showAnswer && 
                    <div className="content" id="answerDiv" style={{color:"black", padding:"20px"}}>
                        {this.state.answer ? this.state.answer : <div/>}
                    </div>
                }  
                <br/><br/><br/>

                <Suspense fallback={<div>Loading...</div>} >
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
                        animate={this.state.animate}
                        sliderSpeed={this.state.speedSliderValue}
                    />
                </Suspense>  

                <Suspense fallback={<div>Loading...</div>}>
                    <VersionInfo/>
                </Suspense>
            </div>
        )
    }   
}