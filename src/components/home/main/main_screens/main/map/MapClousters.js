import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from "react-map-gl";
import useSupercluster from "use-supercluster";
import './Map.css';
import { db } from '../../../../../../firebase/Firebase';

function MapClousters() {

    // Define states
    const [data, setData] = useState([]);

    // Define others resource
    const colors = ['#d5d829', '#d88229', '#ff1f1f', '#3920c1', '#000000'];
    const icons = ['circulo1', 'circulo2', 'circulo3', 'circulo4', 'circulo5'];
    const popupColors = ['#fbff01', '#ff6e08', '#ff0808', '#0e3ff3', '#000000'];

    //configurar mapa
    const [viewport, setViewport] = useState({
        latitude: -2.1372059,
        longitude: -79.9843198,
        //tamanio de la pantalla
        width: "100%",
        height: "100%",
        zoom: 10
    });

    //configurar mapa
    const [showPopup, setPopup] = useState({
        latitudePopup: -2.1372059,
        longitudePopup: -79.9843198,
        show: false,
        type_user: "",
        name: "",
        last_name: "",
        phone: "",
        date_create: "",
        description: ""
    });

    // Create coleccion
    const require_helps = db.collection('require_helps');

    useEffect(() => {
        //OBTIENE DATOS DEL DOCUMENTO 'require_helps'
        require_helps.get()
            .then((querySnapshot) => {
                const array = [];
                querySnapshot.forEach((doc) => {
                    //SE OBTIENE CADA CAMPO PARA OBTENER LA INFO PARA EL MARKER Y POPUP
                    array.push({ "id": doc.id, "latitude": doc.data().marker.latitude, "longitude": doc.data().marker.longitude, "type": doc.data().state, "name": doc.data().personal_data.nombres, "last_name": doc.data().personal_data.apellidos, "phone": doc.data().personal_data.telefono, "date_create": "07/04/2020" });
                });
                setData(array);
            })
            .catch(error => console.log("Error : ", error.message));
    }, []);

    //referencia a un objeto que puede cambiar el valor (div, botones, mapa)
    const mapRef = useRef();

    //sin limite
    const users = data ? data : [];

    //formato que necesita superclusters 
    const points = users.map(user => ({
        type: "Feature",
        properties: {
            cluster: false,
            user_id: user.id,
            type_user: user.type,
            name: user.name,
            last_name: user.last_name,
            phone: user.phone,
            date_create: user.date_create,
            description: ""
        },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(user.longitude),
                parseFloat(user.latitude)
            ]
        }
    }));

    //limites mapa
    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    //crear clusters o grupos
    //cluster = true - false (grupo - usern)
    //hook
    const { clusters, supercluster } = useSupercluster({
        //puntos
        points,
        //zoom
        zoom: viewport.zoom,
        //limites del mapa
        bounds,
        //opciones para superclusters
        options: { radius: 50, maxZoom: 30 }
    })

    //pasarle informacion al componente
    return (
        <main style={styles.main}>
            <ReactMapGL
                {...viewport}
                maxZoom={20}
                //token mapbox
                mapboxApiAccessToken={"pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                // mapStyle="mapbox://styles/mapbox/streets-v11"
                onClick={() => { setPopup({ show: false }); }}
                onDblClick={() => {
                    setPopup({ show: false });
                    setViewport({
                        ...viewport,
                        latitude: -2.1372059,
                        longitude: -79.9843198,
                        zoom: 10
                    });
                }}

                //actualizar la nueva posicion 
                onViewportChange={newViewport => {
                    setViewport({ ...newViewport });
                }}
                ref={mapRef}
            >

                {showPopup.show && <Popup
                    latitude={showPopup.latitudePopup}
                    longitude={showPopup.longitudePopup}
                    closeButton={true}
                    closeOnClick={false}
                    offsetTop={10}
                    dynamicPosition={true}
                    onClose={() => setPopup({ show: false })}
                    anchor="top" >

                    <div>
                        <div className="content">
                            <table className="customers">
                                <thead>
                                    <tr style={{ background: `${popupColors[parseInt(showPopup.type_user)]}` }}>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Fecha Ingreso</th>
                                        <th>Telefono</th>
                                        <th>Ayudar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{showPopup.name}</td>
                                        <td>{showPopup.last_name}</td>
                                        <td>{showPopup.date_create}</td>
                                        <td>{showPopup.phone}</td>
                                        <td><i className='fas fa-hand-holding-medical' style={styles.iconStyles} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </Popup>}
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    //const [tipo] = cluster.properties.type_user;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                    } = cluster.properties;
                    if (isCluster) {
                        return (
                            //cada cluster tiene un Id q representa el grupo
                            <Marker
                                key={cluster.id}
                                latitude={latitude}
                                longitude={longitude}
                            >
                                <div
                                    className="cluster-marker"
                                    style={{
                                        width: `${10 + (pointCount / points.length) * 50}px`,
                                        height: `${10 + (pointCount / points.length) * 50}px`,
                                        background: `${(pointCount > 0 && pointCount < 20) ? colors[0] : ((pointCount > 19 && pointCount < 100) ? colors[1] : ((pointCount > 100) ? colors[2] : colors[2]))}`
                                    }}
                                    onClick={() => {
                                        const expansionZoom = Math.min(
                                            supercluster.getClusterExpansionZoom(cluster.id),
                                            20
                                        );
                                        setViewport({
                                            ...viewport,
                                            zoom: expansionZoom,
                                            latitude,
                                            longitude,
                                            transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
                                            transitionDuration: "auto"
                                        });
                                        setPopup({ show: false });
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    } else {
                        return (<Marker
                            key={cluster.properties.user_id}
                            latitude={latitude}
                            longitude={longitude}
                        >
                            <div className={`circle ${icons[cluster.properties.type_user]}`}
                                onClick={() => {
                                    setViewport({
                                        ...viewport,
                                        zoom: (viewport.zoom + 5),
                                        latitude,
                                        longitude,
                                        transitionInterpolator: new FlyToInterpolator({ speed: 3 }),
                                        transitionDuration: "auto"
                                    });

                                    setPopup({
                                        ...showPopup,
                                        latitudePopup: latitude,
                                        longitudePopup: longitude,
                                        show: true,
                                        type_user: `${cluster.properties.type_user} `,
                                        name: `${cluster.properties.name} `,
                                        last_name: `${cluster.properties.last_name} `,
                                        phone: `${cluster.properties.phone} `,
                                        date_create: `${cluster.properties.date_create} `,
                                        description: `${cluster.properties.description} `
                                    });
                                }}
                            />
                        </Marker>
                        );
                    }
                })}
            </ReactMapGL>
        </main >
    );

}

export default MapClousters;

const styles = {
    main: {
        display: 'grid',
        'grid-area': 'content',
        width: 'calc(100vw - 247px)',
        height: 'calc(100vh - 50px)'
    },
    iconStyles: {
        fontSize: 26,
        color: 'black',
        marginRight: 10
    }
};