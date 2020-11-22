import React, { lazy, ReactElement, Suspense } from 'react'
import {ParrotSourChooser} from './parrotsourchooser'

const ParrotSourIntercept = lazy(()=>import("../intercept/parrotsourintercept"))
const ParrotSourProcedural = lazy(()=>import("../procedural/parrotsourprocedural"))

type PSProps = {
    type: string,
    interceptLink?: string,
    proceduralLink?: string
}

/**
 * The main entry class for a ParrotSour component
 */
const ParrotSour = (props: PSProps):ReactElement => {
    if (props.type==="chooser"){
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourChooser 
                    interceptLink={props.interceptLink}
                    proceduralLink={props.proceduralLink}
                />
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