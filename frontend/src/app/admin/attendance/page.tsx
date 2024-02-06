"use client";
import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbar from '@/app/AdminNavbar';
import { PieChart } from '@mui/x-charts';
import { Card, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'; // Material UI components

const Attendance = () => {
    const [data, setData] = useState([]);
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);

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
    }, []);

    useEffect(() => {
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

    return (
        <>
            <AdminNavbar /><br /><br /><br />
            <div style={{ padding: '24px' }}>
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
                                {data?.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString())
                                    .map((datas, index) => {
                                        const date = new Date(datas.date);

                                        return (
                                            <TableRow key={datas.id} className={datas.attendance ? "bg-green-100" : "bg-red-100"}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{datas.user}</TableCell>
                                                <TableCell>{datas.date}</TableCell>
                                                <TableCell>{datas.time?.split(".")[0]}</TableCell>
                                                <TableCell>{datas.attendance ? "Present" : "Absent"}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
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
            </div>
        </>
    );
};

export default Attendance;
