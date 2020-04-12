import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { db } from '../../../../../firebase/Firebase';
import notify from "devextreme/ui/notify";
import './symptoms.css';
import Form, { GroupItem, SimpleItem, ButtonItem, RequiredRule, NumericRule, StringLengthRule } from "devextreme-react/form";
import Map from './map/Map';

function CovidSymptoms(props) {

    // Define states
    const [symptoms, setSymptoms] = useState({});
    const [marker, setMarket] = useState({
        latitude: -2.15700,
        longitude: -79.71447
    });

    // Get SymptomsStore of Store
    const { CovidStore, SymptomsStore } = props;

    // Deserealize id user from CovidStore
    const { personal_data, id_user } = CovidStore;

    const { nombres, apellidos } = personal_data;

    // Get symptoms from SymptomsStore
    const { covid_symptoms } = SymptomsStore;

    // Effect symptoms with covid_symptoms
    useEffect(() => {
        const array = [];
        const obj = Object.entries(covid_symptoms)
        obj.forEach(item => {
            array.push(item);
        });
        const objt = Object.fromEntries(array);
        setSymptoms({ ...objt })
    }, []);

    // Move market position
    const setPosition = (marker) => {
        setMarket(marker);
    }

    // // Create coleccion
    // const users = db.collection('users');

    // // Save symptoms of user
    // const onSubmit = (e) => {
    //     e.preventDefault();

    //     let tipo = 0;
    //     if (covid_symptoms.fiebre || covid_symptoms.congestión_nasal) {
    //         tipo = 0;
    //     } else if (covid_symptoms.diarrea || covid_symptoms.tos_seca) {
    //         tipo = 1;
    //     } else if (covid_symptoms.dificultad_para_respirar_ahogo || covid_symptoms.escalofríos) {
    //         tipo = 2;
    //     } else if (covid_symptoms.cansancio_malestar_general || covid_symptoms.dolores_musculares) {
    //         tipo = 3;
    //     } else {
    //         tipo = 4;
    //     }

    //     users.doc(id_user).update({ tipo, symptoms, marker })
    //         .then(() => {
    //             notify({ message: "Se ha registrado sus sintomas", width: 300, }, "success", 1500);
    //         })
    // };

    // Create coleccion
    const require_helps = db.collection('require_helps');

    // Save symptoms of user
    const onSubmit = (e) => {
        e.preventDefault();

        let state = 0;
        let tiene_conrona_virus = null;

        if (symptoms['tiene_conrona_virus']) {
            if (covid_symptoms.dolor_garganta || covid_symptoms.fiebre ||
                covid_symptoms.tos_seca || covid_symptoms.dolor_garganta || covid_symptoms.congestión_nasal) {
                state = 1;
            } else if (covid_symptoms.dificultad_para_respirar_ahogo || covid_symptoms.dolores_musculares || covid_symptoms.debilidad_corporal) {
                state = 2;
            } else {
                state = 3;
            }
            tiene_conrona_virus = true
        } else {
            tiene_conrona_virus = false
        }

        let person = { nombres, apellidos };

        person.edad = symptoms.edad
        person.telefono = symptoms.telefono
        person.direccion = symptoms.direccion
        person.date_create = (new Date()).toLocaleDateString();

        delete symptoms.edad
        delete symptoms.telefono
        delete symptoms.direccion
        delete symptoms['tiene_conrona_virus']

        const array = [];
        const obj = Object.entries(symptoms)
        obj.forEach(item => {
            const value = (item[1]);
            if ((value)) {
                array.push(item[0])
            }
        });

        require_helps.doc(id_user).get()
            .then((doc) => {
                if (doc.exists) {
                    notify({ message: "Ya se ha registrado sus sintomas", width: 300, }, "error", 1000);
                } else {
                    require_helps.doc(id_user).set({ id_user, personal_data: person, tiene_conrona_virus, review: false, state, symptoms: array, marker })
                        .then(() => {
                            notify({ message: "Se ha registrado sus sintomas", width: 300, }, "success", 1500);
                        })
                        .catch(error => console.log('error: ' + error.message))
                }
            })
    }

    return (
        <div className={'symptoms-container'}>
            <div style={styles.formContainer}>
                <form action="" onSubmit={onSubmit}>
                    <Form
                        formData={symptoms}
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                        validationGroup="symptoms"
                    >
                        <GroupItem caption={'Escoja los sintomas que presenta'}>
                            <GroupItem colCount={2}>
                                {Object.keys(covid_symptoms).map(item => {
                                    return (
                                        <SimpleItem key={item} dataField={item} editorType="dxCheckBox" />
                                    )
                                })}
                            </GroupItem>
                        </GroupItem>

                        <GroupItem caption={'Otros datos'}>

                            <GroupItem colCount={2}>
                                <SimpleItem dataField={'edad'} editorType="dxTextBox" >
                                    <RequiredRule message="Ingrese la edad" />
                                    <NumericRule message="Ingrese solo números" />
                                    <StringLengthRule message="Es necesario registrar la edad"
                                        min={0} />
                                </SimpleItem>

                                <SimpleItem dataField={'telefono'} editorType="dxTextBox" >
                                    <RequiredRule message="Ingrese lel numero de telefono" />
                                    <NumericRule message="Ingrese solo números" />
                                </SimpleItem>
                            </GroupItem>
                            <SimpleItem dataField={'direccion'} editorType="dxTextBox">
                                <RequiredRule message="Ingrese su dirección" />
                            </SimpleItem>

                            <SimpleItem name="covid" dataField={'tiene_conrona_virus'} editorType="dxCheckBox" />
                        </GroupItem>

                        <GroupItem>
                            <ButtonItem horizontalAlignment={'center'} buttonOptions={buttonOption}
                                itemType={'button'} />
                        </GroupItem>
                    </Form>
                </form>
            </div>

            <div style={styles.map}>
                <Map
                    setMarker={setPosition}
                    marker={marker}
                />
            </div>
        </div>
    )
}

// Options of button register symptoms
const buttonOption = {
    text: 'Registrar sintomas',
    width: 200,
    useSubmitBehavior: true,
    elementAttr: { id: 'bt-register' },
};

const styles = {
    formContainer: {
        padding: 15
    },
    map: {
        height: '100%',
        width: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    }
};

export default (inject('CovidStore', 'SymptomsStore'))(observer(CovidSymptoms))