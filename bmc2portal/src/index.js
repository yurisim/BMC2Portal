import React from "react";

import ReactDOM from "react-dom";
import BMC2Portal from "./BMC2Portal";

import Globe from 'react-globe.gl';

import './military-bases.geojson';

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

  return <Globe
    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

    labelsData={places}
    labelLat={d => d.record.fields.geo_point_2d.lat}
    labelLng={d => d.record.fields.geo_point_2d.lon}
    labelText=""
    labelLabel={d => <div>{d.record.fields.site_name}</div>}
    labelSize={0.2}
    labelDotRadius={.5}
    labelColor={() => 'rgba(165, 165, 265, 0.75)'}
    labelResolution={2}
  />;
};

// if we've navigated to the map, don't serve the react app - serve the globe
if (window.location.pathname==="/common/map.html"){
  ReactDOM.render(
    <React.StrictMode>
      <World />
    </React.StrictMode>,
    document.getElementById("root")
  ); 
// otherwise, render the react app 
} else {
  ReactDOM.render(
    <React.StrictMode>
      <BMC2Portal />
    </React.StrictMode>,
    document.getElementById("root")
  );
}