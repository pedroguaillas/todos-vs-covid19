import React, { useState, useEffect } from 'react';
import MapGL, { Marker, NavigationControl } from "react-map-gl";
import Pin from './Pin';
import './Map.css';

const geolocateStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 10
};

function Map(props) {

    // Define States
    const [viewport, setViewport] = useState({
        latitude: -2.15700,
        longitude: -79.71447,
        zoom: 15,
        bearing: 0,
        pitch: 0,
        width: "35vw",
        height: "55vh"
    });

    //Effect viewport & market with position
    useEffect(() => {

        // Detect location users
        navigator.geolocation.getCurrentPosition(position => {

            // Deserealize object
            const { latitude, longitude } = position.coords;

            // Set viewPort detected
            setViewport({
                ...viewport, //Copy others atributes not modifies
                latitude,
                longitude,
            })

            // Set market with position detected
            props.setMarker({ latitude, longitude });
        },
            error => console.log('Error position: ' + error.message)
        )

    }, []);

    // Change position market in map
    // const onDragEnd = (marker) => {
    //     setMarker(marker)
    //     // props.setPosition(marker)
    // }

    return (
        <MapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={(event) => setViewport(event)}
            //token mapbox
            mapboxApiAccessToken={"pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"}
        >
            <Marker
                longitude={props.marker.longitude}
                latitude={props.marker.latitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                //onDragStart={this._onMarkerDragStart}
                //onDrag={this._onMarkerDrag}
                onDragEnd={(event) => props.setMarker({ latitude: event.lngLat[1], longitude: event.lngLat[0] })}
            >
                <Pin size={40} />

            </Marker>

            <div className="nav" style={geolocateStyle}>
                <NavigationControl
                //onViewportChange={this._updateViewport} 
                />
            </div>
        </MapGL>
    );

}

export default Map;