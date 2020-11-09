export type Airspace = {
    atc: string,
    loaLoc: string[],
    name: string,
    units: string,
    logo: string
}

export type ATCAgency = {
    name: string,
    loas: string[]
}

export interface Backend {
    postLessonLearned: {(title:string, author:string, content:string):Promise<Response>},
    getAirspaceList: {():Promise<Airspace[]>},
    getAirspaceInfo: {(name:string):Promise<Airspace>},
    getUnitList: {():Promise<Response>},
    getUnitInfo: {(name:string):Promise<Response>},
    getLOAList: {():Promise<ATCAgency[]>},
    getLessonsLearned: {():Promise<Response>},
    getAllTags: {():Promise<Response>}
}