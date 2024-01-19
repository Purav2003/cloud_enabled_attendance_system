// import Navbar from "../navbar";
"use client";
import Navbar from "../navbar"
import Footer from '../footer'
import { useState, useEffect } from "react";
interface UserData {
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
}


export default function Profile() {
    const [data, setData] = useState({});

    const fetchData = async () => {
        let id = localStorage.getItem("id");
        let idAsInt = parseInt(id, 10)
        const API_URL = `http://localhost:8000/api/user/${idAsInt}`;
        console.log(API_URL);
        
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
            setData(data_new)
           
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData()
    },[])
    return (


        <div className="flex flex-col h-screen justify-between">
            <Navbar />
            <div><h1 className="text-center text-[40px] font-bold">Profile</h1>
                <div>
                    Mobile: {data?.mobile}<br></br>
                    Email: {data?.email}<br></br>
                    Company Code: {data?.companyCode}
                    </div>
            </div>
            <Footer />
        </div>

    )
}