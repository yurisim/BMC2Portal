import React from 'react';

import backend from '../utils/backend.js'

import Lesson from './lesson'
import Chips from './chips'
import SearchInput from '../utils/searchinput'
import Form from './form'

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'
import '../../css/search.css'

const defaultText = "type and enter tag...";

/**
 * A Component to render a (optionally filtered) list of Lessons Learned.
 */
export default class LessonsLearnedList extends React.Component {

    // construct component with empty state
    constructor(){
        super();
        this.state = {
            allTags: [],
            searchTags: [],
            allLessons: [],
            displayLessons: [],
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

    // Chips will call this function to handle when chips change
    setSearchTags = (tags) => {
        let newDisplay = this.filterLessons(this.state.allLessons, tags);
        this.setState({searchTags: tags, displayLessons:newDisplay})
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
                tableRows = this.rowSpan("No lessons learned with tags: " + 
                    (this.state.searchTags.length > 0 ? this.state.searchTags : " no tags."))
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

    toggleEdit = () =>{
        this.setState({isEdit:!this.state.isEdit})
    }

    // main Component render
    render() {
        return (
        <div>
            <Chips 
                isEdit={true}
                hasRemove={true}
                title="Search by lessons learned with Tags:"
                setTags={this.setSearchTags}
                tags={this.state.searchTags}
                allTags={this.state.allTags}
                defaultText={defaultText}
            />
            <br/>
            <div className="searchDiv">
                <SearchInput 
                    searchFunc={this.filterLessonsLearned}
                    label="Search Contents:"
                />
            </div>

            <br/>
            <div style={{textAlign:"center"}}> Lessons Learned 
            <button onClick={this.toggleEdit} style={{marginLeft:"2em", borderRadius:"10px", width:"auto"}}>
                Add New
            </button>
            </div>
            {this.state.isEdit &&
                <Form
                    onClose={this.toggleEdit}
                />
            }
            <table id="lessonsLearnedTable" className="lessonsTable" style={{width:"100%"}}><tbody>
                {this.getLessonsLearnedTableRows()}
            </tbody></table>
          </div>
        )
    }
}