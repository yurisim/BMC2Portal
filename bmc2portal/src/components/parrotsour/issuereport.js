import React from 'react'

import {Dialog, DialogContent} from '@material-ui/core'

export default class IssueReport extends React.Component {

    constructor(){
        super()
        this.state={
            showIssueForm: false
        }
    }

    toggleIssueForm = () =>{
        this.setState({showIssueForm: !this.state.showIssueForm})
    }
    handleIssueClose = () =>{
        this.setState({showIssueForm:false})
    }

    render(){
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