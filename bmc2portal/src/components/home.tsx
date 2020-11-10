import React, { lazy, ReactElement } from 'react';

const ImagePane = lazy(()=>import('./utils/imagepane'))

/**
 * The Home Component is the default comonent to render on main entry Route
 */
export default class Home extends React.PureComponent {

  render(): ReactElement {
    return (
      <ImagePane imageSrc="./icon/552trans.png" />
    )}
}