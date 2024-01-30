// import Navbar from "../navbar";
"use client";
import Navbar from "../navbar";
import Footer from '../footer';
import { useState, useEffect } from "react";
interface UserData {
    name: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
}

export default function Profile() {
    const [data, setData] = useState<UserData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const fetchData = async () => {
        let id = localStorage.getItem("id");
        let idAsInt = parseInt(id, 10);
        const API_URL = `http://localhost:8000/api/user/${idAsInt}`;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data_new: UserData = await response.json();
            setData(data_new);
            console.log(data_new)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        const data = localStorage.getItem("userData")
        const isApproved = data?.isAuthorized
        if(!token || isApproved === false){
            window.location.replace('/login')
        }
        if(companyName){
            window.location.replace('/admin/dashboard')
        }
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        const isAuthorized = localStorage.getItem("isAuthorized")
        if(isAuthorized === "false"){
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

    useEffect(() => {
        if (showModal) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
        }
    
        return () => {
          document.body.classList.remove('overflow-hidden');
        };
      }, [showModal]);

    return (
        <div className="min-h-screen items-center justify-center bg-[#eee]">
          
            <Navbar />

            <div className="bg-gray-200 my-12 p-8 rounded-lg  shadow-lg w-full md:w-1/2 lg:w-1/3 mx-auto ">
                <h1 className="text-4xl pl-8 font-bold text-black mb-4">Profile</h1>

                <div className="flex-1 items-center space-x-8">
                    {/* Left Side - User Photo */}
                    <div className="flex items-center justify-center"
                        onClick={()=>setShowModal(true)}
                    >
                        <img
                            src={`http://localhost:8000${data?.profilePhoto}`}
                            className="border border-[#4a4a4a] rounded-full w-32 h-32 object-cover"
                            alt="User Profile"
                        />
                    </div>


                    {/* Right Side - User Details */}
                    <div>
                        <div className="text-lg text-black">
                            <div className="flex mt-4"><p className="font-bold pr-2">Name:</p> {data?.name}</div><br />
                            <div className="flex"><p className="font-bold pr-2">Mobile:</p> {data?.mobile}</div><br />
                            <div className="flex"><p className="font-bold pr-2">Email: </p>{data?.email}</div><br />
                            <div className="flex"><p className="font-bold pr-2">Company Code: </p>{data?.companyCode}</div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={showModal ? "visible top-0 left-0 absolute w-full min-h-screen" : "hidden"}>
        <div className="bg-[rgba(0,0,0,0.5)] min-h-screen w-full flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white p-8 rounded-lg">
            <img
              src={`http://localhost:8000${data?.profilePhoto}`}
              className="border border-[#4a4a4a] rounded-full w-64 h-64 object-cover"
              alt="User Profile"
            />
            <button className="mt-4 p-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>
              Go Back
            </button>
          </div>
        </div>
      </div>

            <Footer />
        </div>
    );
}