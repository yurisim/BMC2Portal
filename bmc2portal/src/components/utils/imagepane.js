import React from 'react';

/**
 * This Component contains an image.
 */
class ImagePane extends React.Component {

  render(){
    return (
      <div style={{textAlign:"center"}}>
        <p>{this.props.imageSrc}</p>
      </div>
    )}
}

export default ImagePane