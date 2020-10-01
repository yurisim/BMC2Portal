let baseURL=process.env.REACT_APP_SERVER_BASE_URL

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

// POST for formData with files
async function _postFiles(formData, url = "/api/uploadLOA"){
    const response = await fetch(baseURL+url, {
        method: "POST",
        body: formData,
    });
    return response; //response.json();
}

// These are the actual endpoints used by the application to retrieve data
// from the specified REACT_APP_SERVER_BASE_URL
let serverBackend = {

    // UPLOAD file
    async postFiles(formData){
        return _postFiles(formData).then((data)=> {return data});
    },

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
    },

    // SELECT * FROM ATCAGENCIES
    async getLOAList(){
        return get('/api/loas').then((data) => {return data});
    },

    // SELECT * FROM LESSONS LEARNED
    async getLessonsLearned(){
        return get('/api/lessonslearned').then((data) => {return data});
    },

    // SELECT DISTINCT TAGS FROM LESSONS LEARNED
    async getAllTags(){
        return get('/api/lessontags').then((data) => {return data});
    }
}

export default serverBackend;