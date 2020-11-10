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
export default class SearchInput extends React.PureComponent<SIProps> {


  // perform the parent search with search input from user
  handleSearch = (e:React.FormEvent<HTMLInputElement>):void => {
    const { searchFunc } = this.props;
    searchFunc(e.currentTarget.value)
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
    const { 
      defaultValue = "Enter search text...",
      label
    } = this.props
    return (
      <div className="searchDiv">
        {label && 
          <label style={{paddingRight:"5px"}} htmlFor="searchText">{label}</label>}  
        <input 
          className="searchInput"
          type="text"
          id="searchText"
          defaultValue = { defaultValue }
          style = { {color:"gray"} }
          onInput = { this.handleSearch }
          onBlur = { (itm) => this.waterMark(itm,"blur", defaultValue) }
          onFocus = { (itm) => this.waterMark(itm,"focus", defaultValue) } />
      </div>
    )}
}