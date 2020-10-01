import React from 'react';

/**
 * This Component should render an external website viewer.
 */
export default class FilePane extends React.Component {

    style = {
        width: "100%",
        height: "100%",
        textAlign:"center"
    }

  render(){
    return (
      <div style={this.style}>
        <iframe id="frameDoc" target="_parent" style={this.style} src={this.props.src} title={this.props.title} />
      </div>
    )}
}