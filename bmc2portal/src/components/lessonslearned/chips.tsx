import React, { ReactElement } from 'react';

import '../../css/styles.css'
import '../../css/chips.css'
import { CSSProperties } from 'react';

type ChipProps = {
    allTags: string[],
    defaultText: string,
    setTags: {(tags: string[]):void},
    style?: CSSProperties,
    title?: string,
    tags:string[],
    hasRemove:boolean,
    isEdit:boolean,
    className?: string
}

type ChipState = {
    searchTags: string[],
    suggestedTags: string[]
}

/**
 * A Component that renders a container for entering/selecting 'tags'
 * 
 * It will also autosuggest if given a suggestedTags []string
 * 
 * This class is loosely based on the npm module 'react-chips'
 * 
 * @TODO - navigate dropdown using up/down arrows on keyboard
 */
export default class Chips extends React.Component<ChipProps, ChipState> {

    inputElem: HTMLInputElement|null = null
    constructor(props:ChipProps){
        super(props)
        this.state = {
            searchTags: [],
            suggestedTags: [],
        }
    }
    
    // Suggest tags to the user from existing tags
    autoSuggest = async (e: React.FormEvent<HTMLInputElement>): Promise<void> =>{
        const numSuggestions = 5; // change this to allow users to see XX suggested tags
        let showTags:string[] = [];
        if (e.currentTarget.value !== "" || e.currentTarget.value === this.props.defaultText) {
            showTags = this.props.allTags.filter((t) => t.indexOf(e.currentTarget.value.toUpperCase()) !== -1).slice(0, numSuggestions);
        }
        await this.setState ( {suggestedTags: showTags})
    }

    // Add a tag from the list of user's entered tags
    addTag = (tag: string):()=>void =>{
        return () => {
            const sTags = this.state.searchTags;
            sTags.push(tag);
            this.setState({ searchTags: sTags, suggestedTags: [] });  
            if (this.inputElem )      
                this.inputElem.value = ""
            this.props.setTags(this.state.searchTags)
        }
    }

    // Remove a tag from the list of user's entered tags
    removeTag = (index:number):()=> void =>{
        return () => {
            const sTags = this.state.searchTags;
            sTags.splice(index,1);
            this.setState({ searchTags: sTags });
            this.props.setTags(this.state.searchTags)
        }
    }

    // binding to 'this' to allow enter key to clear when autosuggest option is clicked
    handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>):void =>{
        if (e.key === "Enter") {
            e.preventDefault()
            const val = e.currentTarget.value;
            if (val !== '') {
                if (this.state.searchTags.indexOf(val.toUpperCase()) < 0){
                    const tags = this.state.searchTags
                    tags.push(val.toUpperCase());
                    this.setState({ 
                        searchTags: tags, 
                        suggestedTags: []
                    });

                    this.props.setTags(this.state.searchTags)
               }
            }
            if (this.inputElem && this.inputElem)
                this.inputElem.value = ""
        }
    }

    // On search, check for a backspace key
    // when the input is empty, this will start deleting existing search tags
    checkBack = (e:React.KeyboardEvent<HTMLInputElement>):void =>{
        if (e.key==="Backspace" && e.currentTarget.value===""){
            const sTags = this.state.searchTags
            sTags.splice(sTags.length-1,1);
            this.setState({
                searchTags: sTags,
                suggestedTags: []
            })
            this.props.setTags(this.state.searchTags)
        }
    }

    styleReadOnly = {
        textAlign:"left",
        width:"100%",
        backgroundColor:"unset",
        padding:"unset" 
    }
    styleContainer = {}

    // main Component render
    render(): ReactElement{
        const asTagElems: JSX.Element[]=[]
        const { isEdit } = this.props
        return (
            <div className="chips-container" style={isEdit? this.styleContainer : this.styleReadOnly}>
              {this.props.title && <h1>{this.props.title}</h1>}
              <div className="chips-list" id="list" >
                {this.props.tags.map((item,index)=>{
                    return <li key={item+"-"+index}><span>{item}</span>{this.props.hasRemove && <button className="chip-remove" onClick={this.removeTag(index)}>X</button>}</li>
                })}
              </div>
              {this.props.isEdit && <div>
                <input 
                    type="text"
                    id="txt" 
                    placeholder={this.props.defaultText} 
                    onInput={this.autoSuggest} 
                    onKeyDown={this.checkBack} 
                    onKeyPress={this.handleKeyPress}
                    ref={el=> this.inputElem = el}/>
                { this.state.suggestedTags && this.state.suggestedTags.length > 0 && 
                    <div id="autosuggest" className="dropdown" style={{display:"grid"}} >
                        {this.state.suggestedTags.forEach((tag) => {
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