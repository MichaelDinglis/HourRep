import React,{useEffect, useState}from 'react'
import'./login.css'
import Axios from 'axios'
import { useHistory,withRouter } from "react-router-dom";
import {setUser,removeUser} from '../../redux/index.js'
import {useDispatch} from 'react-redux'
import logo from '../../logos/croppedTrans.png'


require('dotenv').config()

const Login =() => {

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const dispatch=useDispatch()
    const history=useHistory()

    useEffect(()=>{
        dispatch(removeUser())
    },[])

    const loginButton=()=>{
        Axios.post(process.env.REACT_APP_API+'login',{
            username:username,
            password:password
        }).then((Resp)=>{
            if(Resp.data.checkMessage){
                alert(Resp.data.checkMessage)
            }
            else{
                if(Resp.data[0]){
                    const user=Resp.data
                    dispatch(setUser(user))
                    const dashboardPath="/dashboard"
                    history.push(dashboardPath)
                }
                else{
                    alert("Whoops! Something went wrong. Please try again")
                }
            }
        }).catch((e)=>{
            console.log(e)
            alert(`Error! ${e.message}`)
        })
    }
    return (
        <div className="mainDiv">
            <div className="centerDiv"> 
                <div className="loginBox">
                <img src={logo} className='topLogo'></img><br/>
                <span className="loginText">Login </span> <br/>
                    <div className="inputs">
                        <span className="formText">Username   </span>
                        <input className="formBox" type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}}></input><br/>
                        <span className="formText">Password   </span>
                        <input className="formBox" type="password" name="Password" onChange={(e)=>{setPassword(e.target.value)}}></input>
                        <br/>
                        <button className="loginButton" onClick={loginButton}><span className="loginButtText">Login</span></button>
                    </div>
                    <p>© Michael Dinglis All right Reserved</p>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)