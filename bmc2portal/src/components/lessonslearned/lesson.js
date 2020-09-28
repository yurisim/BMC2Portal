import React from 'react';

import '../../css/styles.css'
import '../../css/chips.css'
import '../../css/lesson.css'

import Chips from './chips.js'

export default class Lesson extends React.Component {

    render(){
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
                    style={{ textAlign:"left", width:"100%", backgroundColor:"unset",padding:"unset" }}
                    tags={this.props.lesson.tags}
                    isEdit={false}
                    hasRemove={false}
                    onClick={()=>{}} /></div>
            </td>
            </tr>)
    }
}