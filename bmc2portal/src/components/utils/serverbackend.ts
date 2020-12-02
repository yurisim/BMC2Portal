import { Airspace, ATCAgency, Backend, LessonLearned, UnitInfo } from "./backendinterface";

const baseURL=process.env.REACT_APP_SERVER_BASE_URL

// FETCH GET for server API
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

// FETCH PUT for server API
// eslint-disable-next-line
async function post(data:any, url = ''){
    const response = await fetch(baseURL+url, {
        method: "PUT", 
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

// POST for formData with files
async function _postFiles(formData:FormData, url = "/api/uploadLOA"){
    const response = await fetch(baseURL+url, {
        method: "POST",
        body: formData,
    });
    return response; //response.json();
}

class sBackend implements Backend {
    // PUT a lesson learned to the server
    async postLessonLearned(title:string, author:string, content:string):Promise<string>{
        const lesson = {
            title: title,
            author: author,
            content: content,
        }
        return post(lesson, '/api/lessonslearned').then((res) => {return (res.ok ? "OK" : "FAIL")});
    }

    // UPLOAD file
    async postFiles(formData:FormData): Promise<Response>{
        return _postFiles(formData).then((data)=> {return data});
    }

    // SELECT * FROM AIRSPACELIST
    async getAirspaceList(): Promise<Airspace[]>{
        return get('/api/airspacelist').then((data)=>{return data});
    }

    // SELECT * FROM AIRSPACES WHERE NAME = aspacename
    async getAirspaceInfo(aspacename:string): Promise<Airspace>{
        return get('/api/airspace/'+aspacename).then((data)=>{return data});
    }

    // SELECT * FROM UNITS 
    async getUnitList(): Promise<UnitInfo[]>{
        return get('/api/unitlist').then((data)=>{return data});
    }
    
    // SELECT * FROM UNITS WHERE NAME = name
    async getUnitInfo(unitname:string): Promise<UnitInfo>{
        return get('/api/unit/'+unitname).then((data)=>{return data});
    }
    
    // SELECT * FROM ATCAGENCIES
    async getLOAList(): Promise<ATCAgency[]>{
        return get('/api/loas').then((data) => {return data});
    }
    
    // SELECT * FROM LESSONS LEARNED
    async getLessonsLearned(): Promise<LessonLearned[]>{
        return get('/api/lessonslearned').then((data) => {return data});
    }

    // SELECT DISTINCT TAGS FROM LESSONS LEARNED
    async getAllTags(): Promise<string[]>{
        return get('/api/lessontags').then((data) => {return data});
    }
}

const serverBackend = new sBackend()

export default serverBackend;