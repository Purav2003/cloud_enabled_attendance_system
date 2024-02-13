"use client";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { AiOutlineBarChart } from "react-icons/ai";
import { useState,useEffect } from "react";
const Sidebar = () => {
    const [route,setRoute] = useState('dashboard');
    useEffect(()=>{
        const nav= window.location.href
        console.log(nav)
        if(nav.includes('reports')){
          setRoute('reports')
        }else if(nav.includes('profile')){
            setRoute('profile')
        }else if(nav.includes('dashboard')){
            setRoute('dashboard')
        }

    },[])
      return(
        <div className="sidebar bg-gray-100">
          <div className="sidebar-header items-center fixed min-h-screen bg-gray-100 grid justify-center">
           <div className="px-2"> 
            <a href="/dashboard"><h3 className={`text-lg p-4 ${route === 'dashboard'? "bg-blue-500 font-bold text-[#fff] items-center rounded-md":"text-[#4a4a4a]"}`}><GoHome /></h3></a>
            <a href="/reports"><h3 className={`text-lg p-4 ${route === 'reports'? "bg-blue-500 font-bold text-[#fff] items-center p-2 rounded-md":"text-[#4a4a4a]"}`}><AiOutlineBarChart /></h3></a>
            <a href="/profile"><h3 className={`text-lg p-4 text-sm ${route === 'profile'? "bg-blue-500 font-bold items-center justify-center text-[#fff] p-2 rounded-md":"text-[#4a4a4a]"}`}><FaRegUser /></h3></a>
            <a href="/logout"><h3 className={`text-lg p-4 text-sm`}><LuLogOut /></h3></a>
            </div>
          </div>          
        </div>

      )
}

export default Sidebar;