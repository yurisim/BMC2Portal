import React from 'react';

/**
 * This Component should render an image.
 */
export default class ImagePane extends React.Component {

  render(){
    return (
      <div style={{textAlign:"center"}}>
        <div>{this.props.imageSrc}</div>
      </div>
    )}
}