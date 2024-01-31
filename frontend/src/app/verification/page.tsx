"use client";
import React, { useState, useEffect, useRef } from 'react';
import {toast,Toaster} from 'react-hot-toast';
const Verification = () => {
  const [otp, setOtp] = useState({
    otp_1: '',
    otp_2: '',
    otp_3: '',
    otp_4: '',
  });

  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    setOtp((prevOtp) => {
      const newOtp = { ...prevOtp, [`otp_${index + 1}`]: value };

      if (value && index < inputRefs.length - 1) {
        // Move focus to the next input if a letter is typed
        inputRefs[index + 1].current?.focus();
      }

      return newOtp;
    });
  };

  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && !otp[`otp_${index + 1}`]) {
      // Move focus to the previous input on backspace if the current input is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerification = async () => {
    if(otp.otp_1 === '' || otp.otp_2 === '' || otp.otp_3 === '' || otp.otp_4 === ''){
      toast.error("All fields are required")
      return;
    }
    try {
      const otp_final = otp.otp_1 + otp.otp_2 + otp.otp_3 + otp.otp_4;
      otp_final.toString();
      const email = localStorage.getItem('userEmail');
      console.log(email);
      console.log(otp_final);
      
      const apiUrl = `http://localhost:8000/api/checkOtp/${email}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp_final,
        }),
      });

      // Parse the JSON response
      const data = await response.json();
      if (data.message === 'User authenticated') {
        localStorage.setItem('otpVerified', 'true');
        toast.success('OTP verified');
        setTimeout(() => {
        window.location.replace('/login');
        }, 2000);
      }
      else{
        toast.error('OTP incorrect');
      }

      // Handle the response from the server
      console.log(data);
      // You can implement further logic based on the API response
    } catch (error) {
      console.error('Error sending OTP to API:', error);
    }
  };

  useEffect(() => {
    const otpVerified = localStorage.getItem('otpVerified');
    if (otpVerified === 'true') {
      window.location.replace('/login');
    }
  }, []);
  return (
<div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500'>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
    <Toaster />
      <div className='grid items-center justify-center min-h-screen '>
        <div className='text-center text-white'>
          <h1 className="font-bold text-4xl mb-6">Welcome to Attendance System</h1>
          <p className="text-lg mb-4">We have sent you an OTP on your mail. Enter the OTP below to proceed.</p>
<div className='p-4 bg-[rgba(0,0,0,0.3)] rounded-xl'>
          <input
            id='otp_1'
            ref={inputRefs[0]}
            value={otp.otp_1}
            className='border-2 text-center border-white-400 rounded-lg p-3 m-2 text-black w-[40px] h-[40px]'
            onChange={(e) => handleInputChange(e, 0)}
            onKeyDown={(e) => handleBackspace(e, 0)}
          />
          <input
            id='otp_2'
            ref={inputRefs[1]}
            value={otp.otp_2}
            className='border-2 text-center border-white-400 rounded-lg p-3 m-2 text-black w-[40px] h-[40px]'
            onChange={(e) => handleInputChange(e, 1)}
            onKeyDown={(e) => handleBackspace(e, 1)}
          />
          <input
            id='otp_3'
            ref={inputRefs[2]}
            value={otp.otp_3}
            className='border-2 text-center border-white-400 rounded-lg p-3 m-2 text-black w-[40px] h-[40px]'
            onChange={(e) => handleInputChange(e, 2)}
            onKeyDown={(e) => handleBackspace(e, 2)}
          />
          <input
            id='otp_4'
            ref={inputRefs[3]}
            value={otp.otp_4}
            className='border-2 text-center border-white-400 rounded-lg p-3 m-2 text-black w-[40px] h-[40px]'
            onChange={(e) => handleInputChange(e, 3)}
            onKeyDown={(e) => handleBackspace(e, 3)}
          />
          
          <button
            onClick={handleVerification}
            className='bg-green-500 text-white px-6 py-3 m-4 rounded-lg hover:bg-green-600 transition-all duration-300'
          >
            Verify
          </button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Verification;
