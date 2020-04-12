import React, { useState } from 'react';
import MapGL, { Marker, NavigationControl } from "react-map-gl"
import Pin from './Pin';
import './map.css';
import Form, { GroupItem } from "devextreme-react/form";
import '../new_register.css'

const geolocateStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 10
};

function MapNewRegister(props) {

    const { lat, lng } = props;

    const initialState = {
        latitude: lat,
        longitude: lng,
        zoom: 16,
        bearing: 0,
        pitch: 0,
        width: "500px",
        height: "430px"
    };

    // ViewPort box map
    const [viewport, setViewport] = useState(initialState);

    // Point market
    const [marker, setMarker] = useState({
        latitude: -2.15700,
        longitude: -79.71447
    });

    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        distanceFilter: 15
    };

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    // Detect location users
    navigator.geolocation.getCurrentPosition(position => {

        // Deserealize object
        const { latitude, longitude } = position.coords;

        // Set viewPort detected
        setViewport({
            ...viewport, //Copy others atributes not modifies
            latitude,
            longitude,
        });
        // Set market with position detected
        setMarker({ latitude, longitude });
    },
        error, options
    );

    // Change position market in map
    const onDragEnd = (marker) => {
        setMarker(marker);
        props.setPosition(marker)
    };

    return (
        <div style={styles.map}>
            <Form>
                <GroupItem caption={'Ubicación'}>
                    <MapGL
                        {...viewport}
                        mapStyle="mapbox://styles/mapbox/dark-v10"
                        onViewportChange={(event) => setViewport(event)}
                        //token mapbox
                        mapboxApiAccessToken={"pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"}
                    >
                        <Marker
                            longitude={marker.longitude}
                            latitude={marker.latitude}
                            offsetTop={-20}
                            offsetLeft={-10}
                            draggable
                            //onDragStart={this._onMarkerDragStart}
                            //onDrag={this._onMarkerDrag}
                            onDragEnd={(event) => onDragEnd({ latitude: event.lngLat[1], longitude: event.lngLat[0] })}
                        >
                            <Pin size={40} />

                        </Marker>

                        <div className="nav" style={geolocateStyle}>
                            <NavigationControl
                            //onViewportChange={this._updateViewport}
                            />
                        </div>
                    </MapGL>
                </GroupItem>
            </Form>
        </div>
    );

}

const styles = {
    map: {
        height: '100%',
        width: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    }
};

export default MapNewRegister;
