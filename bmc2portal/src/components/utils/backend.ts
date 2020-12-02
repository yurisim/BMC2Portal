
import serverBackend from './serverbackend'
import mockBackend from './mockbackend'
import { Backend } from './backendinterface';

let backend:Backend = mockBackend;

// If we're given a server address fron the .env files, use the real server
// else, use the mockBackend for test data
if (process.env.REACT_APP_SERVER_BASE_URL!=="FRONTEND" && process.env.REACT_APP_SERVER_BASE_URL !==undefined) {
    backend = serverBackend;
}

export default backend;