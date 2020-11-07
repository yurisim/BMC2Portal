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
    var newSrc = this.props.src ? this.props.src : process.env.REACT_APP_STATIC_SERVER_URL+window.location.pathname
    return (
      <div style={this.style}>
        <iframe id="frameDoc" target="_parent" style={this.style} src={newSrc} title={this.props.title} />
      </div>
    )}
}