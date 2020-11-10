import React, { lazy, Suspense } from "react";

import ReactDOM from "react-dom";
import BMC2Portal from "./BMC2Portal";

import './military-bases.geojson';

const Globe = lazy(()=>import("react-globe.gl"))

const { useState, useEffect } = React;

//
// A functional component to display the globe.
//
// Currently loads 100 active duty AF installations
const World = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch("https://public.opendatasoft.com/api/v2/catalog/datasets/military-bases/records?refine=component%3AAF%20Active&rows=-1&select=site_name&select=geo_point_2d&pretty=false&timezone=UTC").then(res => res.json())
      .then((features) => {setPlaces(features.records);console.log(features.records)});
  }, []);

  return (
    <Suspense fallback={
      <div>
        Loading...
      </div>}
    >
      <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          labelsData={places}
          // eslint-disable-next-line
          labelLat={(d:any) => {return d.record.fields.geo_point_2d.lat}}
          // eslint-disable-next-line
          labelLng={(d:any) => {return d.record.fields.geo_point_2d.lon}}
          // eslint-disable-next-line
          labelLabel={(d:any) => {return d.record.fields.site_name}}
          labelText=""
          labelSize={0.2}
          labelDotRadius={.5}
          labelColor={() => 'rgba(165, 165, 265, 0.75)'}
          labelResolution={2}
      />
  </Suspense>)
};

// if we've navigated to the map, don't serve the react app - serve the globe
if (window.location.pathname==="/common/map.html"){
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <World />
      </Suspense>
    </React.StrictMode>,
    document.getElementById("root")
  ); 
// otherwise, render the react app 
} else {
  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <BMC2Portal />
      </Suspense>
    </React.StrictMode>,
    document.getElementById("root")
  );
}