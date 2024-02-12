// import Navbar from "../navbar";
"use client";
import Navbar from "../navbar";
import Footer from '../footer';
// import Navbar from "../navbar";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
interface UserData {
  name: string;
  email: string;
  mobile: string;
  department: string;
}

const Profile = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',

  });


const id = localStorage.getItem("id");


  const fetchData = async () => {
    const id = localStorage.getItem("id")
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




  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace('/login');
    }
    const userData = localStorage.getItem("isAuthorized")

    if(userData === "sendRequest"){
      window.location.replace('/landing')
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
    <><Navbar />
      <div className="min-h-screen lg:flex items-center justify-center bg-gray-100 font-sans">
        <Toaster />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <div className="mt-8 lg:mt-0 md:mt-0 bg-white w-full max-w-2xl p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

          <div className="lg:flex sm:flex items-center space-x-4">
            <div
              className="lg:flex items-center justify-center cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <img
                src={`http://localhost:8000${data?.profilePhoto}`}
                className="rounded-full w-[200px] h-[200px] object-cover border-2 border-gray-300"
                alt="User Profile"
              />
            </div>
            <div className="lg:flex-1">
              <div className="lg:flex-1 sm:flex-1 grid ml-4 lg:grid-cols-2 sm:grid-cols-2 w-full">
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Name:
                    </label>
                    <p className="text-md">{formData?.name}</p>

                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Mobile:
                    </label>
                    <p className="text-md">
                      {formData?.mobile}
                    </p>
                  </div>

                </div>
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Email:
                    </label>
                    <p className="text-md">
                      {formData?.email}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-md font-medium text-gray-600">
                      Department:
                    </label>
                    <p className="text-md">
                      {formData?.department}
                    </p>
                  </div>
                </div>


              </div>
              <div className="flex ml-4 mt-4">
                <Link href={`/profile/editProfile/${id}`}><button className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded-md">Edit Profile</button></Link>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
            <div className="bg-white p-8 rounded-lg">
              <img
                src={`http://localhost:8000${data?.profilePhoto}`}
                className="rounded-full w-64 h-64 object-cover border-2 border-gray-300 mb-4"
                alt="User Profile"
              />
              <button
                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Go Back
              </button>

            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Profile;