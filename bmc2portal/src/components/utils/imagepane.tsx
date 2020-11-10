import React, { ReactElement } from 'react';

interface IPProps {
  imageSrc: string
}

/**
 * This Component should render an image.
 */
//export default class ImagePane extends React.PureComponent<IPProps> {
const ImagePane = (props: IPProps):ReactElement => 
{
  const { imageSrc } = props
  return (
      <div style={{textAlign:"center"}}>
        <img alt={imageSrc} src={imageSrc} />
      </div>
  )
}

export default ImagePane