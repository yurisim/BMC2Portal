import React from 'react';

import backend from '../utils/backend.js'

import Lesson from './lesson'
import Chips from './chips'
import SearchInput from '../utils/searchinput'

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'

const defaultText = "type and enter tag...";

/**
 * A Component to render a (optionally filtered) list of Lessons Learned.
 */
export default class LessonsLearnedList extends React.Component {

    // construct component with empty state
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

    // Lifecycle - load lessons from server after the component has loaded
    componentDidMount(){
        this.loadLessons();
    }

    // isSuper returns if arr1 is a superset of arr2
    // i.e. all of arr2 is in arr1
    isSuper(arr1, arr2){
        return arr2.every(function(val) { return arr1.indexOf(val.toUpperCase()) >= 0; });
    }

    // Filter lessons learned by tags
    filterLessons(lessons, tags){
        let filteredLsns = this.state.allLessons;

        if (tags) {
            // a lesson matches if the lesson's tags are a superset of desired tags
            // (the lesson can have 'extra' tags)
            filteredLsns = lessons.filter(lesson => {
                lesson.tags = lesson.tags.map(m => m.toUpperCase());
                return this.isSuper(lesson.tags, tags)
            });
        }

        return filteredLsns;
      }
  
    // load the lessons learned from the server with (optional) initial search tags
    async loadLessons(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const tags = urlParams.get('tags')
  
        let lessons = []
        let allTags = []
        try {
            lessons = await backend.getLessonsLearned();
            allTags = await backend.getAllTags(); // for autosuggest
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

    // Suggest tags to the user from existing tags
    autoSuggest = async (e) =>{
        var numSuggestions = 5; // change this to allow users to see XX suggested tags
        var showTags = [];
        if (e.currentTarget.value !== "" || e.currentTarget.value === defaultText) {
            showTags = this.state.allTags.filter((t) => t.indexOf(e.currentTarget.value.toUpperCase()) !== -1).slice(0, numSuggestions);
        }
        await this.setState ( {suggestedTags: showTags})
    }
  
    // On search, check for a backspace key
    // when the input is empty, this will start deleting existing search tags
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

    // Handle keypress on the tag input field -- specifically 
    // re-filter and display tags based on new filter criteria
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
        }
    }

    // Add a tag to the user's list of search tags
    addTag = (tag) =>{
        return () => {
            let sTags = this.state.searchTags;
            sTags.push(tag);
            let newDisplay = this.filterLessons(this.state.allLessons, sTags);
            this.setState({ searchTags: sTags, displayLessons: newDisplay, suggestedTags: [] });         
        }
    }

    // Remove a tag from the list of user's search tags
    removeTag = (index) =>{
        let sTags = this.state.searchTags;
        sTags.splice(index,1);

        let newDisplay = this.filterLessons(this.state.allLessons, this.state.searchTags);
        this.setState({ searchTags: sTags, displayLessons: newDisplay });
    }

    // Return a row that spans the whole table
    rowSpan(elem) {
        return <tr><td colSpan="2">{elem}</td></tr>
    }

    // Create the rows in the table based on lessons to be displayed
    getLessonsLearnedTableRows(){
        let tableRows = this.rowSpan("Loading")
        if (this.state){
            if (this.state.failed){
                tableRows = this.rowSpan("Failed to retrieve data from the server.")
            } else if(this.state.displayLessons.length<=0){
                tableRows = this.rowSpan("No lessons learned have been submitted.")
            } else {
                tableRows = this.state.displayLessons.map((lesson)=>{
                    return <Lesson key={lesson.date+Math.random()} lesson={lesson}/>
                })
            } 
        }
        return tableRows;
    }

    // Filter lessons learned based on the user entered search value
    // It will look for users keywords in the title or content
    // TODO - replace with contextual API call for "I think you wanted..."
    filterLessonsLearned = (value) =>{
        let text = value.toUpperCase()
        if (this.state){
            let dLessons = this.state.allLessons.filter((lesson)=>{
                return lesson.title.toUpperCase().indexOf(text) > -1 || lesson.content.toUpperCase().indexOf(text) > -1
            })
            this.setState({displayLessons: dLessons})
        }
    }

    // main Component render
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