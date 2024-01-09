"use client";
import hello from '../../assets/images/login.jpg'
import logo from '../../assets/images/logo.png'
import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { RxUpload } from "react-icons/rx";
// ... (previous imports)

const Signup = () => {
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        companyCode: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleNextClick = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handleBackClick = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSignupClick = () => {
        // Implement your signup logic using formData
        console.log('Signing up with data:', formData);
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="icon" href={logo.src} type="image/icon type" />
        <title>Attendace System</title>        
                    <div className={`overflow-hidden lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 gap-4 bg-[#000010] h-[100vh] ${step === 2 ? 'next' : step === 1 ? 'prev' : ''}`}>
                        <div><img src={hello.src} className="w-0 h-0 invisible sm:visible md:visible lg:visible lg:w-[50vw] object-cover md:w-[45vw] md:h-[100%] lg:h-[100vh]" /></div>
                        <div className="p-8 px-16 mt-[5%] bg-[#000010]">
                            <h1 className="lg:text-[65px] text-[35px] font-bold text-[white]">Sign up</h1><br />
                            <form className="max-w-full ">
                                {step === 1 && (
                                    <>
                                        <div className="signup-page mb-5 max-w-sm">
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-5 max-w-sm">
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-5 max-w-sm">
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Mobile</label>
                                            <input
                                                type="text"
                                                id="phone"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Enter your Phone Number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <button type="button" onClick={handleNextClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Next</button>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Photograph</label>
                                        <div className="flex flex-col signup-page">
                                            <label htmlFor="profile-photo" className="w-[20vw] h-[20vw] cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="profile-photo"
                                                    accept="image/*"
                                                    className="hidden w-[20vw] h-[20vw]"
                                                    onChange={handleFileChange}
                                                />
                                                <div className="w-[20vw] h-[20vw] bg-gray-200 border-2 rounded-md border-gray-300 flex items-center justify-center overflow-hidden">
                                                    {selectedFile ? (
                                                        <img
                                                            src={URL.createObjectURL(selectedFile)}
                                                            alt="Selected Profile Photo"
                                                            className="object-cover w-[20vw] h-[20vw]"

                                                        />
                                                    ) : (
                                                        <span className="text-center text-gray-500">Select Photo</span>
                                                    )}
                                                </div>
                                            </label>
                                            <div className="flex justify-between mt-5 max-w-sm">
                                                <button type="button" onClick={handleBackClick} className="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800">Back</button>
                                                <button type="button" onClick={handleNextClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Next</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <div className="mb-5 max-w-sm signup-page">
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Company Code</label>
                                            <input
                                                type="text"
                                                id="companyCode"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Enter your Company Code"
                                                value={formData.companyCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-between mt-5 max-w-sm">
                                            <button type="button" onClick={handleBackClick} className="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800">Back</button>
                                            <button type="button" onClick={handleSignupClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm max-w-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Signup</button>

                                        </div><br></br>
                                        <div className='w-full'>
                                        </div>

                                    </>
                                )}
                                
                            </form><br></br>
                            <h1 className="text-[white]">Back To <Link href='/login' className='font-bold underline'> Login </Link></h1>

                        </div>

                    </div>                               
        </>
    );
}

export default Signup;
