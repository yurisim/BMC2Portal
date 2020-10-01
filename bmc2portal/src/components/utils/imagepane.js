import React from 'react';

/**
 * This Component should render an image.
 */
export default class ImagePane extends React.Component {

  render(){
    return (
      <div style={{textAlign:"center"}}>
        <img alt={this.props.imageSrc} src={this.props.imageSrc}></img>
      </div>
    )}
}