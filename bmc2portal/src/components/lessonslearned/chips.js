import React from 'react';

import '../../css/styles.css'
import '../../css/chips.css'

/**
 * A Component that renders a container for entering/selecting 'tags'
 * 
 * It will also autosuggest if given a suggestedTags []string
 * 
 * This class is loosely based on the npm module 'react-chips'
 * 
 * @TODO - navigate dropdown using up/down arrows on keyboard
 */
export default class Chips extends React.Component {

    // binding to 'this' to allow enter key to clear when autosuggest option is clicked
    handleKeyPress = (e) =>{
        this.props.handleTagKeyPress(e)
        console.log(e.charCode)
        if (e.charCode === 13) {
            console.log("reset value")
            this.inputElem.value = ""
        }
    }

    // binding to 'this' to allow ref inputElem to clear when autosuggest option is clicked
    addTag = (tag) =>{
        return () => {
            this.props.addTag(tag)()
            this.inputElem.value = ""
        }
    }

    // main Component render
    render(){
        let asTagElems=[]
        return (
            <div className="container" style={this.props.style}>
              {this.props.title && <h1>{this.props.title}</h1>}
              <div className="chips-list" id="list" >
                {this.props.tags.map((item,index)=>{
                    return <li key={item+"-"+index}><span>{item}</span>{this.props.hasRemove && <button className="chip-remove" onClick={this.props.onRemoveClick}>X</button>}</li>
                })}
              </div>
              {this.props.isEdit && <div>
                <input 
                    type="text"
                    id="txt" 
                    placeholder={this.props.defaultText} 
                    onInput={this.props.autoSuggest} 
                    onKeyDown={this.props.checkBack} 
                    onKeyPress={this.handleKeyPress}
                    ref={el=> this.inputElem = el}/>
                { this.props.suggestedTags && this.props.suggestedTags.length > 0 && 
                    <div id="autosuggest" className="dropdown" style={{display:"grid"}} >
                        {this.props.suggestedTags.forEach((tag) => {
                                asTagElems.push(<button onClick={this.addTag(tag)} key={tag+"-"+Math.random()}> {tag} </button>);
                            })
                        }                       
                        {asTagElems}
                    </div>
                }
              </div>}
            </div>
        )
    }
}