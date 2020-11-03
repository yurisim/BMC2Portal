
export type Bullseye = {
    x: number,
    y: number,
}

export type BRAA = {
    bearing: string,
    range: number,
}

export type Braaseye = {
    bull: BRAA,
    braa: BRAA,
}

export type AltStack = {
    stack: string,
    fillIns: string,
}

export interface Group {
    startX: number,
    startY: number,
    x: number,
    y: number,
    heading: number,
    desiredHeading:number,
    z: number[],
    numContacts: number,
    type: string,
    label?: string
}