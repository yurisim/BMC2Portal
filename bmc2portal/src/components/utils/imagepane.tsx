import React, { ReactElement } from 'react';

interface IPProps {
  imageSrc: string
}

/**
 * This Component should render an image.
 */
export default class ImagePane extends React.Component<IPProps> {

  render(): ReactElement{
    return (
      <div style={{textAlign:"center"}}>
        <img alt={this.props.imageSrc} src={this.props.imageSrc}></img>
      </div>
    )}
}