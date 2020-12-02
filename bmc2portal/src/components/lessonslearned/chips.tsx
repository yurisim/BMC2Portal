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
export default class Chips extends React.PureComponent<ChipProps, ChipState> {

    constructor(props:ChipProps){
        super(props)
        this.state = {
            searchTags: [],
            suggestedTags: [],
        }
    }
    
    inputElem: HTMLInputElement|null = null
    
    // Suggest tags to the user from existing tags
    handleAutoSuggest = async (e: React.FormEvent<HTMLInputElement>): Promise<void> =>{
        const { allTags, defaultText} = this.props
        const numSuggestions = 5; // change this to allow users to see XX suggested tags
        let showTags:string[] = [];
        if (e.currentTarget.value !== "" || e.currentTarget.value === defaultText) {
            showTags = allTags.filter((t) => t.indexOf(e.currentTarget.value.toUpperCase()) !== -1).slice(0, numSuggestions);
        }
        await this.setState ( {suggestedTags: showTags})
    }

    // Add a tag from the list of user's entered tags
    addTag = (tag: string):()=>void =>{
        const { searchTags } = this.state
        const { setTags } = this.props
        return () => {
            const sTags = searchTags;
            sTags.push(tag);
            this.setState({ searchTags: sTags, suggestedTags: [] });  
            if (this.inputElem )      
                this.inputElem.value = ""
            setTags(searchTags)
        }
    }

    // Remove a tag from the list of user's entered tags
    removeTag = (index:number):()=> void =>{
        const { searchTags } = this.state
        const { setTags } = this.props
        return () => {
            const sTags = searchTags;
            sTags.splice(index,1);
            this.setState({ searchTags: sTags });
            setTags(searchTags)
        }
    }

    // binding to 'this' to allow enter key to clear when autosuggest option is clicked
    handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>):void =>{
        if (e.key === "Enter") {
            e.preventDefault()
            const val = e.currentTarget.value;
            const { searchTags } = this.state
            const { setTags } = this.props
            if (val !== '') {
                if (searchTags.indexOf(val.toUpperCase()) < 0){
                    const tags = searchTags
                    tags.push(val.toUpperCase());
                    this.setState({ 
                        searchTags: tags, 
                        suggestedTags: []
                    });

                    setTags(searchTags)
               }
            }
            if (this.inputElem && this.inputElem)
                this.inputElem.value = ""
        }
    }

    // On search, check for a backspace key
    // when the input is empty, this will start deleting existing search tags
    handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>):void =>{
        if (e.key==="Backspace" && e.currentTarget.value===""){
            const { searchTags } = this.state
            this.removeTag(searchTags.length-1)
        }
    }

    setInputElem = (el: HTMLInputElement): void=>{ 
        this.inputElem = el
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
        const { isEdit, title, tags, hasRemove, defaultText } = this.props
        const { suggestedTags } = this.state
        return (
            <div className="chips-container" style={isEdit? this.styleContainer : this.styleReadOnly}>
              {title && <h1>{title}</h1>}
              <div className="chips-list" id="list" >
                {tags.map((item,index)=>{
                    return <li key={item+"-"}><span>{item}</span>{hasRemove && <button type="button" className="chip-remove" onClick={this.removeTag(index)}>X</button>}</li>
                })}
              </div>
              {isEdit && <div>
                <input 
                    type="text"
                    id="txt" 
                    placeholder={defaultText} 
                    onInput={this.handleAutoSuggest} 
                    onKeyDown={this.handleKeyDown} 
                    onKeyPress={this.handleKeyPress}
                    ref={this.setInputElem}/>
                { suggestedTags && suggestedTags.length > 0 && 
                    <div id="autosuggest" className="dropdown" style={{display:"grid"}} >
                        {suggestedTags.forEach((tag) => {
                                asTagElems.push(<button type="button" onClick={this.addTag(tag)} key={tag+"-"+Math.random()}> {tag} </button>);
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