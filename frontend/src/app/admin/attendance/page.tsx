"use client";
import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from '@/app/AdminNavbar';
import { PieChart } from '@mui/x-charts';
import { Card, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material'; // Material UI components
import { HiArrowDown } from "react-icons/hi2";
import { RiArrowLeftSLine,RiArrowRightSLine } from "react-icons/ri";
import Loading from "../../../loading"
const Attendance = () => {
    const [data, setData] = useState([]);
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [loading,setLoading] = useState(false);
    // Memoize fetchData function
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const companyCode = localStorage.getItem("companyCode");
        const response = await fetch(`http://localhost:8000/api/allAttendance/${companyCode}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        setData(result);
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true)
        fetchData();
    }, [presentCount]); // Call fetchData when it changes

    useEffect(() => {

        let presentCount = 0;
        let absentCount = 0;

        data?.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString()).forEach((datas) => {
            datas?.attendance ? presentCount++ : absentCount++;
        });

        setPresentCount(presentCount);
        setAbsentCount(absentCount);
    }, [data]);

    const pieChartData = [
        { label: 'Present', value: presentCount },
        { label: 'Absent', value: absentCount },
    ];

    // Function to generate CSV content
    const generateCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "ID,Name,Time,Attendance\n" +
            data.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString()).map((datas, index) =>
                `${index + 1},${datas.user},${datas.time?.split(".")[0]},${datas.attendance ? "Present" : "Absent"}`
            ).join("\n");
        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", `attendance_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

// Pagination Logic
const totalPages = Math.ceil(data.length / itemsPerPage);
const lastPage = currentPage === totalPages;

const next = () => {
    if (!lastPage) {
        setCurrentPage(currentPage + 1);
    }
};

const prev = () => {
    if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
    }
};

const renderItems = () => {
    const todayData = data.filter(datas => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString());
    const items = [];
    for (let i = 0; i < todayData.length; i++) {
        const datas = todayData[i];
        const date = new Date(datas.date);
        
        items.push(
            <TableRow key={datas.id} className={datas.attendance ? "bg-green-100" : "bg-red-100"}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{datas.user}</TableCell>
                <TableCell>{datas.date}</TableCell>
                <TableCell>{datas.time?.split(".")[0]}</TableCell>
                <TableCell>{datas.attendance ? "Present" : "Absent"}</TableCell>
            </TableRow>
        );
    }
    
    return items;
};


return (
    <>
        <AdminNavbar /><br /><br /><br />
       {loading?<Loading />:<div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className='w-[60%]'>
                    <h1 className='pb-4 font-semibold text-xl'>Today's Attendance</h1>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Attendance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderItems()}
                        </TableBody>
                    </Table>
<div className='w-full flex justify-between'><div></div>
                    {/* Pagination */}
                    <div className='items-center flex mt-4'>
                        Page No: {currentPage} | {totalPages}
                        <button onClick={prev} disabled={currentPage === 1} ><RiArrowLeftSLine className="text-2xl items-center" /></button>                
                        <button onClick={next} disabled={lastPage} ><RiArrowRightSLine className="text-2xl" /></button>
                    </div>
                    </div>
                    <button onClick={generateCSV} className='px-4 py-2 bg-blue-600 rounded-md flex items-center text-white'><HiArrowDown className="mr-2"/>Download CSV</button>
                </div>
                <div className='w-[40%] grid items-center justify-center'>
                    <div className="p-4">
                        <h1 className='pb-4 font-semibold text-xl'>Attendance Summary</h1>
                        {data && data.length > 0 ? (
                            <PieChart
                                series={[
                                    {
                                        arcLabel: (item) => `${(item.value * 100 / (presentCount + absentCount)).toFixed(2)}%`,
                                        data: pieChartData
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        ) : (
                            <Typography variant="body1">No data available</Typography>
                        )}
                    </div>
                </div>
            </div>
        </div>}
    </>
);

};

export default Attendance;
