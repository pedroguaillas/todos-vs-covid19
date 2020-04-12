import React, { useState, useRef, useEffect } from 'react';
//import useSwr from "swr";
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from "react-map-gl";
import useSupercluster from "use-supercluster";
import './Map.css';
import { db } from '../../../../../firebase/Firebase'

//hook para traer datos remotos
//cargar los datos, recibe argumentos(url), pasar los mismos args a la funcion fetch que viene del navegador, 
//feth devulve una promesa, con esa promesa tenemos que cambiar esa respuesta a json
const fetcher = (...args) => fetch(...args).then(response => response.json());

function MapClousters() {

    const colors = ['#d5d829', '#d88229', '#ff1f1f', '#3920c1', '#000000'];
    const icons = ['circulo1', 'circulo2', 'circulo3', 'circulo4', 'circulo5'];
    const popupColors = ['#fbff01', '#ff6e08', '#ff0808', '#0e3ff3', '#000000'];
    const arrayLista = [];

    /*const [data, setData] = useState([
                    {"id" : 1, "latitude": -2.1372059, "longitude" : -79.9843198, "type" : 1, "name" : "prueba1", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 2, "latitude": -2.1372059, "longitude" : -79.8543198, "type" : 2, "name" : "prueba2", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 3, "latitude": -2.1373059, "longitude" : -80.9844198, "type" : 3,"name" : "prueba3", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 4, "latitude": -2.1374059, "longitude" : -79.1046198, "type" : 1,"name" : "prueba4", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 5, "latitude": -2.1372059, "longitude" : -79.1047198, "type" : 1,"name" : "prueba5", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 6, "latitude": -2.1375059, "longitude" : -79.1082198, "type" : 1,"name" : "prueba6", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 7, "latitude": -2.1376059, "longitude" : -79.1043198, "type" : 1,"name" : "prueba7", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 8, "latitude": -2.1377059, "longitude" : -79.1076198, "type" : 2,"name" : "prueba8", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 9, "latitude": -2.1378059, "longitude" : -79.1064198, "type" : 2,"name" : "prueba9", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 10, "latitude": -2.1542059, "longitude" : -79.1123198, "type" : 1,"name" : "prueba10", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 11, "latitude": -2.1322059, "longitude" : -79.1093198, "type" : 2,"name" : "prueba11", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 12, "latitude": -2.1342059, "longitude" : -79.1053498, "type" : 3,"name" : "prueba12", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 13, "latitude": -2.1312059, "longitude" : -79.1043878, "type" : 4,"name" : "prueba13", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 14, "latitude": -2.1332059, "longitude" : -79.1043238, "type" : 3,"name" : "prueba14", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 15, "latitude": -2.1356059, "longitude" : -79.1046598, "type" : 4,"name" : "prueba15", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 16, "latitude": -2.1334059, "longitude" : -79.1040998, "type" : 3,"name" : "prueba16", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 17, "latitude": -2.1386059, "longitude" : -79.10445198, "type" : 3,"name" : "prueba17", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 18, "latitude": -2.1386059, "longitude" : -79.25853198, "type" : 1,"name" : "prueba18", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 19, "latitude": -2.1372349, "longitude" : -79.3043198, "type" : 3,"name" : "prueba19", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 20, "latitude": -2.1034559, "longitude" : -79.9043198, "type" : 4,"name" : "prueba20", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"},
                    {"id" : 21, "latitude": -2.1345059, "longitude" : -79.3643198, "type" : 5,"name" : "prueba21", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"}
    ]);*/
    const [data, setData] = useState([]);

    //data.push


    //console.log(data);
    //configurar mapa
    const [viewport, setViewport] = useState({
        latitude: -2.1372059,
        longitude: -79.9843198,
        //tamanio de la pantalla
        width: "80vw",
        height: "85vh",
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

    useEffect(() => {
        //OBTIENE DATOS DEL DOCUMENTO 'patient_register'
        db.collection("patient_register").get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data().data.marker);
                    //SE OBTIENE CADA CAMPO PARA OBTENER LA INFO PARA EL MARKER Y POPUP
                    arrayLista.push({ "id": doc.id, "latitude": doc.data().data.marker.latitude, "longitude": doc.data().data.marker.longitude, "type": doc.data().data.marker.tipo, "name": doc.data().data.nombres, "last_name": doc.data().data.apellidos, "phone": doc.data().data.telefono, "date_create": "07/04/2020" });
                    setData(arrayLista);
                    //setData([...data,{"id" : doc.id, "latitude": doc.data().data.marker.latitude, "longitude" : doc.data().data.marker.longitude, "type" : 1, "name" : "prueba1", "last_name" : "prueba1", "phone" : "0985727460", "date_create" : "07/04/2020"}]);
                });
            })
            .catch(function (error) {
                //console.log("Error getting documents: ", error);
            });
    }, []);

    //referencia a un objeto que puede cambiar el valor (div, botones, mapa)
    const mapRef = useRef();

    //cargar datos desde url objeto json
    /*const url = "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2020-01";
    //devuelve los datos y 1 error
    //const {data, error} = useSwr(url, fetcher);
    console.log('Data: '+data);
    //cargar los crimenes caso contrario 0 
    //mostrar solo 200
    //const crimes = data && !error ? data.slice(0, 1) : [];
    //const crimes = data  ? data.slice(0, 1) : [];
    //console.log(crimes);
    */
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

    //console.log(clusters);
    //pasarle informacion al componente
    return (
        <ReactMapGL
            {...viewport}
            maxZoom={20}
            //token mapbox
            mapboxApiAccessToken={"pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"}
            mapStyle="mapbox://styles/mapbox/streets-v11"
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
    );

}

export default MapClousters;

const styles = {
    iconStyles: {
        fontSize: 26,
        color: 'black',
        marginRight: 10
    }
};