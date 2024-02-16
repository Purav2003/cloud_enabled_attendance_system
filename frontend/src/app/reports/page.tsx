"use client"
import Footer from '../footer'
import Sidebar from "../Sidebar"
import { MdOutlineAreaChart } from "react-icons/md";


export default function Report() {
    return (
        <div className="flex w-full">
            <Sidebar />
            <div className='lg:ml-16 w-full'>
                <div className="mt-8 w-full">
                    <h1 className="text-3xl lg:ml-12 font-bold text-gray-800 flex items-center mb-6"><MdOutlineAreaChart />
&nbsp; Report</h1>
                </div>
                <Footer />
            </div>
        </div>


    )
}