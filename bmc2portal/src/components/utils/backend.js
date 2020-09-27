
import serverBackend from './serverbackend'
import mockBackend from './mockbackend'

//console.log(process.env.SERVER_ADDR);

let backend = mockBackend;

// TODO - figure out how to determine production vs mock on frontend
let isProd = true;

if (isProd) {
    backend = serverBackend;
}

export default backend;
