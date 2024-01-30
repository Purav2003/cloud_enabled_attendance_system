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
    <div>
      <input
        placeholder='Enter OTP'
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerification}>Submit</button>
    </div>
  );
}

export default Verification;
