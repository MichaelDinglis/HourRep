import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateUser from '../screens/createUser/createUser';
import Dashboard from '../screens/dashboard/dashboard';
import Login from '../screens/login/login';
import ProtectedRoute from './protectedRoute';
import {useSelector} from 'react-redux'
import ManageUsers from '../screens/manageUsers/manageUsers';
import Reports from '../screens/reports/reports';
import Error404 from '../screens/error_noAccess/err404';
import CustomDate from '../screens/customDate/customDate';
import Backup from '../screens/backup/backup';

function Routes(){
    const USER=useSelector(state => state.user)
    return(
        <Router>
            <Switch>
                <Route path="/" component={Login} exact/>        
                <ProtectedRoute path="/createUser" component={CreateUser} isLogged={USER} isRestricted={true} acceptedRoles={['manager','supervisor']}/>
                <ProtectedRoute path="/dashboard" component={Dashboard} isLogged={USER} isRestricted={false} acceptedRoles={['employee','manager','supervisor']}/>
                <ProtectedRoute path="/manageUsers" component={ManageUsers} isLogged={USER} isRestricted={true} acceptedRoles={['manager','supervisor']}/>
                <ProtectedRoute path="/reports" component={Reports} isLogged={USER} isRestricted={true} acceptedRoles={['manager','supervisor']}/>
                <ProtectedRoute path="/customDate" component={CustomDate} isLogged={USER} isRestricted={true} acceptedRoles={['manager','supervisor']}/>
                <ProtectedRoute path="/backup" component={Backup} isLogged={USER} isRestricted={true} acceptedRoles={['manager','supervisor']}/>
                <Route path='/*' component={Error404}/>
            </Switch>
        </Router>
)
}

export default Routes