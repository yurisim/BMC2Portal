import React from 'react'

export default class VersionInfo extends React.Component {

    vStyle = {
        color:"lightblue"
    }

    render(){
        return(
            <div style={this.vStyle}>
                 <br /><br /><br /><br /><br /><br /><br />
                Developed by John McCarthy <br />
                Version: 3.0.1 --
                <a style={this.vStyle} href="changelog.html"> Change Log </a> <br />
                31 Oct 2020 <br />
            </div>
        )
    }
}