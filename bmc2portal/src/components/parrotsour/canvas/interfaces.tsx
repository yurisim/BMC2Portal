import { PicCanvasProps, PicCanvasState } from "./picturecanvas"

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

export type RedAir = {
    altitudes: AltStack,
    braaseye: Braaseye,
    trackDir?: string,
    label?: string,
}

export type Group = {
    startX: number,
    startY: number,
    x: number,
    y: number,
    heading: number,
    desiredHeading:number,
    z: number[],
    numContacts: number,
    type: string,
    label?: string;
}

export type drawAnswer = {
    pic: string,
    groups: any[]
}

export interface DrawFunction {
    (canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    props: PicCanvasProps,
    state: PicCanvasState,
    start?: Bullseye
    ): drawAnswer
}