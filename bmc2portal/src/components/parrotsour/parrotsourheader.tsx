import React, { CSSProperties, ReactElement } from 'react'

import IssueReport from './issuereport'
import {Dialog} from '@material-ui/core'

interface PSHeaderProps{
    comp:ReactElement
}

interface PSHeaderState{
    showQT: boolean,
}

/**
 * ParrotSour top header. Includes controls for:
 * 
 * - Quick Tips
 * - Issue Report
 * - 552 Logos
 */
export default class ParrotSourHeader extends React.Component<PSHeaderProps, PSHeaderState> {

    imgStyle:CSSProperties = {
        position:"absolute",
        height: "60px",
        top: "5px", 
    }

    constructor(props: PSHeaderProps){
        super(props)
        this.state={
            showQT: false,
        }
    }

    /**
     * Toggle display of the QuickTips Dialog Element (component passed in props)
     */
    toggleQuickTips = ():void =>{
        this.setState({showQT: !this.state.showQT})
    }
    
    /**
     * Called when the quick tips dialog is closed
     */
    handleQTClose = ():void => {
        this.setState({showQT: false})
    }
    
    render():ReactElement{
        return (
            <div>
                <img src="/icon/552trans.png" style={{...this.imgStyle, right:"5%"}} id="acwlogo" alt="552Logo" />
                <img src="/icon/panthertrans.png" style={{...this.imgStyle, right:"15%"}} id="pantherlogo" alt="968Logo" />

                <div style={{display:"flex"}}>
                    <button type="button" style={{width:"25%",top:"5px"}} onClick={this.toggleQuickTips}>Quick Tips</button>
                    {this.state.showQT && 
                        <Dialog
                            open={this.state.showQT}
                            onClose={this.handleQTClose}>
                            {this.props.comp}
                        </Dialog>
                    }
                    
                    <IssueReport />
                </div>
            </div>
        )
    }
}