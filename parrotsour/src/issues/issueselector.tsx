import React, { ReactElement } from "react";

type IssueSelectorProps = {
    selectionChanged: (val:string)=>()=>void
}

export default class IssueSelector extends React.PureComponent<IssueSelectorProps, Record<string,unknown>>{

    render():ReactElement {
       const { selectionChanged } = this.props
       return (
        <div className="pscontainer">
            <h2><u>Problem:</u></h2>
            <ul>
                <li>
                    <input
                        style={{color:"grey"}}
                        type="radio"
                        id="picprob"
                        name="issue"
                        value="picprob"
                        defaultChecked
                        onChange={selectionChanged("picprob")}
                    />
                    <label htmlFor="picprob" style={{color:"grey"}}>The answer to this picture is incorrect</label>
                    <div className="check-no-hover" />
                </li>
                <li>
                    <input
                        type="radio"
                        id="othprob"
                        name="issue"
                        value="othprob"
                        onChange={selectionChanged("othprob")}
                    />
                    <label htmlFor="othprob">Something else </label> 
                    <div className="check-no-hover" />
                </li>
            </ul>
        </div>)
   }
}