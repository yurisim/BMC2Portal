let mockBackend = {
    // Mock fetch to ensure Promises are handled correctly?
    async getData(){
        let response = await fetch("https://jsonplaceholder.typicode.com/users")
        let data = response.json();
        return data;
    },

    // Mock endpoint for getting unit data
    unitMock(unitName){
        return {
            name: unitName,
            DSN: "405-867-5309",
            airfield: "KTIK",
            spinsLoc: "spins.pdf",
            ifgLoc: "ifg.pdf",
            logo: "logo.png"
        }
    },

    // Mock endpoint for getting ATC Agency data
    agencyMock(agency){
        return {
            name: agency,
            loas: [agency+"LOA.pdf"]
        }
    },

    // Mock endpoing for getting airspace data
    airspaceMock(aspaceName){
        let atc =  (aspaceName === "W133" ? "Giantkiller": "Jacksonville Center");
        let loaLoc = atc + " LOA.pdf";
        return {
            name: aspaceName,
            atcAgency: atc,
            loaLoc: loaLoc, // SELECT ATCAGENCY, LOALOC WHERE NAME=aspacename
            units: aspaceName + " FS,"+aspaceName+" FW",
        }
    },

    // Mock endpoint for getting a lesson learned
    aLessonMock(tags){
        return {
            contributor: 'John McCarthy',
            validator: 'Scotty Seidenberger',
            date: '09/23/2020',
            title: "ipsum lorem lesson learned",
            tags: tags.map(t=>t.toUpperCase()),
            content: "This is a valid lesson learned about " + tags +"."
        }
    },

    // Mock endpoint for getting the lessons learned list
    lessonsMock(){
        let arr =[];
        arr.push(this.aLessonMock(["W122"]));
        arr.push(this.aLessonMock(["W122"]));
        arr.push(this.aLessonMock(["W133"]));
        arr.push(this.aLessonMock(["Red Flag"]));
        arr.push(this.aLessonMock(["W122","Red Flag"]));
        return arr;
    },

    //-----------------------------------------------------------------------------
    //
    // Backend API is the gateway to database data.
    //
    // For convenience, these calls have the associated pseudo-SQL
    //
    //-----------------------------------------------------------------------------

    // Mock SELECT * FROM UNITS WHERE NAME=unitname
    async getUnitInfo(unitName){
        // eslint-disable-next-line
        let data = await this.getData();
        // TODO - remove this and process data from server instead
        return this.unitMock(unitName);
    },

    // Mock SELECT UNITNAME (DISTINCT), AFLD FROM UNITS
    async getUnitList(){
        // eslint-disable-next-line
        let data = await this.getData();
        let subarr = Array(10).fill().map((_,x) => this.unitMock(x + " FS"));
        let arr = subarr;
        let subarr2 = Array(10).fill().map((_,x) => this.unitMock(x + " FW"));
        arr = arr.concat(subarr2);
        arr.push(this.unitMock("42 FS"));
        return arr;
    },

    // Mock SELECT ATC, LOALOC FROM ATCAGENCIES
    async getLOAList(){
        // eslint-disable-next-line
        let data = await this.getData();
        let array = [];
        array.push(this.agencyMock("Jacksonville Center"));
        array.push(this.agencyMock("FACSFAC VACAPES"));
        array.push(this.agencyMock("Denver ARTCC"));
        array.push(this.agencyMock("Houston ARTCC"));
        array.push(this.agencyMock("Memphis Center"));
        return array;
    },

    // Mock SELECT * FROM AIRSPACES
    async getAirspaceList(){
        // eslint-disable-next-line
        let data = await this.getData();
        let array = [];
        array.push(this.airspaceMock("W122"));
        array.push(this.airspaceMock("W133"));
        array.push(this.airspaceMock("W170"));
        return array;
    },

    // Mock SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename){
        // eslint-disable-next-line
        let data = await this.getData();
        return this.airspaceMock(aspacename);
    },

    // Mock SELECT * FROM LESSONS_LEARNED
    async getLessonsLearned(){
        // eslint-disable-next-line
        let data = await this.getData();
        return this.lessonsMock();
    },

    // Mock GET ALL TAGS FROM LESSONS_LEARNED AND SPLIT ","
    async getAllTags(){
        // eslint-disable-next-line
        let data = await this.getData();
        return ["W122", "W1","W2","W3","W4","W5","W166","W177","W155","W151","RED FLAG"];
    }
  }

  export default mockBackend