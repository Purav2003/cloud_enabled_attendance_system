"use client";
import { useState,useEffect } from "react";
import { Calendar, Badge } from 'rsuite';

const Calendars = () => {
    const [datesWithBadges,setDateWithBadges] = useState([]);

    const fetchData = async () => {
        const id = localStorage.getItem("id");
        const API_URL = `http://localhost:8000/api/absent/${id}`;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setDateWithBadges(data);
        } catch (error) {
            console.error(error);
        }
    }

    const renderCell = (date) => {
        const dateString = date.toISOString().split('T')[0];
        const hasBadge = datesWithBadges.includes(dateString);

        return (
            <div style={{ height: '100%', width: '100%' }}>
                {hasBadge && <Badge content='A'  style={{ backgroundColor: 'red', color: 'white', marginTop: 2 }} />}
            </div>
        );
    };
useEffect(() => {
        fetchData();
    }, []);
    return (
        <div style={{ width: 280 }}>
            <Calendar compact bordered renderCell={renderCell} />
        </div>
    );
};

export default Calendars;
