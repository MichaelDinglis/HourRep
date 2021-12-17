import React from 'react'
import {MdOutlineSentimentDissatisfied} from 'react-icons/md'
import { useHistory } from "react-router-dom";
import logo from '../logos/croppedTrans.png';


export default function NoAccess() {
    const history=useHistory()

    const backToHome=()=>{
        history.push("/")
    }
    return (
        <div style={{height:'100%'}}>
            <img src={logo} className='topLogoNoAccess'></img><br/>
            <MdOutlineSentimentDissatisfied style={{width:'100px',height:'150px'}}></MdOutlineSentimentDissatisfied>
            <p style={{fontSize:'22px'}}>You have no access to this page</p>
            <button onClick={backToHome} className='backToHomeErrorPage'>Back to home</button>
        </div>
    )
}
