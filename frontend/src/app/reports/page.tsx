"use client"
import Footer from '../footer'
import Sidebar from "../Sidebar"
export default function Report(){
    return(
<div className="flex"> 
        <Sidebar />
        <div className='w-full min-h-screen'>
            <div>
                <h1 className="flex justify-center items-center text-[40px] font-bold">📊 Report</h1>
            </div>
        <Footer />
        </div>
</div>

    )
}