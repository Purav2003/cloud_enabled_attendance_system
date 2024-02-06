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
            <div>
                <div className="lg:flex">
                    <table>
                        <tbody>
                    {
                        data?.map((datas) => {
                            return (
                                <tr>
                                    <td>{datas.id}</td>
                                    <td>{datas.date}</td>
                                    <td>{datas.attendance?"Present":""}</td>
                                </tr>
                            )
                        }
                        )
                    }
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