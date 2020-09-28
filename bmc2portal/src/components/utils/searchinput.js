import React from 'react';

import common from './common.js';

/**
 * This Component renders a search input box.
 */
export default class SearchInput extends React.Component {

  render(){
    let defaultText = this.props.defaultValue ? this.props.defaultValue : common.defaultText;
    return (
      <div className="searchDiv">
        {this.props.label && 
          <label style={{paddingRight:"5px"}} for="searchText">{this.props.label}</label>}  
        <input 
          className="searchInput"
          type="text"
          id="searchText"
          defaultValue={defaultText}
          style={{color:"gray"}}
          onInput={this.props.searchFunc}
          onBlur={(itm)=>common.WaterMark(itm,"blur", defaultText)}
          onFocus={(itm)=>common.WaterMark(itm,"focus", defaultText)} />
      </div>
    )}
}