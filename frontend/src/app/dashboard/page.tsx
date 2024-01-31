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
                            <h1 className="text-2xl font-bold text-black">February's Attendance</h1>
                        </div>
                    </div>
                    <div className="cards flex items-center bg-[#eee] rounded-lg z-[-1000] mt-3 lg:mt-0 mx-12 p-4 lg:w-[25%] lg:ml-20">
                        <div style={style}>
                            <Progress.Circle percent={76} strokeColor="green" />
                        </div>
                        <div className="pl-4">
                            <h1 className="text-2xl font-bold text-black">January's Attendance</h1>
                        </div>
                    </div>
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