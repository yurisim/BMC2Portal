
let backend = {};

let isProd = process.env.NODE_ENV === "production";

isProd = true;

console.log(process.env.SERVER_ADDR);

let baseURL = "http://localhost:8080"

// FETCH GET for server API method implementation:
async function get(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(baseURL+url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

if (isProd) {

  backend = {
      getAirspaceList(){
          return get('/api/airspacelist').then((data)=>{return data});
      },

    // SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename){
        return get('/api/airspace/'+aspacename).then((data)=>{return data});
    },
  }

} else {
  backend = {
    // remove these helper functions when database is integrated
    async getData(){
        let response = await fetch("https://jsonplaceholder.typicode.com/users")
        let data = response.json();
        return data;
    },

    // Delete when database integrated
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

    // Delete when database integrated
    agencyMock(agency){
        return {
            name: agency,
            loaLoc: agency+"LOA.pdf"
        }
    },

    // Delete when database integrated
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

    // Delete when database integrated
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

    // Delete when database integrated 
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

    // SELECT * FROM UNITS WHERE NAME=unitname
    async getUnitInfo(unitName){

        // TODO replace this mock data with database query for unit's information
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove this and process data from server instead
        return this.unitMock(unitName);
    },

    // SELECT UNITNAME (DISTINCT), AFLD FROM UNITS
    async getUnitList(){

        // TODO replace this mock data with database query for unit's information
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove below and process data from server instead
        let subarr = Array(10).fill().map((_,x) => this.unitMock(x + " FS"));
        let arr = subarr;
        let subarr2 = Array(10).fill().map((_,x) => this.unitMock(x + " FW"));
        arr = arr.concat(subarr2);
        arr.push(this.unitMock("42 FS"));
        
        return arr;
    },

    // SELECT ATC, LOALOC FROM ATCAGENCIES
    async getLOAList(){
        // TODO replace mock data with a database query for ATC LOAs
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove below and process data from server instead
        let array = [];
        array.push(this.agencyMock("Jacksonville Center"));
        array.push(this.agencyMock("FACSFAC VACAPES"));
        array.push(this.agencyMock("Denver ARTCC"));
        array.push(this.agencyMock("Houston ARTCC"));
        array.push(this.agencyMock("Memphis Center"));
        return array;
    },

    // SELECT * FROM AIRSPACES
    async getAirspaceList(){
        // TODO replace mock data with a database query for airspaces
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove below and process data from server instead
        let array = [];
        array.push(this.airspaceMock("W122"));
        array.push(this.airspaceMock("W133"));
        array.push(this.airspaceMock("W170"));
        return array;
    },

    // SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename){
        // TODO replace mock data with database query for a particular airspace
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove below and process data from server instead
        return this.airspaceMock(aspacename);
    },

    // SELECT * FROM LESSONS_LEARNED
    async getLessonsLearned(){
        // TODO replace mock data with database query for a particular airspace
        // eslint-disable-next-line
        let data = await this.getData();

        // TODO - remove below and process data from server instead
        return this.lessonsMock();
    },

    // GET ALL TAGS FROM LESSONS_LEARNED AND SPLIT ","
    async getAllTags(){
        // TODO replace mock data with database query
        // eslint-disable-next-line
        let data = await this.getData();

        return ["W122", "W1","W2","W3","W4","W5","W166","W177","W155","W151","RED FLAG"];
    }
  }
}

export default backend;
