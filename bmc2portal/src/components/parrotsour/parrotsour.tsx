import React, { lazy, ReactElement, Suspense } from 'react'
import ParrotSourChooser from './parrotsourchooser'

const ParrotSourIntercept = lazy(()=>import("./intercept/parrotsourintercept"))
const ParrotSourProcedural = lazy(()=>import("./procedural/parrotsourprocedural"))

type PSProps = {
    type: string,
}

/**
 * The main entry class for a ParrotSour component
 * 
 * TODO - this will be wrapped with the "Procedural" and "Intercept" options
 * when procedural is done/converted to React & Typescript
 */
//export default class ParrotSour extends React.Component {
const ParrotSour = (props: PSProps):ReactElement => {
    if (props.type==="chooser"){
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourChooser/>
            </Suspense>
        )
    } else if (props.type==="intercept")
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourIntercept/>
            </Suspense>
        )
    else {
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourProcedural/>
            </Suspense>
        )
    }
}

export default ParrotSour