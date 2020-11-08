import React, { lazy, ReactElement, Suspense } from 'react'

const ParrotSourIntercept = lazy(()=>import("./parrotsourintercept"))

/**
 * The main entry class for a ParrotSour component
 * 
 * TODO - this will be wrapped with the "Procedural" and "Intercept" options
 * when procedural is done/converted to React & Typescript
 */
export default class ParrotSour extends React.Component {

    render(): ReactElement {
        return(
            <Suspense fallback={<div>Loading...</div>} >
                <ParrotSourIntercept/>
            </Suspense>            
        )
    }
}