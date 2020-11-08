import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Chips from './chips';

import snackbar from '../utils/alert.js'
import backend from '../utils/backend'

export default class Form extends React.Component {

    constructor(props){
        super()
        this.state ={
            open: true,
            searchTags: [],
            allTags: [],
        }
    }

    setSearchTags = (tags) => {
        this.setState({searchTags: tags})
    }

    isOpen(){
        return this.state.open
    }

    setOpen(val){
        this.setState({
            open:val
        })
    }

    handleClickOpen = () =>{
        this.setOpen(true)
    }

    handleClose = () => {
        this.setOpen(false)
        this.props.onClose()
    }

    handleSubmit = async (e) => {
        var goodForm = e.currentTarget.form.reportValidity()
        e.preventDefault();
        if (goodForm) {
            console.log("submit to server", this.state.title, this.state.author, this.state.content)
            var res = await backend.postLessonLearned(this.state.title, this.state.author, this.state.content)
            if (res === "OK"){
                snackbar.alert("Submitted!", 5000, "green")
                this.handleClose()
            } else{
                snackbar.alert("Error submitting...", 5000, "red")
            }
        }
    }

    handleTitleChange = (e) => {
        this.setState({title: e.currentTarget.value})
    }
    handleAuthorChange = (e) =>{
        this.setState({author: e.currentTarget.value})
    }
    handleContentChange = (e) => {
        this.setState({content: e.currentTarget.value})
    }

    render(){
        var date = new Date()
        var dateStr = date.getFullYear() +"-" + date.getMonth() + "-" + date.getDay();

        return <Dialog 
            style={{marginLeft:"25%"}}
            fullScreen={false}
            open={this.state.open}
            onClose={this.handleClose}>
                <form onSubmit={this.handleSubmit}>
                <DialogContent>
                    <DialogContentText>
                        Date: {dateStr}
                    </DialogContentText>
                    <TextField 
                        required
                        id='title'
                        label='Title'
                        fullWidth
                        type="text" 
                        onChange={this.handleTitleChange}/>
                    <TextField 
                        required
                        id='content'
                        label='Lesson Learned'
                        fullWidth
                        type="text"
                        multiline 
                        onChange={this.handleContentChange}/>
                    <TextField 
                        required
                        id='author'
                        label='Author'
                        fullWidth
                        type="text"
                        onChange={this.handleAuthorChange}/>
                    <button display="none" hidden onClick={this.handleSubmit}></button>
                    <br/><br/>
                    <Chips 
                        isEdit={true}
                        hasRemove={true}
                        title="Tags:"
                        setTags={this.setSearchTags}
                        tags={this.state.searchTags}
                        allTags={this.state.allTags}
                        defaultText="Enter tags..."
                    />
                </DialogContent> 
                <DialogActions>
                    <Button onClick={this.handleSubmit}>
                        Submit
                    </Button>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                </DialogActions>    
                </form>
            </Dialog>
    }
}