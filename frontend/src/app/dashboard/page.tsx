"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"
import Footer from "../footer";
import Calendars from './Calendar'
import "rsuite/dist/rsuite.min.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Cards from "./Cards";
import Loading from '../../loading'
interface UserData {
  id: number;
  date: string;
  time: string;
  attendance: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const response = await fetch(`http://localhost:8000/api/attendance/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setData(result.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    } else {
      setLoading(true);
      fetchData();
      // Fetch user's name  
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="lg:ml-16 mt-8 w-full">
        <h1 className="text-3xl lg:ml-12 font-bold text-gray-800 mb-6">	🏠 Dashboard</h1>
        <Cards />
        <div className="flex-grow py-10 px-12">
          <div className="mx-auto flex justify-between">
            <div className="w-3/4 mr-6">
              { loading ? <Loading /> :
                data?.length === 0 ? <div className="text-center p-32 text-gray-500">No attendance data available</div> :
              <div className="overflow-hidden rounded-lg">
              
              <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((data, index) => (
                      <tr key={data.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data?.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{new Date(data.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.date.split('-').reverse().join('-')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.attendance ? data.time?.split(".")[0] : "-------"}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-white text-center `}>
                          <span className={`${data?.onLeave ? "bg-blue-400" : data?.attendance ? "bg-green-500" : "bg-red-500"} px-3 py-2 rounded-md inline-block w-24`}>
                            {
                              data?.onLeave ? "On Leave" : data?.attendance ? "Present" : "Absent"
                            }
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 sm:px-6">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={prevPage} disabled={currentPage === 1} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-gray-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150">
                      <SlArrowLeft className="w-4 h-4 mr-1" />
                      Prev
                    </button>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-gray-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150">
                      Next
                      <SlArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
              }
            </div>

            <div>
              <div className="bg-white rounded-md mt-[-30px]">
                <Calendars />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
