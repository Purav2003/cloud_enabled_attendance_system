"use client";
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import helloImage from '../../assets/images/login.jpg';
import logo from '../../assets/images/logo.png';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSignIn = async () => {
        const result = await signIn('google'); // Redirect after sign-in
        if (result?.error) {
          console.error('Sign-in error:', result.error);
        } else {
          // Extract and store user information
          const { email } = result?.user || {};
          localStorage.setItem("name",  email);
        }
      };
    // If user is authenticated, display their email
   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLoginClick = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            toast.error("All fields are required");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);
            localStorage.removeItem("token");
            if (data.status === 'success') {
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("id", data.id);
                localStorage.setItem("isAuthorized", data.isAuthorized);
                localStorage.setItem("cc",data.companyCode)
                console.log('Successfully logged in');
                if (data.isAuthorized === "sendRequest") {
                    window.location.replace('/landing');
                } else {
                    window.location.replace('/dashboard');
                }

            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const companyName = localStorage.getItem("companyName");
        const isAuthorized = localStorage.getItem("isAuthorized");
        const otpVerified = localStorage.getItem("otpVerified");
        if (otpVerified === "false") {
            window.location.replace('/verification');
        }
        if (token && isAuthorized === "AccessGranted") {
            window.location.replace('/dashboard');
        }
        if (token && isAuthorized === "sendRequest") {
            window.location.replace('/landing');
        }
        if (companyName) {
            window.location.replace('/admin/dashboard');
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />

            {/* <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${helloImage.src})` }}></div> */}
<div className='w-full min-h-screen items-center flex justify-center'>
            <div className="lg:w-1/2 p-12 items-center p-16 mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-gray-800">Login</h1>
                <form className="mt-8">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={handleLoginClick}
                        className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Login
                    </button>

                    {/* OR Divider */}
                    {/* <div className='flex items-center mt-4'>
                        <hr className='flex-1 h-px bg-gray-300' />
                        <span className='mx-4 text-sm font-medium text-gray-600'>OR</span>
                        <hr className='flex-1 h-px bg-gray-300' />
                    </div> */}

                    {/* Google Login (commented out for now) */}
                    {/* <div className='flex items-center mt-4'>
                        <FcGoogle className="text-2xl" />
                        <span className='ml-2 font-medium'>Login with Google</span>
                    </div> */}
            <button onClick={handleSignIn}>Sign in with Google</button>

                    {/* Admin Link */}
                    <div className="mt-4 text-sm text-gray-600">
                        <span className="mr-1">Admin?</span>
                        <Link href="/admin/login" className="font-bold underline">Login</Link>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-2 text-sm text-gray-600">
                        <span>New user?</span>
                        <Link href="/signup" className="ml-1 font-bold underline">Signup</Link>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};


export default Login;