import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateUser from '../screens/createUser';
import Dashboard from '../screens/dashboard';
import Login from '../screens/login';
import ProtectedRoute from './protectedRoute';
import {useSelector} from 'react-redux'
import ManageUsers from '../screens/manageUsers';
import Reports from '../screens/reports';
import Error404 from '../screens/err404';


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
                <Route path='*' component={Error404}/>
            </Switch>
        </Router>
)
}

export default Routes