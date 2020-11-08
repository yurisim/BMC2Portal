
import serverBackend from './serverbackend'
import mockBackend from './mockbackend'

let backend:Record<string,unknown> = mockBackend;

// If we're given a server address fron the .env files, use the real server
// else, use the mockBackend for test data
if (process.env.REACT_APP_SERVER_BASE_URL!=="FRONTEND" && process.env.REACT_APP_SERVER_BASE_URL !==undefined) {
    backend = serverBackend;
}

export default backend;