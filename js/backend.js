
// remove these helper functions when database is integrated
async function getData(){
    let response = await fetch("https://jsonplaceholder.typicode.com/users")
    let data = response.json();
    return data;
}

// Delete when database integrated
function unitMock(unitName){
    return {
        name: unitName,
        DSN: "405-867-5309",
        airfield: "KTIK",
        spinsLoc: "spins.pdf",
        ifgLoc: "ifg.pdf",
        logo: "logo.png"
    }
}

// Delete when database integrated
function agencyMock(agency){
    return {
        name: agency,
        loaLoc: "<a href='#'>"+agency+"LOA.pdf</a>"
    }
}

// Delete when database integrated
function airspaceMock(aspaceName){
    let atc =  (aspaceName === "W133" ? "Giantkiller": "Jacksonville Center");
    let loaLoc = atc + " LOA.pdf";
    return {
        name: aspaceName,
        atcAgency: atc,
        loaLoc: "<a href='#'>" + loaLoc + "</a>", // SELECT ATCAGENCY, LOALOC WHERE NAME=aspacename
        units: aspaceName + " FS,"+aspaceName+" FW",
    }
}

// Delete when database integrated
function aLessonMock(tags){
    return {
        contributor: 'John McCarthy',
        validator: 'Scotty Seidenberger',
        date: '09/23/2020',
        title: "ipsum lorem lesson learned",
        tags: tags.map(t=>t.toUpperCase()),
        content: "This is a valid lesson learned about " + tags +"."
    }
}

// Delete when database integrated 
function lessonsMock(){
    let arr =[];

    arr.push(aLessonMock(["W122"]));
    arr.push(aLessonMock(["W122"]));
    arr.push(aLessonMock(["W133"]));
    arr.push(aLessonMock(["Red Flag"]));
    arr.push(aLessonMock(["W122","Red Flag"]));

    return arr;
}

//-----------------------------------------------------------------------------
//
// Backend API is the gateway to database data.
//
// For convenience, these calls have the associated pseudo-SQL
//
//-----------------------------------------------------------------------------

// SELECT * FROM UNITS WHERE NAME=unitname
async function getUnitInfo(unitName){

    // TODO replace this mock data with database query for unit's information
    let data = await getData();

    // TODO - remove this and process data from server instead
    return unitMock(unitName);
}

// SELECT UNITNAME (DISTINCT), AFLD FROM UNITS
async function getUnitList(){

    // TODO replace this mock data with database query for unit's information
    let data = await getData();

    // TODO - remove below and process data from server instead
    let subarr = Array(10).fill().map((_,x) => unitMock(x + " FS"));
    let arr = subarr;
    let subarr2 = Array(10).fill().map((_,x) => unitMock(x + " FW"));
    arr = arr.concat(subarr2);
    arr.push(unitMock("42 FS"));
    
    return arr;
}

// SELECT ATC, LOALOC FROM ATCAGENCIES
async function getLOAList(){
    // TODO replace mock data with a database query for ATC LOAs
    let data = await getData();

    // TODO - remove below and process data from server instead
    array = [];
    array.push(agencyMock("Jacksonville Center"));
    array.push(agencyMock("FACSFAC VACAPES"));
    array.push(agencyMock("Denver ARTCC"));
    array.push(agencyMock("Houston ARTCC"));
    array.push(agencyMock("Memphis Center"));
    return array;
}



// SELECT * FROM AIRSPACES
async function getAirspaceList(){
    // TODO replace mock data with a database query for airspaces
    let data = await getData();

    // TODO - remove below and process data from server instead
    array = [];
    array.push(airspaceMock("W122"));
    array.push(airspaceMock("W133"));
    array.push(airspaceMock("W170"));
    return array;
}

// SELECT * FROM AIRSPACES WHERE NAME = aspacename
async function getAirspaceInfo(aspacename){
    // TODO replace mock data with database query for a particular airspace
    let data = await getData();

    // TODO - remove below and process data from server instead
    return airspaceMock(aspacename);
}

// SELECT * FROM LESSONS_LEARNED
async function getLessonsLearned(){
    // TODO replace mock data with database query for a particular airspace
    let data = await getData();

    // TODO - remove below and process data from server instead
    return lessonsMock();
}

// GET ALL TAGS FROM LESSONS_LEARNED AND SPLIT ","
async function getAllTags(){
    // TODO replace mock data with database query
    let data = await getData();

    return ["W122", "W1","W2","W3","W4","W5","W166","W177","W155","W151","RED FLAG"];
}