import React, { useState, useEffect } from "react";
import Form, {
    ButtonItem,
    GroupItem,
    NumericRule,
    RequiredRule,
    SimpleItem,
    StringLengthRule
} from "devextreme-react/form";
import { db } from '../../../../../firebase/Firebase';
import notify from "devextreme/ui/notify";
import { inject, observer } from "mobx-react";
import Map from '../sintomas/map/Map';

function DeathRegister(props) {

    // Define states
    const [death, setDeath] = useState({});
    const [marker, setMarket] = useState({
        latitude: -2.15700,
        longitude: -79.71447
    });

    // Get CovidStore of Store
    const { CovidStore } = props;

    // Deserealize id user from CovidStore
    const { id_user } = CovidStore;

    //Effect death with id_user
    useEffect(() => {
        setDeath({
            cedula: '',
            nombres: '',
            apellidos: '',
            edad: '',
            observacion: ''
        });
    }, []);

    // Move market position
    const setPosition = (marker) => {
        setMarket(marker);
    }

    // // Create coleccion
    // const deaths = db.collection('deaths');

    // // Guardar paciente
    // const onSubmit = e => {
    //     e.preventDefault();

    //     death.marker = marker;
    //     // Save death
    //     deaths.doc(death.cedula).get()
    //         .then((death) => {
    //             if (death.exists) {
    //                 notify({ message: "Ya se ha registrado esta persona como fallecida", width: 300, }, "error", 1000);
    //             } else {
    //                 deaths.doc(death.cedula).set(death)
    //                     .then(() => {
    //                         notify({ message: "Persona fallecida registrada", width: 300, }, "success", 1500);
    //                     })
    //             }
    //         })
    // };

    // Create coleccion
    const require_helps = db.collection('require_helps');

    // Guardar paciente
    const onSubmit = e => {
        e.preventDefault();

        death.date_create = (new Date()).toLocaleDateString();

        require_helps.doc(death.cedula).set({ id_user, personal_data: death, review: true, state: 4, marker })
            .then(() => {
                notify({ message: "Se ha registrado una persona fallecida", width: 300, }, "success", 1500);
            })
            .catch(error => console.log('error: ' + error.message))
    };

    return (
        <div className={'symptoms-container'}>
            <div style={styles.formContainer}>
                <form action="" onSubmit={onSubmit}>
                    <Form width={'100%'}
                        formData={death}
                        validationGroup="Register"
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                    >
                        <GroupItem caption={'Registrar persona fallecida'}>
                            <GroupItem>
                                <GroupItem caption={'Datos'}>
                                    <SimpleItem dataField={'cedula'} editorType="dxTextBox"
                                        label={{ text: 'Cédula/Pasaporte' }}>
                                        <RequiredRule message="Ingrese la cédula/pasaporte" />
                                        <NumericRule message="Ingrese solo número" />
                                        <StringLengthRule message="El número de cédula debe tener 10 dígitos"
                                            min={10} />
                                    </SimpleItem>

                                    <SimpleItem dataField={'nombres'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese los nombres" />
                                        <StringLengthRule message="El nombre debe tener mínimo tres letras"
                                            min={3} />
                                    </SimpleItem>

                                    <SimpleItem dataField={'apellidos'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese los apellidos" />
                                        <StringLengthRule message="El apellido debe tener mínimo tres letras"
                                            min={3} />
                                    </SimpleItem>

                                    <SimpleItem dataField={'edad'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese la edad" />
                                        <NumericRule message="Ingrese solo números" />
                                        <StringLengthRule message="Es necesario registrar la edad"
                                            min={0} />
                                    </SimpleItem>

                                    <SimpleItem dataField={'direccion'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese su dirección" />
                                    </SimpleItem>

                                    <SimpleItem dataField={'observacion'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese alguna observacion" />
                                    </SimpleItem>
                                </GroupItem>
                            </GroupItem>

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

export default (inject('CovidStore', 'SymptomsStore'))(observer(DeathRegister))