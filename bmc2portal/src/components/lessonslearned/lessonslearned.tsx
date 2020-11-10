import React, { ReactElement } from 'react';

import backend from '../utils/backend'

import Lesson from './lesson'
import Chips from './chips'
import SearchInput from '../utils/searchinput'
import Form from './form'

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'
import '../../css/search.css'
import { LessonLearned } from '../utils/backendinterface';

const defaultText = "type and enter tag...";

type LLLState = {
    allLessons: LessonLearned[],
    allTags: string[],
    searchTags: string[],
    displayLessons: LessonLearned[],
    failed:boolean,
    isEdit:boolean,
}

/**
 * A Component to render a (optionally filtered) list of Lessons Learned.
 */
export default class LessonsLearnedList extends React.PureComponent<Record<string,unknown>, LLLState> {

    // construct component with empty state
    constructor(props:Record<string,unknown>){
        super(props);
        this.state = {
            allTags: [],
            searchTags: [],
            allLessons: [],
            displayLessons: [],
            failed: false,
            isEdit: false
        }
    }

    // Lifecycle - load lessons from server after the component has loaded
    componentDidMount():void{
        this.loadLessons();
    }

    // isSuper returns if arr1 is a superset of arr2
    // i.e. all of arr2 is in arr1
    isSuper(arr1:string[], arr2:string[]): boolean{
        return arr2.every(function(val) { return arr1.indexOf(val.toUpperCase()) >= 0; });
    }

    // Filter lessons learned by tags
    filterLessons(lessons:LessonLearned[], tags:string[]):LessonLearned[]{
        const {allLessons} = this.state
        let filteredLsns:LessonLearned[] = allLessons;

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
    async loadLessons(): Promise<void>{
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const tags = urlParams.get('tags')
  
        let lessons:LessonLearned[] = []
        let allTags:string[] = []
        try {
            lessons = await backend.getLessonsLearned();
            allTags = await backend.getAllTags(); // for autosuggest
        } catch {
            this.setState({failed:true})
        }

        const items:string[] = [];
        let tagSplit:string[] = [];
        if (tags){
            tagSplit = tags.split(',');
            tags.split(",").forEach((itm) => {
              items.push(itm.toUpperCase());
            })
        }

        const filteredLessons = this.filterLessons(lessons, tagSplit);

        this.setState({
            searchTags: items,
            allTags: allTags,
            allLessons: lessons,
            displayLessons: filteredLessons
        })
    }

    // Chips will call this function to handle when chips change
    setSearchTags = (tags:string[]):void => {
        const {allLessons} = this.state
        const newDisplay = this.filterLessons(allLessons, tags);
        this.setState({searchTags: tags, displayLessons:newDisplay})
    } 

    // Return a row that spans the whole table
    rowSpan(elem:JSX.Element|string):JSX.Element {
        return <tr><td colSpan={2}>{elem}</td></tr>
    }

    // Create the rows in the table based on lessons to be displayed
    getLessonsLearnedTableRows(): JSX.Element[]{
        const { failed, searchTags, displayLessons } = this.state
        let tableRows:JSX.Element[] = [this.rowSpan("Loading")]
        if (this.state){
            if (failed){
                tableRows = [this.rowSpan("Failed to retrieve data from the server.")]
            } else if(displayLessons.length<=0){
                tableRows = [this.rowSpan("No lessons learned with tags: " + 
                    (searchTags.length > 0 ? searchTags : " no tags."))]
            } else {
                tableRows = displayLessons.map((lesson)=>{
                    return <Lesson key={lesson.date+Math.random()} lesson={lesson}/>
                })
            } 
        }
        return tableRows;
    }

    // Filter lessons learned based on the user entered search value
    // It will look for users keywords in the title or content
    // TODO - replace with contextual API call for "I think you wanted..."
    filterLessonsLearned = (value:string):void =>{
        const text = value.toUpperCase()
        const { allLessons } = this.state
        if (this.state){
            const dLessons = allLessons.filter((lesson)=>{
                return lesson.title.toUpperCase().indexOf(text) > -1 || lesson.content.toUpperCase().indexOf(text) > -1
            })
            this.setState({displayLessons: dLessons})
        }
    }

    handleToggleEdit = ():void =>{
        this.setState(prevState=>({isEdit:!prevState.isEdit}))
    }

    // main Component render
    render(): ReactElement {
        const { searchTags, allTags, isEdit } = this.state
        return (
        <div>
            <Chips 
                isEdit
                hasRemove
                title="Search by lessons learned with Tags:"
                setTags={this.setSearchTags}
                tags={searchTags}
                allTags={allTags}
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
            <button type="button" onClick={this.handleToggleEdit} style={{marginLeft:"2em", borderRadius:"10px", width:"auto"}}>
                Add New
            </button>
            </div>
            {isEdit &&
                <Form
                    onClose={this.handleToggleEdit}
                />
            }
            <table id="lessonsLearnedTable" className="lessonsTable" style={{width:"100%"}}><tbody>
                {this.getLessonsLearnedTableRows()}
            </tbody></table>
          </div>
        )
    }
}