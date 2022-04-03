import React,{useState} from 'react'
import './dashboard.css'
import {useSelector} from 'react-redux'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import {removeUser} from '../../redux/index'
import { useHistory } from "react-router-dom";
import moment from 'moment'
import { withRouter } from "react-router-dom";
import logo from '../../logos/croppedTrans.png';
require('dotenv').config()


function Dashboard() {
    const USER=useSelector(state => state.user)
    const [user,setUser]=useState(USER[0])
    const [comments,setComments]=useState("")
    const [disableButtons,setDisablebuttons]=useState(false)

    var lastcheck
    if(USER[0].lastCheckIn!=null){
        lastcheck=USER[0].lastCheckIn.replace('Z', '').replace('T', ' ');
        }
    const [lastCheckIn,setLastCheckIn]=useState(lastcheck)
    const dispatch=useDispatch()
    const history=useHistory()

    const enableButtons=async()=>{
        setDisablebuttons(false)
    }

    const checkIn=()=>{
        setDisablebuttons(true)
        if(lastCheckIn!= null){
            alert("Please check out before checking in!")
            enableButtons()
        }
        else{
            const date=new Date().toISOString().slice(0, 10)
            const time=new Date().toLocaleTimeString('el-GR',{hour12:false})
            const datetime= `${date} ${time}`
            Axios.post(process.env.REACT_APP_API+"checkInPost",{
                username:USER[0].username,
                datetime:datetime
            }).then((res)=>{
                if(res.data.message==='Server error!'){
                    alert(res.data.checkMessage)
                    enableButtons()
                }
                else{
                    alert(res.data.checkMessage)
                    setComments("")
                    setLastCheckIn(res.data.lastCheckIn)
                    enableButtons()
                }

            }).catch((err)=>{
                console.log(err)
                alert(`Error! ${err}`)
                enableButtons()
            })
        }
    }

    const done=()=>{
        history.push("/")
        dispatch(removeUser())
    }

    const checkOut=()=>{
        setDisablebuttons(true)
        const date=new Date().toISOString().slice(0, 10)
        const time=new Date().toLocaleTimeString('el-GR',{hour12:false})
        const timestampNow= `${date} ${time}`
        Axios.get(`${process.env.REACT_APP_API}getCheckIn?username=${user.username}`).then((Resp)=>{
            const data=Resp.data[0]
            if(data.lastCheckIn===null){
                alert("Please check in before checking out!")
                enableButtons()
            }
            else{
                const checkIn=data.lastCheckIn.replace('Z', '').replace('T', ' ');
                const ms=moment(timestampNow,"YYYY/MM/DD HH:mm:ss").diff(moment(checkIn,"YYYY/MM/DD HH:mm:ss"))
                const d = moment.duration(ms);
                const totalHours=Math.floor(d.asHours()) + moment.utc(ms).format(".mm");                
                Axios.post(process.env.REACT_APP_API+'checkOut',{
                    username:user.username,
                    checkIn:checkIn,
                    checkOut:timestampNow,
                    totalHours:totalHours,
                    comments:comments
                    }).then((res)=>{
                        if(res.data.checkMessage==='Server Error!'){
                            alert(res.data.message)
                            enableButtons()
                        }
                        else{
                            alert(`${res.data.checkMessage}  Worktime: ${totalHours}`)
                            setLastCheckIn(null)
                            enableButtons()
                        }                        
                    }).catch((e)=>{
                        console.log(e)
                        alert(JSON.stringify(e.message))
                        enableButtons()
                })
            }
        }).catch((e)=>{
            alert(JSON.stringify(e.message))
            enableButtons()
            console.log(e)
        })
    }

    const handleComments=(e)=>{       
            setComments(e.target.value)
    }

    const toManageUser=()=>{
        history.push("/manageUsers")
    }

    const toReports=()=>{
        history.push("/reports")
    }

    const toCreateUser=()=>{
        history.push("/createUser")
    }

    const toCustomAdd=()=>{
        history.push("/customDate")
    }

    const toBackup=()=>{
        history.push("/backup")
    }
    return (
        <div className="mainDiv">
            <div>
                {user.role!=="employee" && (<div className="sidenav">
                    <div className="menuName">{user.role.toUpperCase()} MENU</div>
                    <a onClick={toCreateUser}>Create User</a>
                    <a onClick={toManageUser}>Manage Users</a>
                    <a onClick={toCustomAdd}>Custom Date</a>
                    <a onClick={toReports}>Reports</a>
                    <a onClick={toBackup}>Backup</a>
                </div>)}
                <div className={user.role!=="employee" ? 'notCenterMain':'centerMain'}>
                    <p className="welcomeTextDashboard">
                    <img src={logo} className='topLogoDash'></img><br/>
                        Welcome, {user.firstname}<br/><br/>
                        Last CheckIn: {lastCheckIn ? lastCheckIn : "NULL"}
                    </p>
                    <hr/>
                        <p className='currentStats'>
                            Current date: {new Date().toISOString().slice(0, 10)}<br/>
                            Current time: {new Date().toLocaleTimeString('el-GR',{hour12:false})}
                        </p>
                        <button disabled={disableButtons} onClick={()=>{checkIn()}}id="in" className="BUTTONS" >Check In</button>
                        <button disabled={disableButtons} onClick={()=>{checkOut()}}id="out" className="BUTTONS">Check Out</button>
                        <br/>
                        <input id="commentBox" type="text" name="comments" value={comments} onChange={(e)=>{handleComments(e)}} placeholder="Checkout Comments"/>
                        <br/>
                        <button onClick={()=>{done()}} id="dashboardDoneButton">Done!</button><br/><br/>
                        <p>© Michael Dinglis All right Reserved</p>
                    </div>
            </div>


            
        </div>
        
    )
}

export default withRouter(Dashboard)


{/* <div className='bottomStatDiv'>
Current date: {new Date().toISOString().slice(0, 10)}<br/>
Current time: {new Date().toLocaleTimeString('el-GR',{hour12:false})}
</div> */}