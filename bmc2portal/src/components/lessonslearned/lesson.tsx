import React, { ReactElement } from 'react';

import Chips from './chips'

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'
import { LessonLearned } from '../utils/backendinterface';

type LessonProps = {
    lesson: LessonLearned
}

/**
 * A Component to render a lesson learned
 */
export default class Lesson extends React.Component<LessonProps, Record<string,unknown>> {

    render(): ReactElement {
        return (
            <tr>
            <td className="lessonTd">
                <div className='lessonDate'>Date: {this.props.lesson.date}</div>
                <div><div style={{float:"left"}}>Title: </div><div style={{textAlign:"center"}}>{this.props.lesson.title}</div></div>
                <br/>
                <div><div className='lessonContent'>{this.props.lesson.content}</div></div>
                <br/>
                <div className='lessonContrib'>Contributor: {this.props.lesson.contributor}</div>
                <div className='lessonValidator'>OSK Validator: {this.props.lesson.validator}</div>
                <br/>
                <div>
                <div style={{float:"left", paddingRight:"10px"}}>Tags:  </div>
                <Chips 
                    allTags={this.props.lesson.tags}
                    defaultText=""
                    setTags={()=>{ /* do nothing */ }}
                    style={{ textAlign:"left", width:"100%", backgroundColor:"unset",padding:"unset" }}
                    tags={this.props.lesson.tags}
                    isEdit={false}
                    hasRemove={false}
                /></div>
            </td>
            </tr>)
    }
}