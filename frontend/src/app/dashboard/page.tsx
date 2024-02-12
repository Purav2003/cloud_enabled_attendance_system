"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { PieChart } from "@mui/x-charts";

interface UserData {
  id: number;
  date: string;
  time: string;
  attendance: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const [thisMonthsAttendance, setThisMonthsAttendance] = useState(0);
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
      console.log(result) // Reverse the data array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    } else {
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

  useEffect(() => {
    const present = currentItems.filter(item => item.attendance).length;
    const absent = currentItems.length - present;
    setPresentCount(present);
    setAbsentCount(absent);

    const pieChart = [
      { category: "Present", value: present },
      { category: "Absent", value: absent }
    ];

    setPieChartData(pieChart);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const presentC = data.filter(item => {
      const itemDate = new Date(item.date);
      return item.attendance && itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
    
    const absentC = data.filter(item => {
      const itemDate = new Date(item.date);
      return !item.attendance && itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    }).length;
    
    const total = (presentC * 100) / (presentC + absentC)
    // Calculate the total number of days in the current month

    setThisMonthsAttendance(total)

  }, [currentItems, data]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <br /><br></br><br></br>
      <>
        <div className="flex justify-between mb-4 px-12">
\          <div className="flex-1 bg-gray-100 shadow p-4 rounded-md mr-4">
            <h3 className="text-lg font-semibold mb-2">User's Name</h3>
            <p>{data[0]?.user}</p>
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded-md mr-4">
            <h3 className="text-lg font-semibold mb-2">This Month's Attendance</h3>
            <p>{thisMonthsAttendance.toFixed(2)} %</p>
          </div>

          <div className="flex-1 bg-gray-100 p-4 rounded-md mr-4">
            <h3 className="text-lg font-semibold mb-2">Third Box</h3>
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Fourth Box</h3>
          </div>
        </div>
        <div className="flex-grow bg-gray-50 py-10 px-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            <div className="w-3/4 mr-6">

              <h1 className="text-3xl font-semibold text-gray-800 mb-6">Attendance Dashboard</h1>
              <div className="overflow-hidden border border-gray-200 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50 divide-y divide-gray-200">
                    {currentItems.map((data,index) => (
                      <tr key={data.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data?.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{new Date(data.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.date.split('-').reverse().join('-')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.attendance?data.time?.split(".")[0]:""}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-white text-center`}><span className={`${data.attendance ? "bg-[rgba(0,121,0,0.5)]" : "bg-[rgba(121,0,0,0.5)]"} px-2 py-1 rounded-md shadow-lg`}>{data.attendance ? "Present" : "Absent"}</span></td>
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
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-7">Attendance Summary</h2>
              <div className="bg-white rounded-md p-4 w-[80%] mt-4 border shadow">
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${(item.value * 100 / (presentCount + absentCount)).toFixed(2)}%`,
                      data: pieChartData,
                    },
                  ]}
                  width={400}
                  height={200}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </div>
  );
}
