
import serverBackend from './serverbackend'
import mockBackend from './mockbackend'

let backend = mockBackend;

if (process.env.REACT_APP_SERVER_BASE_URL!=="FRONTEND") {
    backend = serverBackend;
}

export default backend;