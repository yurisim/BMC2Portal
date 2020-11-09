import { Airspace, ATCAgency, Backend, UnitInfo } from "./backendinterface";

class mBackend implements Backend {
    //-----------------------------------------------------------------------------
    //
    // Mock data generators for frontend only development
    //
    //-----------------------------------------------------------------------------
    // Mock endpoint for getting unit data
    unitMock(unitName:string){
        return {
            name: unitName,
            DSN: "405-867-5309",
            airfield: "KTIK",
            spinsLoc: "spins.pdf",
            ifgLoc: "ifg.pdf",
            logo: "logo.png"
        }
    }

    // Mock endpoint for getting ATC Agency data
    agencyMock(agency:string){
        return {
            name: agency,
            loas: [agency+"LOA.pdf"]
        }
    }

    // Mock endpoing for getting airspace data
    airspaceMock(aspaceName:string): Airspace{
        const atc =  (aspaceName === "W133" ? "Giantkiller": "Jacksonville Center");
        const loaLoc = [atc + " LOA.pdf"];
        return {
            name: aspaceName,
            atc: atc,
            loaLoc: loaLoc, // SELECT ATCAGENCY, LOALOC WHERE NAME=aspacename
            units: aspaceName + " FS,"+aspaceName+" FW",
            logo: aspaceName + ".png"
        }
    }

    // Mock endpoint for getting a lesson learned
    aLessonMock(tags:string[]){
        return {
            contributor: 'John McCarthy',
            validator: 'Scotty Seidenberger',
            date: '09/23/2020',
            title: "ipsum lorem lesson learned",
            tags: tags.map(t=>t.toUpperCase()),
            content: "This is a valid lesson learned about " + tags +"."
        }
    }

    // Mock endpoint for getting the lessons learned list
    lessonsMock(){
        const arr =[];
        arr.push(this.aLessonMock(["W122"]));
        arr.push(this.aLessonMock(["W122"]));
        arr.push(this.aLessonMock(["W133"]));
        arr.push(this.aLessonMock(["Red Flag"]));
        arr.push(this.aLessonMock(["W122","Red Flag"]));
        return arr;
    }
    
    //-----------------------------------------------------------------------------
    //
    // Backend API is the gateway to database data.
    //
    // For convenience, these calls have the associated pseudo-SQL
    //
    //-----------------------------------------------------------------------------

    postLessonLearned(title:string, author:string, content: string):Promise<Response>{
        return new Promise(()=>{return {title, author, content}})
    }

    // Mock SELECT * FROM UNITS WHERE NAME=unitname
    async getUnitInfo(unitName:string):Promise<UnitInfo>{
        // TODO - remove this and process data from server instead
        return new Promise(()=>{return this.unitMock(unitName)});
    }

    // Mock SELECT UNITNAME (DISTINCT), AFLD FROM UNITS
    async getUnitList(): Promise<UnitInfo[]>{
        const subarr = Array(10).fill("").map((_,x) => this.unitMock(x + " FS"));
        let arr = subarr;
        const subarr2 = Array(10).fill("").map((_,x) => this.unitMock(x + " FW"));
        arr = arr.concat(subarr2);
        arr.push(this.unitMock("42 FS"));
        return new Promise(()=>{return arr});
    }
    // Mock SELECT ATC, LOALOC FROM ATCAGENCIES
    async getLOAList(): Promise<ATCAgency[]>{
        const array:ATCAgency[] = [];
        array.push(this.agencyMock("Jacksonville Center"));
        array.push(this.agencyMock("FACSFAC VACAPES"));
        array.push(this.agencyMock("Denver ARTCC"));
        array.push(this.agencyMock("Houston ARTCC"));
        array.push(this.agencyMock("Memphis Center"));
        return new Promise(()=>{return array});
    }

    // Mock SELECT * FROM AIRSPACES
    async getAirspaceList():Promise<Airspace[]>{
        const array:Airspace[] = [];
        array.push(this.airspaceMock("W122"));
        array.push(this.airspaceMock("W133"));
        array.push(this.airspaceMock("W170"));
        return new Promise(()=>{return array});
    }

    // Mock SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename:string):Promise<Airspace>{
        return new Promise(()=>{return this.airspaceMock(aspacename)});
    }

    // Mock SELECT * FROM LESSONS_LEARNED
    async getLessonsLearned():Promise<Response>{
        return new Promise(()=>{return this.lessonsMock()})
    }

    // Mock GET ALL TAGS FROM LESSONS_LEARNED AND SPLIT ","
    async getAllTags(): Promise<Response>{
        return new Promise(()=>{return ["W122", "W1","W2","W3","W4","W5","W166","W177","W155","W151","RED FLAG"]});
    }
}

const mockBackend = new mBackend()

export default mockBackend