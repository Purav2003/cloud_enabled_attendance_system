"use client";
import React, { useState, useEffect } from "react";
import { IoMdRefresh } from "react-icons/io";
import Loading from "../../../loading"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {toast,Toaster} from "react-hot-toast";

interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
}
const AllUsers = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [loading,setLoading] = useState(false)
    const [authData, setAuthData] = useState()

    const fetchData = async () => {
        let companyCode = localStorage.getItem("companyCode");
        let idAsInt = parseInt(companyCode, 10);
        const API_URL = `http://localhost:8000/api/all/${idAsInt}`;
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


            if (Array.isArray(data_new) && data_new.length > 0) {
                setData(data_new);                
            } 
            setLoading(false)
        } catch (error) {            
            console.error(error);
        }
    };

    const deleteUser = (id: string) => async () => {
        const API_URL = `http://localhost:8000/api/del/${id}`;
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
            const authResponse = await response.json();
            setAuthData(authResponse)
            console.log(authResponse)
            if(authResponse?.status === "success"){
                toast.success("User Deleted Successfully")
            }
            else{
                toast.error("Error Deleting User")
            }
            fetchData();
            
        } catch (error) {
            console.error(error);
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
    }, [authData]);
    return (
        <div className="py-4 px-12">
            <Toaster />
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl pb-4">All Users</h1>
               <button onClick={fetchData} className="bg-gray-200 w-12 h-12 rounded-lg mb-2 flex justify-center items-center"><IoMdRefresh className="text-2xl" /></button>
            </div>
            { loading?<Loading />:
            <table className="table-striped w-full text-sm text-gray-500 text-white overflow-scroll">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 text-white">
                    <tr>
                        <th scope="col" className="text-center px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            Photo
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            Mobile
                        </th>
                        <th scope="col" className="text-center px-6 py-3">
                            Department
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="bg-[#eee]  overflow-scroll">
                    {data?.map((item: UserData) => (
                        item.isAuthorized === "AccessGranted"?<tr key={item.id} className="p-4  text-[#4a4a4a] items-center">

                            <td className="p-4 text-center">{item.id}</td>
                            <td className="text-center justify-center flex p-4"><img src={`http://localhost:8000${item.profilePhoto}`} className="w-12 h-12 rounded-full object-cover" /></td>
                            <td className="p-4 text-center">{item.name}</td>
                            <td className="p-4 text-center">{item.email}</td>
                            <td className="p-4 text-center">{item.mobile}</td>
                            <td className="p-4 text-center">{item.department}</td>
                            <td>
                                <button><FaRegEdit className="text-lg"/></button>
                                <button className="pl-4" onClick={deleteUser(item.id)}><RiDeleteBin6Line className="text-lg"/></button>
                            </td>
                        </tr>:""
                    ))}
                </tbody>
            </table>}
        </div>
    );
}

export default AllUsers;