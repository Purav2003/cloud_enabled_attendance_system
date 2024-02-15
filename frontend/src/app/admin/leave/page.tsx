"use client";
import React from 'react';
import Adminnavbar from '@/app/AdminNavbar';
import ApproveLeave from './ApproveLeave';
import ApprovedLeave from './ApprovedLeave';
const AdminLeave = () => {
  return (
    <div>
        <Adminnavbar /><br></br><br></br><br></br>
    <ApproveLeave />
    <ApprovedLeave />
    </div>
  );
}

export default AdminLeave;