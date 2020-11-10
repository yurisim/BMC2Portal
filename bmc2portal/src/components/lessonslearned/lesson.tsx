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
export default class Lesson extends React.PureComponent<LessonProps, Record<string,unknown>> {

    // do nothing to set tags (read-only tags display)
    emptyFunc = ():void => {
        // do nothing
    }

    render(): ReactElement {
        const { lesson } = this.props
        return (
            <tr>
            <td className="lessonTd">
                <div className='lessonDate'>Date: {lesson.date}</div>
                <div><div style={{float:"left"}}>Title: </div><div style={{textAlign:"center"}}>{lesson.title}</div></div>
                <br/>
                <div><div className='lessonContent'>{lesson.content}</div></div>
                <br/>
                <div className='lessonContrib'>Contributor: {lesson.contributor}</div>
                <div className='lessonValidator'>OSK Validator: {lesson.validator}</div>
                <br/>
                <div>
                <div style={{float:"left", paddingRight:"10px"}}>Tags:  </div>
                <Chips 
                    allTags={lesson.tags}
                    defaultText=""
                    setTags={this.emptyFunc}
                    tags={lesson.tags}
                    isEdit={false}
                    hasRemove={false}
                /></div>
            </td>
            </tr>)
    }
}