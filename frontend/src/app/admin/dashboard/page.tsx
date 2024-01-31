"use client";
import React, { useState, useEffect } from "react";
import ApproveData from './ApproveDatas'
import Adminnavbar from '@/app/AdminNavbar';
import AllUsers from './AllUsers';
const AdminDashboard = () => {


    useEffect(() => {
        const token = localStorage.getItem("token")
        const companyName = localStorage.getItem("companyName")
        if (!token) {
            window.location.replace('/login')
        }
        if (!companyName) {
            window.location.replace('/dashboard')

        }
    });
    return (
        <div>
            <Adminnavbar />
            <br></br>
            <ApproveData />
            <br></br><br></br>
            <AllUsers />
        </div>
    );
}

export default AdminDashboard;