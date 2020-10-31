import React from 'react';

import '../../css/search.css'

/**
 * This Component renders a search input box.
 */
export default class SearchInput extends React.Component {

  // perform the parent search with search input from user
  search = (e) => {
    this.props.searchFunc(e.currentTarget.value)
  }

  // blur/focus input
  waterMark(txt, evtType, defaultTxt) {
    var itm = txt.target;
    if(itm.value.length === 0 && evtType === "blur")        
    {
        itm.style.color = "gray";
        itm.value = defaultTxt;
    }
    if(itm.value === defaultTxt && evtType === "focus") 
    {
        itm.style.color = "white";
        itm.value=""; 
    }
  }

  // main Component render function
  render(){
    let defaultText = this.props.defaultValue ? this.props.defaultValue : "Enter search text...";
    return (
      <div className="searchDiv">
        {this.props.label && 
          <label style={{paddingRight:"5px"}} htmlFor="searchText">{this.props.label}</label>}  
        <input 
          className="searchInput"
          type="text"
          id="searchText"
          defaultValue = { defaultText }
          style = { {color:"gray"} }
          onInput = { this.search }
          onBlur = { (itm) => this.waterMark(itm,"blur", defaultText) }
          onFocus = { (itm) => this.waterMark(itm,"focus", defaultText) } />
      </div>
    )}
}