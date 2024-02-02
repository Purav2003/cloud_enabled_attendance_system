"use client";
import Adminnavbar from "@/app/AdminNavbar";
import React, { useState, useEffect } from "react";

interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
}

const Users = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [searchData, setSearchData] = useState<UserData[] | undefined>(undefined);

    const [loading, setLoading] = useState(false)

    const fetchData = async () => {

        let companyCode = localStorage.getItem("companyCode");
        let idAsInt = parseInt(companyCode, 10);
        const API_URL = `http://localhost:8000/api/approved/${idAsInt}`;
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
            console.log(data_new)

            if (Array.isArray(data_new) && data_new.length > 0) {
                setData(data_new);
                console.log(data)
            }
            else {
                setData([])
            }
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        console.log(search)
        if (search === "") {
            fetchData();
        }
        else {
            let filteredData = data?.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase()) || 
                item.email.toLowerCase().includes(search.toLowerCase()) || 
                item.mobile.includes(search.toLowerCase()) || 
                item.department.toLowerCase().includes(search.toLowerCase())
            });
            setData(filteredData);
            if(filteredData?.length===0){
                setSearchData([])
            }
            
        }
    }

    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (!companyName) {
            window.location.replace('/dashboard')

        }
        fetchData();
    }, []);
    return (
        <>
            <Adminnavbar />
            <br />
            <div className="w-full items-center justify-center flex">
            <input
                            type="text"
                            id="search"
                            className="w-[40%] flex px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Search"
                            onChange={handleSearchChange}
                            required
                        />
            </div><br></br><br></br>
           <div className="grid grid-cols-4">

                {
                data?.map((item) => {
                        return (
                            <div className="ml-12 pt-4 w-64 mb-4 border border-gray-200 rounded-lg shadow bg-gray-300">
                                <div className="flex flex-col items-center pb-10">
                                    <img className="w-[130px] h-[130px] mb-3 object-cover rounded-full shadow-lg" src={`http://localhost:8000${item.profilePhoto}`} alt="User image" />
                                    <h5 className="mb-1 text-xl font-medium text-gray-900">{item.name}</h5>
                                    <span className="text-sm text-gray-700 ">{item.department}</span>
                                    <div className="mt-4">
                                        <a href="#" className="items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View Full Profile</a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default Users;
