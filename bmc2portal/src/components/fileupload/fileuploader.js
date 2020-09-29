import React from 'react'
import Dropzone from 'react-dropzone'

import FileReject from './filereject'
import FileAccept from './fileaccept'

import '../../css/fileuploader.css'

/**
 * FileUploader provides a Component to render a File Dropzone.
 * 
 * Props can include "maxFileCount" (int) and "accept", which is a
 * comma-separated string containing acceptable MIME types and/or 
 * file extensions.
 */
export default class FileUploader extends React.Component {
    
    // Callback for when a file is dropped into the Dropzone
    onDrop =(acceptedFiles, rejectedFiles)=>{
        // if theres a limit to the number of files
        // then we adjust the list of accepted/rejected files
        if (this.props.maxFileCount){
            if (acceptedFiles.length > this.props.maxFileCount){
                for (var i=1; i<acceptedFiles.length; i++){
                    console.log(acceptedFiles[i])
                    rejectedFiles.push({
                        file: acceptedFiles[i],
                        errors: [{message:"Limited to upload " + this.props.maxFileCount + " at a time."}]
                    })
                }
                // slice after parsing files to be rejected
                acceptedFiles = acceptedFiles.slice(0,1)
            }
        }
        this.setState({
            acceptedFiles: acceptedFiles,
            rejectedFiles: rejectedFiles
        })
    }

    style = {
        outline: "2px dashed #92b0b3",
        outlineOffset: "-10px",
        WebkitTransition: "outline-offset .15s ease-in-out, background-color .15s linear",
        transition: "outline-offset .15s ease-in-out, background-color .15s linear",
        padding: "60px 0px 20px 0px",
        textAlign: "center !important",
        margin: "0",
        backgroundColor: "white !important",
    }

    browseStyle={
        marginLeft:"15px",
        display:"inline-flex", 
        borderRadius:"15px",
        width:"fit-content",
        size:"0px"
    }

    // main Component render
    render() {
        return (
            <Dropzone 
                accept={this.props.accept}
                onDrop={this.onDrop}>
                {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => (
                <div>
                    <div {...getRootProps()}>
                    <div className="files">
                    <input {...getInputProps()} />
                        {isDragActive ? 
                        <div style={{...this.style, height:"37px"}}>Drop files here</div>
                        : <div style={this.style}><div>Drag files here, or click <button style={this.browseStyle}>Browse</button></div> </div>}
                    </div>
                    </div>
                    {this.state && this.state.rejectedFiles && this.state.rejectedFiles.length > 0 && this.state.rejectedFiles.map(rejectedFile => (
                        <FileReject rejectedFile={rejectedFile} />
                    ))}
                    {this.state && this.state.acceptedFiles && this.state.acceptedFiles.length > 0 && this.state.acceptedFiles.map(acceptedFile => (
                        <FileAccept acceptedFile={acceptedFile} />
                    ))}
                </div>  
            )}
          </Dropzone>
        )
    }
}