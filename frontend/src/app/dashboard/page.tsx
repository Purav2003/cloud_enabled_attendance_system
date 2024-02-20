"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Demo from "./Demo";
import Footer from "../footer";
import Calendars from "./Calendar";
import "rsuite/dist/rsuite.min.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Cards from "./Cards";
import Loading from "../../loading";
import { LuLayoutDashboard } from "react-icons/lu";
import { Select } from 'antd';

const { Option } = Select;

interface UserData {
  date: string;
  time: string;
  attendance: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const itemsPerPage = 5;

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const props = {
    selectedYear,
    selectedMonth,
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const formDataToSend = new FormData();
      formDataToSend.append('year', selectedYear);
      formDataToSend.append('month', selectedMonth);
      const response = await fetch(`http://localhost:8000/api/attendance/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const result = await response.json();
      console.log(result);
      if (result?.status === "error") {
        setData([]);
        setLoading(false);
        return;
      } else {
        // Generate IDs starting from 1
  
        // Sort data by date in descending order
        const sortedData = result.sort((a: UserData, b: UserData) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
  
        // Filter out data until today
        const today = new Date();
        const filteredData = sortedData.filter((item: UserData) => {
          const itemDate = new Date(item.date);
          return itemDate <= today;
        });
        setData(filteredData);
        const newData = filteredData?.map((item: UserData, index: number) => ({
          ...item,
          id: index + 1,
        }));
        setData(newData);
  
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      window.location.replace("/admin/dashboard");
    }
    if (!token) {
      window.location.replace("/login");
    } else {
      setLoading(true);
      fetchData();
    }
  }, [selectedYear, selectedMonth]);

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
    <div className="flex flex-col lg:flex-row w-full">
      <Sidebar />
      <div className="lg:ml-16 mt-8 w-full">
        <h1 className="lg:text-3xl lg:ml-12 sm:ml-8 ml-4 mt-12 lg:mt-0 text-xl font-bold text-gray-800 flex items-center mb-6"><LuLayoutDashboard />&nbsp; Dashboard</h1>
        <Cards />
        <div className="flex-grow py-10 px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="mx-auto flex flex-col lg:flex-row justify-between">
            <div className="lg:w-3/4 mr-0 lg:mr-6 mb-8 lg:mb-0">
              {/* Dropdown for Year */}
              <Select placeholder="Select Year" className="z-0" value={selectedYear} onChange={handleYearChange} style={{ width: 120, marginRight: 10,zIndex:-100 }}>
                <Option value="2023">2023</Option>
                <Option value="2024">2024</Option>
                {/* Add more years as needed */}
              </Select>
              {/* Dropdown for Month */}
              <Select placeholder="Select Month" value={selectedMonth} onChange={handleMonthChange} style={{ width: 120,zIndex:-100 }}>
                <Option value="01">January</Option>
                <Option value="02">February</Option>
                <Option value="03">March</Option>
                <Option value="04">April</Option>
                <Option value="05">May</Option>
                <Option value="06">June</Option>
                <Option value="07">July</Option>
                <Option value="08">August</Option>
                <Option value="09">September</Option>
                <Option value="10">October</Option>
                <Option value="11">November</Option>
                <Option value="12">December</Option>
              </Select>

              <br /><br></br>
              {loading ? <Loading /> :
                data?.length === 0 ? <div className="text-center p-32 text-gray-500">No attendance data available</div> :
                  <div className="rounded-lg w-3/4 lg:w-full lg:max-w-full sm:w-full sm:max-w-full max-w-3/4">
                    <table className="overflow-visible max-w-3/4 lg:w-full lg:max-w-full sm:w-full sm:max-w-full  divide-y divide-gray-200 ">
                      <thead>
                        <tr>
                          <th className="lg:px-6 px-2 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="lg:px-6 px-2 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                          <th className="lg:px-6 px-2 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="lg:px-6 px-2 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="lg:px-6 px-2 py-2 lg:py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentItems.map((data, index) => (
                          <tr key={index + 1}>
                            <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{data.id}</td>
                            <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-center">{new Date(data.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                            <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.date.split('-').reverse().join('-')}</td>
                            <td className="lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-center">{data.attendance ? data.time?.split(".")[0] : "-------"}</td>
                            <td className={`lg:px-6 px-2 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500 text-white text-center `}>
                              <span className={`${data?.onLeave ? "bg-blue-400" : data?.attendance ? "bg-green-500" : "bg-red-500"} lg:px-3 text-[11px] lg:text-sm px-0 py-1 lg:py-2 rounded-md inline-block w-16 lg:w-24`}>
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

            <div className="w-full lg:w-auto">
              <div className="bg-white rounded-md">
                <Calendars {...props} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
