import React from 'react';

import backend from '../utils/backend.js'
import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'

import Lesson from './lesson'
import Chips from './chips'
import SearchInput from '../utils/searchinput'

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
  
        let lessons = []
        let allTags = []
        try {
            lessons = await backend.getLessonsLearned();
            allTags = await backend.getAllTags();
        } catch {
            this.setState({failed:true})
        }
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
            let newDisplay = this.filterLessons(this.state.allLessons, sTags);
            this.setState({
                searchTags: sTags,
                displayLessons: newDisplay,
                suggestedTags: []
            })
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

    addTag = (tag, tags) =>{
        return () => {
            let sTags = this.state.searchTags;
            sTags.push(tag);
            let newDisplay = this.filterLessons(this.state.allLessons, this.state.searchTags);
            this.setState({ searchTags: sTags, displayLessons: newDisplay, suggestedTags: [] }); 
            document.getElementById("txt").value = "";        
        }
    }

    removeTag = (index) =>{
        let sTags = this.state.searchTags;
        sTags.splice(index,1);

        let newDisplay = this.filterLessons(this.state.allLessons, this.state.searchTags);
        this.setState({ searchTags: sTags, displayLessons: newDisplay });
    }

    getLessonsLearnedTableRows(){
        let tableRows = <tr><td colSpan="2">Loading...</td></tr>
        if (this.state){
            if (this.state.failed){
                tableRows = <tr><td colSpan="2">Failed to retrieve data from server.</td></tr>
            } else if(this.state.displayLessons.length<=0){
                tableRows = <tr><td colSpan="2">No data from server.</td></tr>
            } else {
                tableRows = this.state.displayLessons.map((lesson)=>{
                    return <Lesson key={lesson.date+Math.random()} lesson={lesson}/>
                })
            } 
        }
        return tableRows;
    }

    filterLessonsLearned =() =>{
        if (this.state){
            let dLessons = this.state.allLessons.filter((lesson)=>{
                let text = document.getElementById("searchText").value.toUpperCase();
                return lesson.title.toUpperCase().indexOf(text) > -1 || lesson.content.toUpperCase().indexOf(text) > -1
            })
            this.setState({displayLessons: dLessons})
        }
    }

    render() {
        return (
        <div>
            <Chips 
                isEdit={true}
                hasRemove={true}
                title="Search by lessons learned with Tags:"
                tags={this.state.searchTags}
                suggestedTags={this.state.suggestedTags}
                defaultText={defaultText}
                addTag={this.addTag}
                autoSuggest={this.autoSuggest}
                checkBack={this.checkBack}
                handleTagKeyPress={this.handleTagKeyPress}
                onRemoveClick={this.removeTag}
            />
            <br/>
            <div className="searchDiv">
                <SearchInput 
                    searchFunc={this.filterLessonsLearned}
                    label="Search Contents:"
                />
            </div>

            <br/>
            <div style={{textAlign:"center"}}> Lessons Learned </div>
            <br/>
            <table id="lessonsLearnedTable" className="lessonsTable" style={{width:"100%"}}><tbody>
                {this.getLessonsLearnedTableRows()}
            </tbody></table>
          </div>
        )
    }
}

export default LessonsLearnedList