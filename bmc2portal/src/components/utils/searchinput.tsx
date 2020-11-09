import React, { ReactElement } from 'react';

import '../../css/search.css'

interface SIProps{
  label?:string,
  defaultValue?: string,
  searchFunc(arg0:string):void
}

/**
 * This Component renders a search input box.
 */
export default class SearchInput extends React.Component<SIProps> {

  // perform the parent search with search input from user
  search = (e:React.FormEvent<HTMLInputElement>):void => {
    this.props.searchFunc(e.currentTarget.value)
  }

  // blur/focus input
  waterMark(txt:React.FocusEvent<HTMLInputElement>, evtType:string, defaultTxt:string): void {
    const itm = txt.target;
    if(itm && itm.value.length === 0 && evtType === "blur")        
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
  render(): ReactElement{
    const defaultText = this.props.defaultValue ? this.props.defaultValue : "Enter search text...";
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