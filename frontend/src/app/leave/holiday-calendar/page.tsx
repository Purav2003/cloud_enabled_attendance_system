"use client";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import Footer from "../../footer";
import Sidebar from "../../Sidebar";
import Link from "next/link";

const HolidayCalendar = () => {
    const [date, setDate] = useState([]);
    const fetchData = async () => {
        const companyCode = localStorage.getItem('cc');
        try {
            const response = await fetch(`http://localhost:8000/api/getHolidays/${companyCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const res = await response.json();
            console.log(res[0].dates);
            res[0].dates.split(',').map((date) => {
                setDate(date);
            });
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        console.log(date)
        const token = localStorage.getItem("token");
        const companyName = localStorage.getItem("companyName");
        if (!token) {
            window.location.replace('/login');
        }
        if (companyName) {
            window.location.replace('/admin/dashboard');
        }
        const userData = localStorage.getItem("isAuthorized");

        if (userData === "sendRequest") {
            window.location.replace('/landing');
        }

        fetchData();
    }, []);

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    return (
        <div className="flex flex-col lg:flex-row w-full">
            <Sidebar />
            <div className="lg:ml-16 mt-8 w-full">
                <div className="justify-between flex">
                    <h1 className="lg:text-3xl lg:ml-12 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6">
                        <IoCalendarClearOutline />&nbsp; Holiday Calendar
                    </h1>
                </div>
                {date.length > 1 ? <div className="grid grid-cols-4 gap-4 px-12 mt-12">
                    {months.map((month, index) => (
                        <div key={month} className="bg-white p-4 rounded-md border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">{month}</h2>
                            <ul>
                                {date }
                            </ul>
                        </div>
                    ))}
                </div> : "Loading..."}
                <Footer />
            </div>
        </div>
    );
}

export default HolidayCalendar;
