"use client";
import React, { useState,useEffect } from 'react';

const Verification = () => {
  const [otp, setOtp] = useState('');

  const handleVerification = async () => {
    try {
      
    const email = localStorage.getItem("userEmail")
    console.log(email);
      const apiUrl = `http://localhost:8000/api/checkOtp/${email}`;

      // Make the API request to verify the OTP
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
        }),
      });

      
      // Parse the JSON response
      const data = await response.json();
      if(data.message === "User authenticated"){
        localStorage.setItem("otpVerified","true")
        window.location.replace('/login')
    }
      // Handle the response from the server
      console.log(data);
      // You can implement further logic based on the API response
    } catch (error) {
      console.error('Error sending OTP to API:', error);
    }
  };

  useEffect(()=>{
    const otpVerified = localStorage.getItem("otpVerified")
    if(otpVerified === "true"){
        window.location.replace('/login')
    }
  })
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500'>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
  
    <div className='grid items-center justify-center min-h-screen'>
      <div className='text-center text-white'>
        <h1 className="font-bold text-4xl mb-6">Welcome to Attendance System</h1>
        <p className="text-lg mb-4">We have sent you an OTP on your mail. Enter the OTP below to proceed.</p>
  
        <input
          placeholder='Enter OTP'
          value={otp}
          className='border-2 border-white-400 rounded-lg p-3 m-2 w-80 text-black'
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerification}
          className='bg-green-500 text-white px-6 py-3 m-4 rounded-lg hover:bg-green-600 transition-all duration-300'
        >Verify </button>
      </div>
    </div>
  </div>
  
  );
}

export default Verification;
