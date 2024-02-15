"use client";
import Sidebar from "../Sidebar"
import Link from "next/link"
import LeaveRemaining from "./LeaveRemaining"
import RecentLeave from "./RecentLeave"
const Leave = () => {

    return (
        <div>
            <Sidebar />
            <div className="ml-16">
                <div className="p-8">
                    <div className="flex w-full justify-between">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6"> Leave Portal</h1>
                        <Link href="/leave/leave-application"><button className="mx-10 bg-red-400 text-white px-4 py-2 rounded-md">Apply For Leave</button></Link>
                    </div>
                    <div>
                        <LeaveRemaining />
                    </div>                   
                    <div className="pl-8">
                        <RecentLeave />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leave;