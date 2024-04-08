"use client";
import React,{useState} from 'react';
import { PieChart } from '@mui/x-charts';
import { Select, Button,Modal } from 'antd';

const PresentDayWisePie = ({ data,setSelectedMonth,setSelectedYear,selectedMonth,selectedYear }) => {   
    // Display the pie chart of how many were present on every day of the month from 
    // get values from data
    const dates = data?.length>0 && data?.map((item) => item.date)
    const today = new Date()
    const notGreaterThanToday = dates?.length>0 && dates?.filter((date) => new Date(date) <= today)
    const uniqueDates = notGreaterThanToday && [...new Set(notGreaterThanToday)]
    const presentDayWise = uniqueDates && uniqueDates?.map((date) => {
        const present = data.filter((item) => item.date === date && item.attendance)
        return { date, present: present.length }
    })

    const pieData = presentDayWise && presentDayWise?.map((item) => {
        return { label: item.date, value: item.present }
    })

    const handleYearChange = (value) => {
        setSelectedYear(value)
    }
    const handleMonthChange = (value) => {
        setSelectedMonth(value)
    }
    
    return (
        <div className='grid crid-cols-1'>
            <div>
               <Select placeholder="Select Year" className="z-0" value={selectedYear} onChange={handleYearChange} style={{ width: 120, marginRight: 10 }}>
                <Option value="2023">2023</Option>
                <Option value="2024">2024</Option>
                {/* Add more years as needed */}
              </Select>
              {/* Dropdown for Month */}
              <Select placeholder="Select Month" value={selectedMonth} onChange={handleMonthChange} style={{ width: 120 }}>
                <Option value="01">January</Option>
                <Option value="02">February</Option>
                <Option value="03">March</Option>
                <Option value="04">April</Option>
                <Option value="05">May</Option>
                <Option value="06">June</Option>
                <Option value="07">July</Option>
                <Option value="08">August</Option>
                <Option value="09">September</Option>
                <Option value="10">October</Option>
                <Option value="11">November</Option>
                <Option value="12">December</Option>
              </Select>
              </div>
           {data?.length>0? <PieChart
                series={[{
                    arcLabel: (item) => `${item.value}`,
                    data: pieData
                }]}              
                height={300}
                width={300}
                slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      padding: -5,
                      itemMarkWidth: 7,
                      itemMarkHeight: 7,
                      labelStyle: {
                        fontSize: 12,
                        fill: 'black',
                      },
                    },
                    
                  }}               
            />:<h1 className="my-4 bg-gray-200 w-64 h-64 flex items-center justify-center rounded-md">No Data</h1>}
        </div>
    );
}

export default PresentDayWisePie;
