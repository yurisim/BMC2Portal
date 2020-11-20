import React, { lazy, ReactElement } from 'react'

const ParrotSourHeader = lazy(()=>import('./parrotsourheader'))

import { PsQT } from './quicktips/psQT'

const ParrotSourChooser = ():ReactElement => {

    const buttonStyle = {
        width:"25%",
        margin:"5px"
    }

    function navigate (link:string): ()=>void {
        return ()=>{
            window.location.href = link
        }
    }   

    return (
        <div>
            <ParrotSourHeader comp={<PsQT/>}/>
            <br/>
            <hr/>
            <div style={{textAlign:"center"}}>
                <button style={buttonStyle} type="button" onClick={navigate("/msncrew/parrotsourintercept.html")}> Intercept </button>
                <button style={buttonStyle} type="button"> Procedural </button>
            </div>
        </div>
    )
}

export default ParrotSourChooser