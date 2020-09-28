import React from 'react';

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'

class Chips extends React.Component {

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
                <input type="text" id="txt" placeholder={this.props.defaultText} onInput={this.props.autoSuggest} onKeyDown={this.props.checkBack} onKeyPress={this.props.handleTagKeyPress}/>
                { this.props.suggestedTags && this.props.suggestedTags.length > 0 && 
                    <div id="autosuggest" className="dropdown" style={{display:"grid"}} >
                        {this.props.suggestedTags.forEach((tag) => {
                                asTagElems.push(<button onClick={this.props.addTag(tag)} key={tag+"-"+Math.random()}> {tag} </button>);
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

export default Chips