import React from 'react'

import FileUploader from '../fileupload/fileuploader'

export default class LoaPdf extends React.Component {

    constructor(props){
        super()
        this.state={
            update: props.update!==undefined ? props.update : true,
            isEdit: undefined
        }
    }

    // Get a button with appropriate styling ('Update' button)
    getButton(text, clickHandler){
        return <button style={{padding:"5px",borderRadius:"5px"}} onClick={clickHandler}>{text}</button>
    }

    setEdit(loa){
        return () => this.setState({isEdit: loa})
    }

    unsetEdit = () =>{
        this.setState({isEdit: undefined})
    }

    // Check if we are editing at the current index
    isEdit(loa){
        return this.state.isEdit===loa;
    }

    render(){
        return <div>
            {this.props.loaLoc.map((loa) => {
            return (<div style={{marginBottom:"15px"}} key={loa}>
                <a href={"/loas/"+loa}>{loa}</a>
                {this.isEdit(loa) &&  // we're editing, so provide the file uploader
                <div style={{width:"-webkit-fill-available", display:"inline-flex", margin:"5%"}}>
                    <FileUploader maxFileCount={1} accept="application/pdf,.pdf,.txt"/>
                    {this.isEdit(loa) &&  // we're editing, so provide the button to close file uploader
                    <div style={{float:"right"}}> {this.getButton("X", this.unsetEdit)} </div>
                    }
                    
                </div>}
                {!this.isEdit(loa) && this.state.update && // we're not editing, so render the update button
                    <div style={{float:"right"}}>
                        {this.getButton("Update", this.setEdit(loa))}
                    </div>}
            </div>)
            })}
        </div>
    }
}