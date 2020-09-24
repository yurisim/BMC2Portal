
// remove these helper functions when database is integrated
async function getData(){
    let response = await fetch("https://jsonplaceholder.typicode.com/users")
    let data = response.json();
    return data;
}
function unitHelper(unitName){
    return {
        name: unitName,
        DSN: "405-867-5309",
        airfield: "KTIK",
        spinsLoc: "spins.pdf",
        ifgLoc: "ifg.pdf",
        logo: "logo.png"
    }
}

// SELECT * FROM UNITS WHERE NAME=unitname
async function getUnitInfo(unitName){

    // TODO replace this mock data with database query for unit's information
    let data = await getData();

    // TODO - remove this and process data from server instead
    return unitHelper(unitName);
}

// SELECT UNITNAME (DISTINCT), AFLD FROM UNITS
async function getUnitList(){

    // TODO replace this mock data with database query for unit's information
    let data = await getData();

    // TODO - remove below and process data from server instead
    let subarr = Array(10).fill().map((_,x) => unitHelper(x + " FS"));
    let arr = subarr;
    let subarr2 = Array(10).fill().map((_,x) => unitHelper(x + " FW"));
    arr = arr.concat(subarr2);
    arr.push(unitHelper("42 FS"));
    console.log(subarr)
    console.log(arr);
    
    return arr;
}

// Helper function for mock data. When database is linked remove this.
function getAgency(agency){
    return {
        name: agency,
        loaLoc: "<a href='#'>"+agency+"LOA.pdf</a>"
    }
}

// SELECT ATC, LOALOC FROM ATCAGENCIES
async function getLOAList(){
    // TODO replace mock data with a database query for ATC LOAs
    let data = await getData();

    // TODO - remove below and process data from server instead
    array = [];
    array.push(getAgency("Jacksonville Center"));
    array.push(getAgency("FACSFAC VACAPES"));
    array.push(getAgency("Denver ARTCC"));
    array.push(getAgency("Houston ARTCC"));
    array.push(getAgency("Memphis Center"));
    return array;
}

function getAirspace(aspaceName){
    let loaLoc = (aspaceName === "W133" ? "GiantkillerLOA.pdf": "JacksonvilleCenterLOA.pdf");
    return {
        name: aspaceName,
        loaLoc: "<a href='#'>" + loaLoc + "</a>", // SELECT ATCAGENCY, LOALOC WHERE NAME=aspacename
    }
}

// SELECT * FROM AIRSPACES
async function getAirspaceList(){
    // TODO replace mock data with a database query for airspaces
    let data = await getData();

    // TODO - remove below and process data from server instead
    array = [];
    array.push(getAirspace("W122"));
    array.push(getAirspace("W133"));
    array.push(getAirspace("W170"));
    return array;
}