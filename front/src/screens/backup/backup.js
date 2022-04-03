import React from 'react'
import './backup.css'
import logo from '../../logos/croppedTrans.png';
import Axios from 'axios'
import { AiFillCaretLeft } from "react-icons/ai";
import { useHistory } from 'react-router'
require('dotenv').config()

function Backup() {

    const history=useHistory()

    const getBackup=()=>{
        Axios.get(process.env.REACT_APP_API+"backup").then((res)=>{
            alert(res.data.checkMessage)
        }).catch((err)=>{
            console.log(err)
            alert(`Error! ${err}`)
        })
    }

    const backToDash=()=>{
        history.push('/dashboard')
    }
    

  return (
    <div className='mainDiv'>
        <div className='centerDiv'>
            <div className='customBackupBox'>
                <span>
                    <AiFillCaretLeft onClick={backToDash} className="backInManage"></AiFillCaretLeft>
                </span>   
                <span className='topLogoSurroundingSpan'>
                    <img className='topLogoBackup' src={logo}></img><br/>
                </span>
                <div>
                    <p className='backupText'>Backup</p>
                    <p className='backupParagraphText'>Please click the button bellow to create a database backup</p>
                    <button className='backupButton' onClick={getBackup}>
                        <span className='loginButtText'>Backup</span>
                    </button>
                </div>             
                <p>© Michael Dinglis All right Reserved</p>

            </div>
        </div>
    </div>
  )
}

export default Backup