import React,{useEffect, useState} from 'react'
import './reports.css'
import Axios from 'axios'
import  Select  from "react-select";
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router'
import { AiFillCaretLeft } from "react-icons/ai";
import {saveAs} from 'file-saver'
import logo from '../../logos/croppedTrans.png';

export default function Reports() {

    const [startDate,setStartDate]=useState(null)
    const [endDate,setEndDate]=useState(null)
    const [options,setOptions]=useState()
    const [userSelection,setUserSelection]=useState()
    const [SelectionOptionsLoading,setSelectionOptionsLoading]=useState(true)
    const [reportOptions,setReportOptions]=useState()
    const [reportSelection,setReportSelection]=useState()
    const [buttonsDisabled,setButtonsDisabled]=useState(false)
    const history=useHistory()

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_API}getAllUsersForReports`).then((res)=>{
            const data=res.data
            if(data){
                const theOptions=data.map((val)=>{
                    return {value:val.username,label:val.firstname,role:val.role}
                })
                setOptions(theOptions)}
            if(res.data.checkMessage){
                alert(res.data.checkMessage)
            }
            }).catch((e)=>{
                console.log(e)
                alert(JSON.stringify(e.message))
        })
        setReportOptions([
            {value:"Detailed",label:"Detailed"},
            {value:"Summary",label:"Summary"}
        ])
    }, [])

    useEffect(() => {
        if(options){
            setSelectionOptionsLoading(false)
        }
        else{
            setSelectionOptionsLoading(true)
        }
    }, [options])

    const getReport= ()=>{
        setButtonsDisabled(true)
        let selectedUsers
        if(userSelection){
            selectedUsers=userSelection.map((val)=>{
            return val.value
            })
        }
        if(startDate===null||endDate===null){
            alert("Please Select Dates!")
            setButtonsDisabled(false)
        }
        else{
            setButtonsDisabled(false)
            const formattedStart=startDate.toISOString().slice(0, 10)
            const formattedEnd=endDate.toISOString().slice(0, 10)
            Axios.post(`${process.env.REACT_APP_API}giveReportParams`,{
                reportType:reportSelection,
                selectedUsers:selectedUsers,
                startDate:formattedStart,
                endDate:formattedEnd,
            },
            {
                headers: {"Access-Control-Allow-Origin": "*"} 
            }
            ).then((res)=>{
                if(res.data.checkMessage==="OK!"){
                    alert("Pdf Created!!")}
                else if(res.data.checkMessage){
                    alert(res.data.checkMessage)}
                    
                        // Axios.get(`${process.env.REACT_APP_API}pdf`,{
                        //     responseType:'blob'
                        // }).then((response)=>{
                        //     const pdfBlob=new Blob([response.data],{type:'application/pdf;charset=utf-8'})
                        //     saveAs(pdfBlob,`${reportSelection.value}Report_StartDate:${formattedStart}.pdf`)
                        //     setButtonsDisabled(false)
                        // }).catch((e)=>{
                        //     alert(JSON.stringify("Error: "+e.message))
                        //     console.log(e)
                        //     setButtonsDisabled(false)
                        // })
            }).catch((e)=>{
                console.log(e)
                alert(JSON.stringify(e.message))
                setButtonsDisabled(false)
        })}

    }

    const handleUserMenuChange=(e)=>{
        setUserSelection(e)
    }

    const selectAllButton=()=>{
        setUserSelection(options)
    }

    const selectAllEmployees=()=>{
        let employees=[];
        if(options){
            options.map((val)=>{
                if(val.role==="employee"){
                    employees.push({value:val.value,label:val.label,role:val.role})
                }
            })
            setUserSelection(employees)
        }
    }   

    const handleReportSelectionChange=(e)=>{
        setReportSelection(e)
    }

    const backToDash=()=>{
        history.push('/dashboard')
    }

    return (
        <div className='mainDiv'>
            <div className='centerDiv'>
                <div className='reportBox'>
                    <div className='regulationForReport'>
                    <img src={logo} className='topLogoRep'></img><br/>
                        <div className='loginText'>
                            REPORTS
                        </div>
                        <div>

                        <div className='roleSelectionPosition'>
                                <div className='roleSelectionClass'>
                                    <Select options={options} onChange={handleUserMenuChange} isMulti isSearchable isLoading={SelectionOptionsLoading} value={userSelection} formatGroupLabel="Users"/>
                                </div>
                            </div>
                                <span style={{    display: "inline-block",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap"}}>
                                    <button type="button" onClick={selectAllButton} className='selectButoons'>Select All</button>
                                    <button type="button" onClick={selectAllEmployees} className='selectButoons'>Select All Employees</button>
                                </span><br/>
                                
                        <span className="formText">Start Date</span>
                            <DatePicker 
                                popperPlacement="auto"
                                selected={startDate}
                                onChange={date=>{setStartDate(date)}} 
                                dateFormat='yyyy/MM/dd'
                                maxDate={new Date()}
                                showYearDropdown
                                scrollableYearMonthDropdown
                                className='formBox'
                                />
                            <br/>
                            <span className="formText">End Date</span>
                            <DatePicker 
                                popperPlacement="auto"
                                selected={endDate}
                                onChange={date=>{setEndDate(date)}} 
                                dateFormat='yyyy/MM/dd'
                                maxDate={new Date()}
                                showYearDropdown
                                scrollableYearMonthDropdown
                                className='formBox'
                                />


                            <div className='roleSelectionPosition'>
                                <div className='roleSelectionClass'>
                                    <Select onChange={handleReportSelectionChange} isSearchable value={reportSelection} options={reportOptions}/>
                                </div>
                            </div>
                            <button disabled={buttonsDisabled} onClick={()=>{getReport()}} className="loginButton"><span className="loginButtText">Get Report!</span></button>
                            <p>© Michael Dinglis All right Reserved</p>

                        </div>
                    </div>
                    <AiFillCaretLeft onClick={backToDash} className="backButton"></AiFillCaretLeft>
                </div>
            </div>
        </div>
    )
}