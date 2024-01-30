"use client";
import React, { useState, useEffect } from "react";
import Adminnavbar from '@/app/AdminNavbar';
interface UserData {
    id: string;
    email: string;
    mobile: string;
    password: string;
    companyCode: string;
}
const AdminDashboard = () => {
    const [data, setData] = useState<UserData[] | undefined>(undefined);
    const [authData, setAuthData] = useState<UserData[] | undefined>(undefined);
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
            } else {
                setData([{ "email": "none", "name": "hello" }, { "email": "none" }, { "email": "none" }]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const approve = (id: string) => async () => {
        const API_URL = `http://localhost:8000/api/notAuth/${id}`;
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
            const authResponse = response.json();
            setAuthData(authResponse)
            console.log(authResponse)   
            if (authData?.status === "success"){
                fetchData();
            }
        }catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
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
        <div>
            <Adminnavbar />
            <br></br>
            <table className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mobile
                        </th>
                        <th>

                        </th>

                    </tr>
                </thead>
                {

                    data?.map((item, index) => (
                        item?.isAuthorized === false ? <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.id}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.mobile}</td>
                            <td className="px-6 py-4" onClick={approve(item.id)}>Approve </td>
                        </tr> : ""
                    ))
                } </table>

            <table className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mobile
                        </th>

                    </tr>
                </thead>

                {
                    data?.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.id}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.mobile}</td>
                        </tr>
                    ))
                }
            </table>
        </div>
    );
}

export default AdminDashboard;