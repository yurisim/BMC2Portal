
import serverBackend from './serverbackend'
import mockBackend from './mockbackend'

let backend = mockBackend;

if (process.env.REACT_APP_SERVER_BASE_URL!=="FRONTEND" && process.env.REACT_APP_SERVER_BASE_URL !==undefined) {
    backend = serverBackend;
}

export default backend;