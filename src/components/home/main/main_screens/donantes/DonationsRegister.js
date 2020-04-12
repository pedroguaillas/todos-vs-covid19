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
import { medicines, supplies } from './requiered';

function DonationsRegister(props) {

    // Define states
    const [data, setData] = useState({});
    const [marker, setMarket] = useState({
        latitude: -2.15700,
        longitude: -79.71447
    });

    // Get CovidStore of Store
    const { CovidStore } = props;

    // Deserealize id user from CovidStore
    const { personal_data, id_user } = CovidStore;

    //Effect death with id_user
    useEffect(() => {
        setData({
            cedula: personal_data.cedula,
            nombres: personal_data.mombres,
            apellidos: personal_data.apellidos,
            telefono: '',
            direccion: ''
        });
    }, []);

    // Move market position
    const setPosition = (marker) => {
        setMarket(marker);
    }

    // Create coleccion
    const helps = db.collection('helps');

    // Guardar paciente
    const onSubmit = e => {
        e.preventDefault();

        const donations = [];
        const obj = Object.entries(data)
        obj.forEach(item => {
            const value = (item[1]);
            if ((typeof (value) === "boolean")) {
                donations.push(item[0])
                delete data[item[0]]
            }
        });

        helps.doc(data.cedula).set({ id_user, personal_data: data, donations, review: true, marker })
            .then(() => {
                notify({ message: "Se ha registrado persona donante", width: 300, }, "success", 1500);
            })
            .catch(error => console.log('error: ' + error.message))
    };

    return (
        <div className={'symptoms-container'}>
            <div style={styles.formContainer}>
                <form action="" onSubmit={onSubmit}>
                    <Form width={'100%'}
                        formData={data}
                        validationGroup="Register"
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                    >
                        <GroupItem caption={'Registrar donaciones'}>
                            <GroupItem>

                                <GroupItem caption={'Medicionas para donar'}>
                                    <GroupItem colCount={2}>
                                        {Object.keys(medicines).map(item => {
                                            return (
                                                <SimpleItem key={item[1]} dataField={item} editorType="dxCheckBox" />
                                            )
                                        })}
                                    </GroupItem>
                                </GroupItem>

                                <GroupItem caption={'Insumos para donar'}>
                                    <GroupItem colCount={2}>
                                        {Object.keys(supplies).map(item => {
                                            return (
                                                <SimpleItem key={item[1]} dataField={item} editorType="dxCheckBox" />
                                            )
                                        })}
                                    </GroupItem>
                                </GroupItem>

                                <GroupItem caption={'Datos personales del donante'}>

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

                                    <SimpleItem dataField={'telefono'} editorType="dxTextBox" >
                                        <RequiredRule message="Ingrese lel numero de telefono" />
                                        <NumericRule message="Ingrese solo números" />
                                    </SimpleItem>

                                    <SimpleItem dataField={'direccion'} editorType="dxTextBox">
                                        <RequiredRule message="Ingrese su dirección" />
                                    </SimpleItem>

                                </GroupItem>
                            </GroupItem>
                        </GroupItem>

                        <ButtonItem horizontalAlignment={'center'} buttonOptions={buttonOption}
                            itemType={'button'} />
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
    text: 'Registrar donación',
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

export default (inject('CovidStore', 'SymptomsStore'))(observer(DonationsRegister))