import React,{useState,useEffect}from 'react'
import'./createUser.css'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { AiFillCaretLeft } from "react-icons/ai";
import  Select  from "react-select";
import logo from '../../logos/croppedTrans.png';
require('dotenv').config()



const CreateUser =() => {
    const USER = useSelector(state=>state)
    const user=USER.user[0]
    const history=useHistory()

    const [firstname,setFirstName]=useState("")
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [roles,setRoles]=useState()
    const [selectedRole,setSelectedRole]=useState("")
    const [supervisorPass,setSupervisorPass]=useState("")
    const [createDisabled,setCreateDisabled]=useState(false)
    const [dropdownIsLoading,setDropdownIsLoading]=useState(true)


    useEffect(()=>{
        Axios.get(process.env.REACT_APP_API+"getroles").then((responce)=>{
            const data=responce.data.result
            if(data){
                const roleArray=data.map((role)=>{
                return {value:role.role,label:role.role}
                })
                setRoles(roleArray)
                setDropdownIsLoading(false)
            }
            if(data.checkMessage){
                alert(data.checkMessage)
            }
        }).catch((e)=>{
            console.log(e)
            alert(JSON.stringify(e.message))
            })
    },[])

    const handleChangeRole=(e)=>{
        setSelectedRole(e)
    }

    const createButton=()=>{
                setCreateDisabled(true)
                Axios.post(process.env.REACT_APP_API+'newUser',{
                    firstname:firstname,
                    username:username,
                    password:password,
                    role:selectedRole.value,
                    supervisorPass:supervisorPass
                }).then((res)=>{
                        if(res.data.checkMessage&& res.data.checkMessage!=="User added sucessfully"){
                            alert(res.data.checkMessage)   
                            setCreateDisabled(false)    
                        }
                        else if(res.data.checkMessage=="User added sucessfully"){
                            alert(res.data.checkMessage)       
                            setFirstName("")
                            setUsername("")
                            setPassword("")
                            setSelectedRole("")
                            setSupervisorPass("")
                            setCreateDisabled(false)   
                        }
                        else{
                            setFirstName("")
                            setUsername("")
                            setPassword("")
                            setSelectedRole("")
                            setSupervisorPass("")
                            setCreateDisabled(false)   
                        }
                    }).catch((e)=>{
                        console.log(e)
                        alert(JSON.stringify(e.message))
                        setCreateDisabled(false)
                    })
            }

    const backToDash=()=>{
        history.push('/dashboard')
    }
    return (
        <div className="mainDiv">
            <div className="centerDiv"> 
                <div className="createUserBox">
                <img src={logo} className='topLogoCreateUser'></img><br/>

                   <p className="loginText">Create User</p><br/>
                   
                    <span className="formText">Full Name</span>
                    
                    <input className="formBox"type="text" name="Firstname" onChange={(e)=>{setFirstName(e.target.value)}}value={firstname}></input>
                    <br/>
                    <span className="formText">Username</span>
                    <input className="formBox" type="text" name="username" onChange={(e)=>{setUsername(e.target.value)}} value={username}></input><br/>
                    <span className="formText">Password</span>
                    <input className="formBox" type="password" name="Password" onChange={(e)=>{setPassword(e.target.value)}} value={password}></input>
                    <br/>
                    <span className="formText">Role</span><br/>
                        <div className='roleSelectionPosition'>
                            <div className='roleSelectionClass'>
                                <Select options={roles} onChange={handleChangeRole} value={selectedRole} isLoading={dropdownIsLoading} placeholder="Select Role!"/>
                            </div>
                        </div>
                         {selectedRole.value==="supervisor" && (
                            <input className="formBox" type="password" placeholder="Supervisor Password:" onChange={(e)=>{setSupervisorPass(e.target.value)}}/>
                        )}
                        
                    <br/>
                    <button onClick={createButton} className="loginButton" disabled={createDisabled}><span className="loginButtText">CREATE</span></button>
                    <p>© Michael Dinglis All right Reserved</p>

                    <br/>
                    <AiFillCaretLeft onClick={backToDash} className="backButton"></AiFillCaretLeft>
                </div>
            </div>
        </div>
    )
}
export default CreateUser
