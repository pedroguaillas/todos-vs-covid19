import React from "react";
import { Switch, Route } from "react-router-dom";
import CovidSymptoms from "./main_screens/sintomas/CovidSymptoms";
import NewRegister from "./main_screens/new_register/NewRegister";
import DonationsRegister from "./main_screens/donantes/DonationsRegister";
import DeathRegister from "./main_screens/fallecidos/DeathRegister";
import Home from './main_screens/main/index';

function MainRoutes() {
    return (
        <Switch>
            <Route path={"/home/covid-sintomas"} component={CovidSymptoms} />
            <Route path={"/home/otros-pacientes"} component={NewRegister} />
            <Route path={"/home/donaciones"} component={DonationsRegister} />
            <Route path={"/home/registro-fallecidos"} component={DeathRegister} />
            <Route path={"/home"} component={Home} />
        </Switch>
    )
}

export default MainRoutes
