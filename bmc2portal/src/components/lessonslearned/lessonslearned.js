import React from 'react';

import backend from '../utils/backend.js'
import '../../css/styles.css'
import '../../css/chips.css'

const defaultText = "type and enter tag...";

class LessonsLearnedList extends React.Component {

    constructor(){
        super();
        this.state = {
            searchTags: [],
            allTags: [],
            allLessons: [],
            displayLessons: [],
            suggestedTags: []
        }
    }

    componentDidMount(){
        this.loadLessons();
    }

    isSuper(arr1, arr2){
        return arr2.every(function(val) { return arr1.indexOf(val.toUpperCase()) >= 0; });
    }

    filterLessons(lessons, tags){
        let filteredLsns = this.state.allLessons;

        if (tags) {
            filteredLsns = lessons.filter(lesson => {
                lesson.tags = lesson.tags.map(m => m.toUpperCase());
                return this.isSuper(lesson.tags, tags)
            });
        }

        return filteredLsns;
      }
  

    async loadLessons(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const tags = urlParams.get('tags')
  
        let lessons = await backend.getLessonsLearned();
        let allTags = await backend.getAllTags();
        let items = [];
 
        let tagSplit = [];
        if (tags){
            tagSplit = tags.split(',');
            tags.split(",").forEach((itm) => {
              items.push(itm.toUpperCase());
            })
        }

        let filteredLessons = this.filterLessons(lessons, tagSplit);

        this.setState({
            searchTags: items,
            allTags: allTags,
            allLessons: lessons,
            displayLessons: filteredLessons
        })
    }

    autoSuggest = async (e) =>{
        let autoS = document.getElementById("txt");

        var numSuggestions = 5;
        var showTags = [];
        if (autoS.value !== "" || autoS.value === defaultText) {
            showTags = this.state.allTags.filter((t) => t.indexOf(document.getElementById("txt").value.toUpperCase()) !== -1).slice(0, numSuggestions);
        }
        await this.setState ( {suggestedTags: showTags})
    }
  
    checkBack = (e) =>{
        if (e.key==="Backspace" && e.currentTarget.value===""){
            let sTags = this.state.searchTags
            sTags.splice(sTags.length-1,1);
            this.setState({searchTags: sTags})
        }
    }

    handleTagKeyPress = (e) => {
        if (e.charCode === 13) {
            let val = e.currentTarget.value;
            if (val !== '') {
                if (this.state.searchTags.indexOf(val.toUpperCase()) < 0){
                    let tags = this.state.searchTags
                    tags.push(val.toUpperCase());
                    let newDisplay = this.filterLessons(this.state.allLessons, tags);
                    this.setState({ 
                        searchTags: tags, 
                        displayLessons: newDisplay,
                        suggestedTags: []
                    });
               }
            }
            e.currentTarget.value= "";
        }
    }

    addTag(tag){
        return () => {
            let sTags = this.state.searchTags;
            sTags.push(tag);
            let newDisplay = this.filterLessons(this.state.allLessons, this.state.searchTags);
            this.setState({ searchTags: sTags, displayLessons: newDisplay, suggestedTags: [] }); 
            document.getElementById("txt").value = "";        
        }
    }

    removeTag(index){
        let sTags = this.state.searchTags;
        sTags.splice(index,1);

        let newDisplay = this.filterLessons(this.state.allLessons, this.state.searchTags);
        this.setState({ searchTags: sTags, displayLessons: newDisplay });
    }

    render() {
        let asTagElems = []
        return (
        <div>
            <div className="container">
              <h1>Search by lessons learned with Tags: </h1>
              <div className="chips-list" id="list" >
                {this.state.searchTags.map((item,index)=>{
                    return <li key={item+"-"+index}><span>{item}</span><button className="chip-remove" onClick={()=>this.removeTag(index)}>X</button></li>
                })}
              </div>
              <input type="text" id="txt" placeholder={defaultText} onInput={this.autoSuggest} onKeyDown={this.checkBack} onKeyPress={this.handleTagKeyPress}/>
              { this.state.suggestedTags.length > 0 && 
                <div id="autosuggest" className="dropdown" style={{display:"grid"}} >
                  {this.state.suggestedTags.forEach((tag) => {
                        asTagElems.push(<button onClick={this.addTag(tag)} key={tag+"-"+Math.random()}> {tag} </button>);
                    })
                  }
                  {asTagElems}
                  
                </div>
              }
            </div>

            <br/>
            <div style={{textAlign:"center"}}> Lessons Learned </div>
            <br/>
            <table id="lessonsLearnedTable" style={{width:"100%"}}><tbody>
                {this.state.displayLessons.map((lesson)=>{
                    return <tr key={lesson.date+Math.random()}><td>{lesson.date}</td><td>{lesson.title}</td><td>{lesson.tags.join(",")}</td></tr>
                })}
            </tbody></table>
          </div>
        )
    }
}

export default LessonsLearnedList