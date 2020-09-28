import React from 'react';

/**
 * This Component contains an image.
 */
export default class ImagePane extends React.Component {

  render(){
    return (
      <div style={{textAlign:"center"}}>
        <p>{this.props.imageSrc}</p>
      </div>
    )}
}