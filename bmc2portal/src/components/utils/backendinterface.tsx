export type Airspace = {
    atc: string,
    loaLoc: string[],
    name: string,
    units: string,
    logo: string
}

export type UnitInfo = {
    name: string,
    DSN: string,
    airfield: string,
    spinsLoc: string,
    ifgLoc: string,
    logo: string
}

export type ATCAgency = {
    name: string,
    loaLoc: string[]
}

export type LessonLearned = {
    contributor: string,
    validator: string,
    date: string,
    title: string,
    tags: string[],
    content: string
}

export interface Backend {
    postFiles:{(data:FormData):Promise<Response>},
    postLessonLearned: {(title:string, author:string, content:string):Promise<string>},
    getAirspaceList: {():Promise<Airspace[]>},
    getAirspaceInfo: {(name:string):Promise<Airspace>},
    getUnitList: {():Promise<UnitInfo[]>},
    getUnitInfo: {(name:string):Promise<UnitInfo>},
    getLOAList: {():Promise<ATCAgency[]>},
    getLessonsLearned: {():Promise<LessonLearned[]>},
    getAllTags: {():Promise<string[]>}
}