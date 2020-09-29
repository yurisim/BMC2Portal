import React from 'react'

export default class FaaMap extends React.Component {

    style = {
        width: "100%",
        height: "100%"
    }

    src = "https://www.arcgis.com/home/webmap/viewer.html?useExisting=1&layers=dd0d1b726e504137ab3c41b21835d05b"
    //src = "https://sua.faa.gov/sua/siteFrame.app"
    render(){
        return(
            <iframe id="faamapembed" style={this.style} src={this.src} title="FAA Map" />
        )
    }
}