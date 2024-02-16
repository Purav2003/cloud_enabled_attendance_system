"use client"
import Footer from '../footer'
import Sidebar from "../Sidebar"
import { PiChartLineThin } from "react-icons/pi";


export default function Report() {
    return (
        <div className="flex w-full">
            <Sidebar />
            <div className='lg:ml-16 w-full'>
                <div className="mt-8 w-full">
                    <h1 className="text-3xl lg:ml-12 font-bold text-gray-800 flex items-center mb-6"><PiChartLineThin />&nbsp; Report</h1>
                </div>
                <Footer />
            </div>
        </div>


    )
}