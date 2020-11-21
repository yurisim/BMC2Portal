import React, { ReactElement } from 'react'

import {Dialog, DialogContent} from '@material-ui/core'

type IRState = {
    showIssueForm: boolean
}
export default class IssueReport extends React.PureComponent<Record<string,unknown>, IRState> {

    constructor(props: Record<string, unknown>){
        super(props)
        this.state={
            showIssueForm: false
        }
    }

    /**
     * Toggle the issue form display
     */
    handleToggleIssueForm = ():void =>{
        this.setState(prevState=>({showIssueForm: !prevState.showIssueForm}))
    }

    /**
     * Called when the issue report form is closed
     */
    handleIssueClose = ():void =>{
        this.setState({showIssueForm:false})
    }

    render(): ReactElement {
        const {showIssueForm} = this.state
        return (
        <div style={{width:"25%"}}>
            <button type="button" style={{marginLeft:"5%", top:"5px"}} onClick={this.handleToggleIssueForm}> Report Issue </button>     
            <Dialog
                open={showIssueForm}
                onClose={this.handleIssueClose} >
                <DialogContent>
                    Hello world -- Replace with Form Content
                </DialogContent>
            </Dialog>
        </div>)
    }
}