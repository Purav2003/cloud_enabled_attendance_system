// import Sidebar from "../Sidebar"
"use client";
// import Sidebar from "../Sidebar"

// import Sidebar from "../Sidebar"
import { useState, useEffect } from "react";
import { IoHandLeftOutline } from "react-icons/io5";
import { ImTree } from "react-icons/im";
import { LiaUsersSolid } from "react-icons/lia";


const Cards = () => {
    const [data, setData] = useState(null);


    const id = localStorage.getItem("id");


    const fetchData = async () => {
        const id = localStorage.getItem("id")
        const API_URL = `http://localhost:8000/api/user/${id}`;
        console.log(API_URL);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data_new = await response.json();
            setData(data_new);


            console.log(data_new);
        } catch (error) {
            console.error(error);
        }
    };




    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.replace('/login');
        }
        const userData = localStorage.getItem("isAuthorized")

        if (userData === "sendRequest") {
            window.location.replace('/landing')
        }

        fetchData();
    }, []);



    return (
        <div>
            <div className="w-full justify-between lg:flex px-12">
                <div className="w-1/4 shadow shadow-lg rounded-lg flex p-4 bg-[#FEF4E4] items-center">
                    <div>
                        <img src={`http://localhost:8000${data?.profilePhoto}`} className="h-16 object-cover w-16 rounded-full" />
                    </div>
                    <div><h1 className="text-xl font-bold pl-4">{data?.name}</h1></div>
                </div>
               
                <div className="w-1/4 ml-2 shadow shadow-lg rounded-lg flex text-black bg-[rgba(0,125,0,0.3)] p-4 items-center">
                    <div className="p-4 bg-green-500 rounded-full">
                        <IoHandLeftOutline className="text-3xl text-white" />

                    </div>
                    <div><h1 className="text-xl font-bold pl-4">Employee ID<br></br><span className="text-sm font-thin">#{data?.id}</span></h1></div>
                </div>
                <div className="w-1/4 ml-2 shadow shadow-lg rounded-lg flex text-black bg-[rgba(63,122,244,0.3)] p-4 items-center">
                    <div className="p-4 bg-[rgb(63,122,244)] rounded-full">
                    <LiaUsersSolid className="text-3xl text-white " />
                    </div>
                    <div><h1 className="text-xl font-bold pl-4">Company Name<br></br><span className="text-sm font-thin">{data?.company}</span></h1></div>
                </div>
                <div className="w-1/4 shadow shadow-lg ml-2 rounded-lg flex text-black bg-[rgba(135,17,237,0.3)] p-4 items-center">
                    <div className="p-4 bg-[rgb(135,17,237)] rounded-full">
                    <ImTree className="text-3xl text-white" />

                    </div>
                    <div><h1 className="text-xl font-bold pl-4">Department<br></br><span className="text-sm font-thin">{data?.department}</span></h1></div>
                </div>
            </div>
        </div>
    );
}

export default Cards;