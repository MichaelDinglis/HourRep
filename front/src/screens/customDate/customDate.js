import React,{useEffect, useState} from 'react'
import './customDate.css'
import DatePicker from 'react-datepicker';
import  Select  from "react-select";
import Axios from 'axios'
import logo from '../../logos/croppedTrans.png';


function CustomDate() {

  const [options,setOptions]=useState(null)
  const [userSelection,setUserSelection]=useState()

  const handleUserMenuChange=(e)=>{
    setUserSelection(e)
  }

  useEffect(() => {
    Axios.get (`${process.env.REACT_APP_API}getAllUsersForReports`)
    .then((res)=>{
      const data=res.data
      if(data){
        const theOptions=data.map((val)=>{
          return {value:val.username,label:val.firstname,role:val.role}
        })
        setOptions(theOptions)
        console.log(theOptions)
      }
      if(res.data.checkMessage){
        alert(res.data.checkMessage)
      }
    }).catch((e)=>{
      console.log(e)
      alert(JSON.stringify(e.message))
    })
  },[])

  return (
    <div className='mainDiv'>
      <div className='centerDiv'>
        <div className='customDateBox'>
          <span className='topLogoSurroundingSpan'>
                    <img className='topLogoBackup' src={logo}></img><br/>
                </span>
          <p>Custom date selection</p>
          <br/>
          <p>
            Feature In Development. Please hold up :)
          </p>
          <br/>
          <p>© Michael Dinglis All right Reserved</p>

        </div>
      </div>
    </div>
  )
}

export default CustomDate

// {
//   <div className='roleSelectionClass'>
//   <Select options={options} isMulti={false} onChange={(e)=>{console.log(e);handleUserMenuChange(e)}} isSearchable value={userSelection}/>
// </div>
// }