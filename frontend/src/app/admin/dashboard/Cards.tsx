import React from 'react';
import { useState, useEffect ,useCallback} from 'react';

const DashCards = () => {
    const [data, setData] = useState([]);
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [leaveCount, setLeaveCount] = useState(0);
    const companyName = localStorage.getItem("companyName");

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const companyCode = localStorage.getItem("companyCode");
        const response = await fetch(`http://localhost:8000/api/allAttendance/${companyCode}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        setData(result);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    useEffect(() => {
        let presentCount = 0;
        let leaveCount = 0;
        let absentCount = 0;

        data?.filter((datas) => new Date(datas.date).toLocaleDateString() === new Date().toLocaleDateString()).forEach((datas) => {
            datas?.attendance ? presentCount++ : datas?.onLeave ? leaveCount++ : absentCount++;
        });

        setPresentCount(presentCount);
        setAbsentCount(absentCount);
        setLeaveCount(leaveCount);
    }, [data]);
    
    return (
        <div className='container mx-auto p-8'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="border rounded-lg p-6 bg-[#FEF4E4]">
                    <h2 className="text-xl font-semibold mb-4">Company Name</h2>
                    <div>
                        <p className="text-gray-600">{companyName} </p>
                    </div>
                </div>

                <div className="border rounded-lg p-6 bg-[rgba(0,125,0,0.3)]">
                    <h2 className="text-xl font-semibold mb-4">Present Today</h2>
                    <div>
                        <p className="text-gray-600">{presentCount} </p>
                    </div>
                </div>

                <div className="border rounded-lg p-6 bg-[rgba(63,122,244,0.3)]  ">
                    <h2 className="text-xl font-semibold mb-4">Absent Today</h2>
                    <div>
                        <p className="text-gray-600">{absentCount} </p>
                    </div>
                </div>

                <div className="border rounded-lg p-6 bg-[rgba(135,17,237,0.3)] ">
                    <h2 className="text-xl font-semibold mb-4">On Leave Today</h2>
                    <div>
                        <p className="text-gray-600">{leaveCount} </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashCards;
