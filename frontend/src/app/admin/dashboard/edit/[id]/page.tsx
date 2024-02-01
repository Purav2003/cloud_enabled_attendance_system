// import Navbar from "../navbar";
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

interface UserData {
    name: string;
    email: string;
    mobile: string;
    department: string;
}

const Edit = ({ id }) => {
    const [data, setData] = useState<UserData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        department: '',

    });
    const [formDataone, setFormDataone] = useState({
        name: '',
        email: '',
        mobile: '',
        department: '',

    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            email: e.target.value,
        });
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            mobile: e.target.value,
        });
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            department: e.target.value,
        });
    };


    const fetchData = async () => {
        const id = window.location.pathname.split('/').pop();
        const API_URL = `http://localhost:8000/api/user/${id}`;
        console.log(API_URL);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data_new: UserData = await response.json();
            setData(data_new);
            setFormDataone({
                name: data_new.name,
                email: data_new.email,
                mobile: data_new.mobile,
                department: data_new.department,
            });
            setFormData({
                name: data_new.name,
                email: data_new.email,
                mobile: data_new.mobile,
                department: data_new.department,
            });
            console.log(data_new);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name + "hehe");
        formDataToSend.append('email', formData.email);
        formDataToSend.append('mobile', formData.mobile);
        formDataToSend.append('department', formData.department);

        console.log(formDataToSend)
        try {
            const id = window.location.pathname.split('/').pop();
            const response = await fetch(`http://localhost:8000/api/update/${id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                toast.success('Successfully signed up');
            }
            else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.replace('/login');
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showModal]);

    return (
        <div className="min-h-screen items-center justify-center bg-[#eee]">
            <Toaster />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

            <div className="bg-gray-200 my-12 p-8 rounded-lg  shadow-lg w-full md:w-1/2 lg:w-1/3 mx-auto ">
                <h1 className="text-4xl pl-8 font-bold text-black mb-4">Profile</h1>

                <div className="flex-1 items-center space-x-8">
                    {/* Left Side - User Photo */}
                    <div className="flex items-center justify-center"
                        onClick={() => setShowModal(true)}
                    >
                        <img
                            src={`http://localhost:8000${data?.profilePhoto}`}
                            className="border border-[#4a4a4a] rounded-full w-32 h-32 object-cover"
                            alt="User Profile"
                        />
                    </div>


                    {/* Right Side - User Details */}
                    <div>
                        <div className="text-lg text-black">
                            <form>
                                <div className="flex mt-4 items-center"><p className="font-bold pr-2">Name:</p>
                                    <input
                                        type="text"
                                        id="name"
                                        className="name bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter your name"
                                        value={formData?.name}
                                        required
                                    />                                </div><br />
                                <div className="flex items-center"><p className="font-bold pr-2">Mobile:</p>
                                    <input
                                        type="text"
                                        id="mobile"
                                        className="mobile bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter your Phone Number"
                                        value={formData?.mobile}
                                        onChange={handleMobileChange}
                                        required
                                    />                                </div><br />
                                <div className="flex items-center"><p className="font-bold pr-2">Email: </p>
                                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData?.email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter your email"
                                        required
                                    />                                </div><br />
                                <div className="flex items-center"><p className="font-bold pr-2 ">Department: </p>
                                    <input
                                        type="text"
                                        id="department"
                                        className="department bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter your Department"
                                        value={formData?.department}
                                        onChange={handleDepartmentChange}
                                        required
                                    />                                </div>
                                <button onClick={handleUpdate}>Update Values</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <div className={showModal ? "visible top-0 left-0 absolute w-full min-h-screen" : "hidden"}>
                <div className="bg-[rgba(0,0,0,0.5)] min-h-screen w-full flex items-center justify-center" onClick={() => setShowModal(false)}>
                    <div className="bg-white p-8 rounded-lg">
                        <img
                            src={`http://localhost:8000${data?.profilePhoto}`}
                            className="border border-[#4a4a4a] rounded-full w-64 h-64 object-cover"
                            alt="User Profile"
                        />
                        <button className="mt-4 p-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Edit;