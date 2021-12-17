import Axios from 'axios'
import React, {useState,useEffect} from 'react'
import './manageUsers.css'
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router'
import {useDispatch} from 'react-redux'
import {removeUser} from '../redux/index'
import  Select  from "react-select";
import { BsTrash } from "react-icons/bs";
import { AiFillCaretLeft } from "react-icons/ai";
import logo from '../logos/croppedTrans.png';

require('dotenv').config()

export default function ManageUsers() {
    const [allUsers,setAllUsers]=useState([])
    const [allSupervisors,setAllSupervisors]=useState()
    const [selectedUser,setSelectedUser]=useState()
    const [firstname,setFirstName]=useState("")
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [roles,setAllRoles]=useState()
    const [selectedRole,setSelectedRole]=useState("")
    const [rolePassword,setRolePassword]=useState()
    const [supervisorPass,setSupervisorPass]=useState("")
    const [dropdownIsLoading,setDropdownIsLoading]=useState(true)
    const USER=useSelector(state => state.user[0])

    const history=useHistory()
    const dispatch=useDispatch()


    useEffect(()=>{
        getSidenavUsers()
    },[])

    const getSidenavUsers=()=>{
        if(USER){
            Axios.get(process.env.REACT_APP_API+"getAllUsers").then((res)=>{
                if(res.data.checkMessage){
                    alert(res.data.checkMessage)
                }
                else{
                    setAllUsers(res.data[0])
                    const roleArray=res.data[1].map((role)=>{
                        return {value:role.role,label:role.role}
                    })
                    const passArray=res.data[1].map((role)=>{
                        return role.password
                    })
                    setAllRoles(roleArray)
                    setRolePassword(passArray)
                    setDropdownIsLoading(false)
                }
            }).catch((e)=>{
                alert(e.message)
            })
            Axios.post(process.env.REACT_APP_API+"getAllSupervisors",{
                username:USER.username
            }).then((res)=>{
                if(res.data.checkMessage){
                    alert(res.data.checkMessage)
                }
                else{
                    setAllSupervisors(res.data.result)}
            }).catch((err)=>{
                alert(JSON.stringify(err.message))
            })
        }
    }

    const showUser=(User)=>{
        setSelectedUser(User.username)
        setFirstName(User.firstname)
        setUsername(User.username)
        setPassword(User.password)
        setSelectedRole({value:User.role,label:User.role})
    }

    const handleChangeRole=(e)=>{
        setSelectedRole(e)
    }

    const doneButton=()=>{
        Axios.post(process.env.REACT_APP_API+"updateUser",{
            selectedUser:selectedUser,
            firstname:firstname,
            username:username,
            password:password,
            role:selectedRole.value,
            supervisorPass:supervisorPass,
        }).then((res)=>{
            alert(res.data.checkMessage)
            setFirstName("")
            setUsername("")
            setPassword("")
            setSelectedUser("")
            setSupervisorPass("")
            getSidenavUsers()
        }).catch((err)=>{
            alert(JSON.stringify(err.message))
        })
    }

    const backToDash=()=>{
        history.push('/dashboard')
    }

    return (
        <div className="manageUserPage">
            <div className="sidenavUsers">

                <p>USERS</p>
                {
                    allUsers&&
                    allUsers.map((user,index)=>(
                        <span onClick={()=>{showUser(user)}} key={index}>{user.firstname}</span>
                    ))
                }
                {USER.role==="supervisor" && <p>Supervisors</p>}
                
                {
                    allSupervisors &&
                        USER.role==="supervisor"&&
                            allSupervisors.map((user,index)=>(
                                <span onClick={()=>{showUser(user)}} key={index}>{user.firstname}</span>
                            ))
                }
            </div>

            <div className="beforeMain">
                <div className="main">
                <img src={logo} className='topLogoManage'></img><br/>

                    <p>Manage Users</p>

                    <form>
                        <span className="manageUserFormText">Firstname</span>
                        <input className="formBox"value={firstname} onChange={(e)=>{setFirstName(e.target.value)}}/><br/>
                        <span className="managesSerFormText">Username</span>
                        <input className="formBox"value={username} onChange={(e)=>{setUsername(e.target.value)}}/><br/>
                        <span className="manageUserFormText">Password</span>
                        <input className="formBox"value={password} onChange={(e)=>{setPassword(e.target.value)}}/><br/>
                    </form>
                    <span className="formTextManage">Role</span><br/>
                        <div className='roleSelectionPosition'>
                            <div className='roleSelectionClass'>
                                <Select options={roles} onChange={handleChangeRole} value={selectedRole} isLoading={dropdownIsLoading} placeholder="Select Role!"/>
                            </div>
                        </div>


                            
                            {selectedRole.value==="supervisor" && (
                                <input className="formBox" value={supervisorPass}type="text" placeholder="Supervisor Password:" onChange={(e)=>{setSupervisorPass(e.target.value)}}/>
                            )}
                    <br/>
                    <div className="manageUserDoneButton">
                    <button className='loginButton' onClick={()=>{doneButton()}}><span className='loginButtText'>SUBMIT</span></button><br/>
                    <span className='trashInnerDiv'>
                        <AiFillCaretLeft onClick={backToDash} className="backInManage"></AiFillCaretLeft>
                    </span>      
                    

                    </div>
                </div>
            </div>
        </div>
    )
}
