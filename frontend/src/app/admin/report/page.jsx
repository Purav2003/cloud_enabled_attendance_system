"use client";
import React from 'react';
import Adminnavbar from '@/app/AdminNavbar';
import {useState, useEffect} from 'react';
import PresentDayWisePie from './PresentDayWisePie';
import LeaveCountBarChart from './LeaveCountBarChart';
import InTimeOutTime from './InTime';
import axios from "axios"
const CompanyReport = () => {
    const [data,setData] = useState()
    const [leaveData,setLeaveData] = useState()
    const [presentDayWisePieMonth, setPresentDayWisePieMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const [presentDayWisePieYear, setPresentDayWisePieYear] = useState(new Date().getFullYear().toString())
    const [leavePerYear, setLeavePerYear] = useState(new Date().getFullYear().toString())
    const [approvedUsers,setApprovedUsers] = useState()
    const [leaveUserId,setLeaveUserId] = useState(0)
    const [workingHoursData,setWorkingHoursData] = useState()
    const [workingHoursUserId,setWorkingHoursUserId] = useState(0)
    const [workingHoursYear,setWorkingHoursYear] = useState(new Date().getFullYear().toString())
    const [workingHoursMonth,setWorkingHoursMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const fetchDataPie = async () => {
        try{
            const companyCode = localStorage.getItem('companyCode')
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/report/month/${companyCode}`,
            {month: presentDayWisePieMonth, year: presentDayWisePieYear},
            )
            const data = await response
            setData(data.data)
            console.log(data)
        }
        catch(err){
            console.log(err)
        }
    }
    const fetchDataYear = async () => {
        try{
            const companyCode = localStorage.getItem('companyCode')
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/report/year/leave/${companyCode}`,{
                year: leavePerYear,
                userId: leaveUserId
            })            
            const data = await response

            setLeaveData(data.data)
            console.log(data)
        }
        catch(err){
            console.log(err)
        }
    }

    const fetchAllUsers = async () => {
        try{
                const companyCode = localStorage.getItem('companyCode')
                const apiUrlData = "approved"
                const idAsInt = parseInt(companyCode,10)
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/${apiUrlData}/${idAsInt}`,{
                     headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
                })
                if(response.data){
                    setApprovedUsers(response.data)
                }

        }
        catch(err){
            console.log(err)
        }
    }

    const fetchDataWorkingHours = async () => {
        try{
            const companyCode = localStorage.getItem('companyCode')
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/admin/report/year/workingHours/${companyCode}`,
            {month:workingHoursMonth , year: workingHoursYear,userId:workingHoursUserId},
            )
            const data = await response
            setWorkingHoursData(data.data)
            console.log(data)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchDataPie()    
    }, [presentDayWisePieMonth,presentDayWisePieYear])
    useEffect(()=>{
        fetchDataYear()
        fetchAllUsers()
    },[leavePerYear,leaveUserId])
    
    useEffect(() => {
        fetchAllUsers()
        fetchDataWorkingHours()    
    }, [workingHoursMonth,workingHoursYear,workingHoursUserId])
  return (
    <div>
        <Adminnavbar />        <br></br><br></br><br></br><br></br>
      <h1 className='px-12 text-2xl font-bold'>Report</h1>
      <div className="grid grid-cols-2 max-h-[500px] gap-0 mt-12">
        <div className="px-12">
        <h1 className='pb-4 font-bold'>Count of Attendance By Date</h1>

        <PresentDayWisePie data={data}
        setSelectedMonth={setPresentDayWisePieMonth}
        setSelectedYear={setPresentDayWisePieYear}
        selectedMonth={presentDayWisePieMonth}
        selectedYear={presentDayWisePieYear}        
        />
        </div>
        <div>
        <h1 className='pb-4 font-bold'>Count of Leaves By Employee</h1>

        <LeaveCountBarChart data={leaveData}
        setSelectedYear={setLeavePerYear}
        selectedYear={leavePerYear}
        users={approvedUsers}
        setLeaveUserId={setLeaveUserId}
        leaveUserId={leaveUserId}
        />
        </div>
        <div>
            <InTimeOutTime data={workingHoursData}/>
        </div>
</div>
    </div>
  );
}

export default CompanyReport;