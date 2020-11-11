import React, { lazy, ReactElement, Suspense } from 'react'

const ParrotSourIntercept = lazy(()=>import("./intercept/parrotsourintercept"))

/**
 * The main entry class for a ParrotSour component
 * 
 * TODO - this will be wrapped with the "Procedural" and "Intercept" options
 * when procedural is done/converted to React & Typescript
 */
//export default class ParrotSour extends React.Component {
const ParrotSour = ():ReactElement => {
    return(
        <Suspense fallback={<div>Loading...</div>} >
            <ParrotSourIntercept/>
        </Suspense>
    )
}

export default ParrotSour