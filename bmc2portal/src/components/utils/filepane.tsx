import React, { ReactElement } from 'react';

interface FPProps{
  src: string,
  title: string
}

/**
 * This Component should render an external website viewer.
 */
export default class FilePane extends React.PureComponent<FPProps> {

    style = {
        width: "100%",
        height: "100%",
        textalign:"center"
    }

  render(): ReactElement{
    const { 
      src = process.env.REACT_APP_STATIC_SERVER_URL+window.location.pathname,
      title
    } = this.props
    return (
      <div style={this.style}>
        <iframe id="frameDoc" style={this.style} src={src} title={title} />
      </div>
    )}
}