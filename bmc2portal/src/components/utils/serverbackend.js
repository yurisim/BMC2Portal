let baseURL = "http://localhost:8080"

// FETCH GET for server API method implementation:
async function get(url = '') {
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

let serverBackend = {
    // SELECT * FROM AIRSPACELIST
    async getAirspaceList(){
        return get('/api/airspacelist').then((data)=>{return data});
    },

    // SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename){
        return get('/api/airspace/'+aspacename).then((data)=>{return data});
    },

    // SELECT * FROM UNITS 
    async getUnitList(){
        return get('/api/unitlist').then((data)=>{return data});
    },

    // SELECT * FROM UNITS WHERE NAME = name
    async getUnitInfo(unitname){
        return get('/api/unit/'+unitname).then((data)=>{return data});
    }
}

export default serverBackend;