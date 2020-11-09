import React, { ReactElement } from 'react'

import {Dialog, DialogContent} from '@material-ui/core'

type IRState = {
    showIssueForm: boolean
}
export default class IssueReport extends React.Component<Record<string,unknown>, IRState> {

    constructor(props: Record<string, unknown>){
        super(props)
        this.state={
            showIssueForm: false
        }
    }

    /**
     * Toggle the issue form display
     */
    toggleIssueForm = () =>{
        this.setState({showIssueForm: !this.state.showIssueForm})
    }

    /**
     * Called when the issue report form is closed
     */
    handleIssueClose = () =>{
        this.setState({showIssueForm:false})
    }

    render(): ReactElement {
        return (
        <div style={{width:"25%"}}>
            <button type="button" style={{marginLeft:"5%", top:"5px"}} onClick={this.toggleIssueForm}> Report Issue </button>     
            <Dialog
                open={this.state.showIssueForm}
                onClose={this.handleIssueClose} >
                <DialogContent>
                    Hello world -- Replace with Form Content
                </DialogContent>
            </Dialog>
        </div>)
    }
}