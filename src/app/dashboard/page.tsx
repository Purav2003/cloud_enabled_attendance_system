"use client";
import React, { useState, useEffect } from "react";
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
    const API_URL = `http://localhost:8000/api/all/`;
    const token = localStorage.getItem("token")
    // alert(token)
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
      });
      const data_new: UserData[] = await response.json();
      console.log("hello", data_new);
      if (Array.isArray(data_new) && data_new.length > 0) {
        setData(data_new);
      } else {
        setData([{"email": "none", "name": "hello"}, {"email": "none"}, {"email": "none"}]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const url_img = localStorage.getItem("IMG")


  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token){
        window.location.replace('/login')
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
            <div>
                <div className="lg:flex">
                    <div className="cards flex items-center bg-[#eee] rounded-lg mx-12 p-4 lg:w-[25%] lg:ml-20">
                        <div>
                            <img src={logo.src} className="w-24 rounded-lg" />
                        </div>
                        <div className="pl-8 ">
                            <h1 className="text-2xl font-bold text-black">Jhon Doe</h1>
                            <h2 className="text-sm ">Web Developer</h2>
                        </div>

                    </div>

                    <div className="cards flex items-center bg-[#eee] rounded-lg z-[-1000] mx-12 p-4 lg:w-[25%] mt-3 lg:mt-0 lg:ml-20">
                        <div style={style} >
                            <Progress.Circle percent={10} strokeColor="green" />
                        </div>
                        <div className="pl-4">
                            <h1 className="text-2xl font-bold text-black">January's Attendance</h1>
                        </div>
                    </div>
                    <div className="cards flex items-center bg-[#eee] rounded-lg z-[-1000] mt-3 lg:mt-0 mx-12 p-4 lg:w-[25%] lg:ml-20">
                        <div style={style}>
                            <Progress.Circle percent={76} strokeColor="green" />
                        </div>
                        <div className="pl-4">
                            <h1 className="text-2xl font-bold text-black">December's Attendance</h1>
                        </div>
                    </div>
                </div>
                <div>
                    {/* <img src={url_img?url_img:""} ></img> */}

                    <br></br>
                    <div className="lg:px-20 w-[100%] lg:flex">
                        <div className="w-full">
                            <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Sr. Number
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Time
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Attendance
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">
                                            1
                                        </td>
                                        <td className="px-6 py-4">
                                            09-01-2024
                                        </td>
                                        <td className="px-6 py-4">
                                            10:14:04
                                        </td>
                                        <td className="px-6 py-4">
                                            Present
                                        </td>

                                    </tr>
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">
                                            2
                                        </td>
                                        <td className="px-6 py-4">
                                            08-01-2024                </td>
                                        <td className="px-6 py-4">
                                            10:10:43
                                        </td>
                                        <td className="px-6 py-4">
                                            Present
                                        </td>

                                    </tr>
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">
                                            3
                                        </td>
                                        <td className="px-6 py-4">
                                            07-01-2024                </td>
                                        <td className="px-6 py-4">
                                            -------
                                        </td>
                                        <td className="px-6 py-4">
                                            Absent
                                        </td>

                                    </tr>
                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">
                                            4
                                        </td>
                                        <td className="px-6 py-4">
                                            06-01-2024                </td>
                                        <td className="px-6 py-4">
                                            10:24:32
                                        </td>
                                        <td className="px-6 py-4">
                                            Present
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div><br></br><br></br>
            <Footer />
        </div>

    )
}