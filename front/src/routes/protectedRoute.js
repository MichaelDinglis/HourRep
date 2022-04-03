import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import NoAccess from '../screens/error_noAccess/noAccess';

export default function ProtectedRoute({isLogged:isLogged,component:Component,isRestricted:isRestricted,acceptedRoles:acceptedRoles, ...rest}) {
    const history=useHistory()
    let USER;
    if(isLogged){
        USER=isLogged[0]
    }

    return (
        <Route {...rest} render={(props)=>{
            if(isRestricted===false){
                if(isLogged){
                    return<Component/>
                }
                else{
                    return<NoAccess/>
                }}

            else if(isRestricted===true){
                if(isLogged){
                    if(acceptedRoles.includes(USER.role)){
                        return <Component/>
                    }
                    else{
                        return<NoAccess/>
                    }    
                }
                else{
                    return<NoAccess/>
                }
            }
        }}/>
    )
}
