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
    const {type, interceptLink, proceduralLink} = props
    if (type==="chooser"){
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourChooser 
                    interceptLink={interceptLink}
                    proceduralLink={proceduralLink}
                />
            </Suspense>
        )
    } else if (type==="intercept")
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