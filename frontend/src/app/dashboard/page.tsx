"use client";
import React, { useState, useEffect, use } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import logo from "../../assets/images/login.jpg";
import { Calendar, Badge } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Progress } from "rsuite";

interface UserData {
  email: string;
  mobile: string;
  password: string;
  companyCode: string;
}

export default function Dashboard() {
  const [data, setData] = useState<UserData[] | undefined>(undefined);

  const style = {
    width: 120,
    display: "inline-block",
    marginRight: 10,
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const response = await fetch(`http://localhost:8000/api/attendance/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    setData(result);
    console.log(result);
  }


  const url_img = localStorage.getItem("IMG")


  useEffect(() => {
    const token = localStorage.getItem("token")
    const companyName = localStorage.getItem("companyName")
    const userData = localStorage.getItem("isAuthorized")
    // alert(data)
    // const isApproved = data?.isAuthorized
    if(userData === "sendRequest"){
        window.location.replace('/landing')
    }
    if(!token){
        window.location.replace('/login')
    }
    if(companyName){
        window.location.replace('/admin/dashboard')
    }
    fetchData();
    
  }, []);

  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar />
      <br></br>
{/* 
      {data?.map((datas) => {
        const { email } = datas;
        return <div key={email}>{email}</div>;
      })} */}
            <div><br></br><br></br>
                <div className="lg:flex">
                <table className="w-lg divide-y divide-gray-200">
  <thead>
    <tr>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        ID
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Day
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Date
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Time
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Attendance
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
  {data
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((datas, index) => {
      const date = new Date(datas.date);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

      return (
        <tr key={datas.id} className={datas.attendance ? "bg-green-50" : "bg-red-50"}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {index + 1}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {dayOfWeek}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {datas.date}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {datas.time?.split(".")[0]}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {datas.attendance ? "Present" : "Absent"}
          </td>
        </tr>
      );
    })}
</tbody>



</table>

                </div>
                <div>
                    {/* <img src={url_img?url_img:""} ></img> */}

                    <br></br>
                    <div className="lg:px-20 w-[100%] lg:flex">
                        <div className="w-full">                        
                        </div>

                    </div>

                </div>
            </div><br></br><br></br>
            <Footer />
        </div>

    )
}