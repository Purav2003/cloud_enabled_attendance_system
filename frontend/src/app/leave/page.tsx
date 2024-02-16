"use client";
import Sidebar from "../Sidebar"
import Link from "next/link"
import LeaveRemaining from "./LeaveRemaining"
import RecentLeave from "./RecentLeave"
import { useEffect } from "react";
import { GiMountains } from "react-icons/gi";

const Leave = () => {
    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (companyName) {
            window.location.replace('/admin/dashboard')
        }
        const userData = localStorage.getItem("isAuthorized")

        if (userData === "sendRequest") {
            window.location.replace('/landing')
        }
    });

    return (
        <div className="flex flex-col lg:flex-row w-full">
            <Sidebar />
            <div className="lg:ml-16 mt-8 w-full">
                <div className="justify-between flex">
                    <h1 className="text-3xl lg:ml-12 font-bold text-gray-800 flex items-center mb-6"><GiMountains /> &nbsp;     Leave Portal</h1>
                    <Link href="/leave/leave-application"><button className="mx-10 bg-red-400 text-white px-4 py-2 rounded-md">Apply For Leave</button></Link>
                </div>
                <div className="pl-4">
                    <LeaveRemaining />
                </div>
                <div className="pl-4">
                    <RecentLeave />
                </div>
            </div>
        </div>

    );
}

export default Leave;