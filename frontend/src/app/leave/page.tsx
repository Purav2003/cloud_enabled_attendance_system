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
    
        if(userData === "sendRequest"){
          window.location.replace('/landing')
      }
    });

    return (
        <div>
            <Sidebar />
            <div className="ml-16">
                <div className="p-8">
                    <div className="flex w-full justify-between">
                        <h1 className="text-3xl font-bold pl-8 text-gray-800 mb-6 flex items-center"><GiMountains /> &nbsp;Leave Portal</h1>
                        <Link href="/leave/leave-application"><button className="mx-10 bg-red-400 text-white px-4 py-2 rounded-md">Apply For Leave</button></Link>
                    </div>
                    <div>
                        <LeaveRemaining />
                    </div>                   
                    <div>
                        <RecentLeave />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leave;