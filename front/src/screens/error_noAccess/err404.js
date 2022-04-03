import React from 'react'
import {MdOutlineSentimentVeryDissatisfied} from 'react-icons/md'
import { useHistory } from "react-router-dom";
import logo from '../../logos/croppedTrans.png';



export default function Error404() {
    const history=useHistory()

    const backToHome=()=>{
        history.push("/")
    }
    return (
        <div>
            <br/>
            <img src={logo} className='topLogoError'></img><br/>
            <MdOutlineSentimentVeryDissatisfied style={{width:'200px', height:'100px'}}></MdOutlineSentimentVeryDissatisfied><br></br>
            <p style={{fontSize:'30px'}}>Error 404! Wrong Route!</p>
            <button onClick={backToHome} className='backToHomeErrorPage'>Back to home</button>
        </div>
    )
}
